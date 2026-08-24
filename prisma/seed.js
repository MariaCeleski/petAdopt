import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('12345678', 12);

  const adopter = await prisma.user.upsert({
    where: { email: 'adopter@petadopt.com' },
    update: {},
    create: {
      email: 'adopter@petadopt.com',
      name: 'João Adotante',
      password: hashedPassword,
      type: 'ADOPTER',
      emailVerified: new Date(),
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@petadopt.com' },
    update: {},
    create: {
      email: 'owner@petadopt.com',
      name: 'Maria Proprietária',
      password: hashedPassword,
      type: 'INDIVIDUAL_OWNER',
      emailVerified: new Date(),
    },
  });

  const shelterAdmin = await prisma.user.upsert({
    where: { email: 'shelter@petadopt.com' },
    update: {},
    create: {
      email: 'shelter@petadopt.com',
      name: 'Carlos Abrigo',
      password: hashedPassword,
      type: 'SHELTER_ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create demo shelter
  const shelter = await prisma.shelter.upsert({
    where: { adminId: shelterAdmin.id },
    update: {},
    create: {
      adminId: shelterAdmin.id,
      name: 'Abrigo de Animais São Francisco',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      phone: '(11) 1234-5678',
      email: 'contato@abrigosafrancisco.org.br',
      website: 'https://abrigosafrancisco.org.br',
      description: 'Abrigo dedicado ao resgate e cuidado de animais abandonados.',
      isVerified: true,
    },
  });

  // Create demo pets
  await prisma.pet.create({
    data: {
      name: 'Buddy',
      species: 'DOG',
      breed: 'Golden Retriever',
      age: '3 anos',
      size: 'LARGE',
      gender: 'MALE',
      color: 'Dourado',
      description: 'Buddy é um cão amigável e carinhoso, perfeito para famílias com crianças.',
      isNeutered: true,
      isVaccinated: true,
      personality: ['Amigável', 'Carinhoso', 'Brincalhão'],
      location: 'São Paulo, SP',
      ownerId: owner.id,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&q=80',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80'
      ],
    },
  });

  await prisma.pet.create({
    data: {
      name: 'Luna',
      species: 'CAT',
      breed: 'Siamês',
      age: '2 anos',
      size: 'SMALL',
      gender: 'FEMALE',
      color: 'Branco e marrom',
      description: 'Luna é uma gata elegante e independente, ideal para apartamentos.',
      isNeutered: true,
      isVaccinated: true,
      personality: ['Independente', 'Carinhosa', 'Calma'],
      location: 'São Paulo, SP',
      ownerId: shelterAdmin.id,
      shelterId: shelter.id,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=500&q=80'
      ],
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });