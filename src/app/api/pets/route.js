import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { petSchema, filterSchema } from '@/lib/validation/schemas';

/**
 * GET /api/pets - List pets with filters and pagination
 * Requirements: 2.1, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate filter parameters
    const filterData = {
      species: searchParams.get('species'),
      size: searchParams.get('size'), 
      gender: searchParams.get('gender'),
      location: searchParams.get('location'),
      search: searchParams.get('search') || searchParams.get('q'),
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12'
    };

    const validation = filterSchema.safeParse(filterData);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Invalid filter parameters',
        code: 'VALIDATION_ERROR',
        details: validation.error.format(),
        timestamp: new Date().toISOString(),
        path: '/api/pets'
      }, { status: 400 });
    }

    const { species, size, gender, location, search, page, limit } = validation.data;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause = {
      // Only show available pets in public listings (Requirement 4.1)
      status: 'AVAILABLE'
    };

    // Apply species filter (Requirement 4.2)
    if (species) {
      whereClause.species = species;
    }

    // Apply size filter (Requirement 4.3) 
    if (size) {
      whereClause.size = size;
    }

    // Apply gender filter (Requirement 4.5)
    if (gender) {
      whereClause.gender = gender;
    }

    // Apply location filter if provided
    if (location) {
      whereClause.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    // Apply text search (Requirement 4.6) - search in name and breed
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          breed: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Execute query with pagination
    const [pets, totalCount] = await Promise.all([
      prisma.pet.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              type: true
            }
          },
          shelter: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.pet.count({
        where: whereClause
      })
    ]);

    // Transform pets data for response
    const transformedPets = pets.map(pet => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      size: pet.size,
      gender: pet.gender,
      color: pet.color,
      description: pet.description,
      isNeutered: pet.isNeutered,
      isVaccinated: pet.isVaccinated,
      healthStatus: pet.healthStatus,
      personality: Array.isArray(pet.personality) 
        ? pet.personality 
        : (pet.personality ? JSON.parse(pet.personality) : []),
      images: Array.isArray(pet.images) 
        ? pet.images 
        : (pet.images ? JSON.parse(pet.images) : []),
      status: pet.status,
      location: pet.location,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
      owner: pet.owner,
      shelter: pet.shelter
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      pets: transformedPets,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        species,
        size,
        gender,
        location,
        search
      }
    });

  } catch (error) {
    console.error('GET /api/pets error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch pets',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      path: '/api/pets'
    }, { status: 500 });
  }
}

/**
 * POST /api/pets - Create new pet
 * Requirements: 2.1, 2.2, 2.4
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
        path: '/api/pets'
      }, { status: 401 });
    }

    // Verify user type - only pet owners can create pets
    if (!['SHELTER_ADMIN', 'INDIVIDUAL_OWNER'].includes(session.user.type)) {
      return NextResponse.json({
        error: 'Only pet owners can create pet profiles',
        code: 'FORBIDDEN',
        timestamp: new Date().toISOString(),
        path: '/api/pets'
      }, { status: 403 });
    }

    const petData = await request.json();
    
    // Validate pet data (Requirements 2.2, 2.4)
    const validation = petSchema.safeParse(petData);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Pet validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.format(),
        timestamp: new Date().toISOString(),
        path: '/api/pets'
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // Prepare data for database - handle array fields for SQLite
    const dbData = {
      ...validatedData,
      personality: JSON.stringify(validatedData.personality || []),
      images: JSON.stringify(validatedData.images || []),
      ownerId: session.user.id,
      status: 'AVAILABLE' // Default status for new pets
    };

    // Check if user is shelter admin and add shelter association
    if (session.user.type === 'SHELTER_ADMIN') {
      const shelter = await prisma.shelter.findUnique({
        where: { adminId: session.user.id }
      });
      
      if (shelter) {
        dbData.shelterId = shelter.id;
      }
    }

    // Create pet in database
    const pet = await prisma.pet.create({
      data: dbData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        shelter: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true
          }
        }
      }
    });

    // Transform response data
    const transformedPet = {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      size: pet.size,
      gender: pet.gender,
      color: pet.color,
      description: pet.description,
      isNeutered: pet.isNeutered,
      isVaccinated: pet.isVaccinated,
      healthStatus: pet.healthStatus,
      personality: JSON.parse(pet.personality),
      images: JSON.parse(pet.images),
      status: pet.status,
      location: pet.location,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
      owner: pet.owner,
      shelter: pet.shelter
    };

    return NextResponse.json({
      message: 'Pet created successfully',
      pet: transformedPet
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/pets error:', error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json({
        error: 'Pet with similar data already exists',
        code: 'CONFLICT',
        timestamp: new Date().toISOString(),
        path: '/api/pets'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      error: 'Failed to create pet',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      path: '/api/pets'
    }, { status: 500 });
  }
}