import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

const db = new Database('prisma/dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adopter = await prisma.user.upsert({
    where: { email: 'maria.adotante@example.com' },
    update: {},
    create: {
      email: 'maria.adotante@example.com',
      name: 'Maria Santos',
      password: hashedPassword,
      type: 'ADOPTER',
      emailVerified: new Date(),
    },
  });

  const individualOwner = await prisma.user.upsert({
    where: { email: 'joao.dono@example.com' },
    update: {},
    create: {
      email: 'joao.dono@example.com',
      name: 'João Silva',
      password: hashedPassword,
      type: 'INDIVIDUAL_OWNER',
      emailVerified: new Date(),
    },
  });

  const shelterAdmin = await prisma.user.upsert({
    where: { email: 'admin@abrigo.com' },
    update: {},
    create: {
      email: 'admin@abrigo.com',
      name: 'Ana Oliveira',
      password: hashedPassword,
      type: 'SHELTER_ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create shelter
  const shelter = await prisma.shelter.upsert({
    where: { adminId: shelterAdmin.id },
    update: {},
    create: {
      name: 'Abrigo Patinhas Carinhosas',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234567',
      phone: '(11) 99999-9999',
      email: 'contato@abrigo.com',
      website: 'https://abrigo.com',
      description: 'Abrigo dedicado ao resgate e cuidado de animais abandonados.',
      images: JSON.stringify([]),
      isVerified: true,
      adminId: shelterAdmin.id,
    },
  });

  // Create sample pets
  const pets = [
    {
      name: 'Rex',
      species: 'DOG',
      breed: 'Golden Retriever',
      age: '3 anos',
      size: 'LARGE',
      gender: 'MALE',
      color: 'Dourado',
      description: 'Rex é um cão carinhoso e brincalhão, adora crianças e outros animais.',
      isNeutered: true,
      isVaccinated: true,
      healthStatus: 'Excelente estado de saúde, vermifugado recentemente.',
      personality: JSON.stringify(['Brincalhão', 'Carinhoso', 'Obediente', 'Sociável']),
      images: JSON.stringify([
        'https://example.com/rex1.jpg',
        'https://example.com/rex2.jpg'
      ]),
      location: 'São Paulo, SP',
      ownerId: individualOwner.id,
    },
    {
      name: 'Luna',
      species: 'CAT',
      breed: 'Siamês',
      age: '2 anos',
      size: 'SMALL',
      gender: 'FEMALE',
      color: 'Branco e Marrom',
      description: 'Luna é uma gata elegante e independente, muito carinhosa com seus donos.',
      isNeutered: true,
      isVaccinated: true,
      healthStatus: 'Saudável, sem problemas conhecidos.',
      personality: JSON.stringify(['Independente', 'Carinhosa', 'Elegante', 'Calma']),
      images: JSON.stringify([
        'https://example.com/luna1.jpg'
      ]),
      location: 'São Paulo, SP',
      ownerId: shelterAdmin.id,
      shelterId: shelter.id,
    },
    {
      name: 'Bolt',
      species: 'DOG',
      breed: 'Border Collie',
      age: '5 anos',
      size: 'MEDIUM',
      gender: 'MALE',
      color: 'Preto e Branco',
      description: 'Bolt é muito inteligente e ativo, precisa de bastante exercício.',
      isNeutered: false,
      isVaccinated: true,
      healthStatus: 'Saudável, precisa castrar.',
      personality: JSON.stringify(['Inteligente', 'Ativo', 'Leal', 'Protetor']),
      images: JSON.stringify([
        'https://example.com/bolt1.jpg',
        'https://example.com/bolt2.jpg',
        'https://example.com/bolt3.jpg'
      ]),
      location: 'São Paulo, SP',
      ownerId: shelterAdmin.id,
      shelterId: shelter.id,
    },
    {
      name: 'Mimi',
      species: 'CAT',
      breed: 'Persa',
      age: '4 anos',
      size: 'SMALL',
      gender: 'FEMALE',
      color: 'Branco',
      description: 'Mimi é uma gata muito dócil e caseira, adora carinho.',
      isNeutered: true,
      isVaccinated: true,
      healthStatus: 'Necessita cuidados especiais com pelos longos.',
      personality: JSON.stringify(['Dócil', 'Caseira', 'Carinhosa', 'Tranquila']),
      images: JSON.stringify([
        'https://example.com/mimi1.jpg'
      ]),
      location: 'São Paulo, SP',
      status: 'PENDING',
      ownerId: individualOwner.id,
    },
  ];

  const createdPets = [];
  for (const petData of pets) {
    // Check if pet already exists by name and owner
    const existingPet = await prisma.pet.findFirst({
      where: {
        name: petData.name,
        ownerId: petData.ownerId
      }
    });
    
    let pet;
    if (existingPet) {
      pet = await prisma.pet.update({
        where: { id: existingPet.id },
        data: petData
      });
    } else {
      pet = await prisma.pet.create({
        data: petData
      });
    }
    createdPets.push(pet);
  }

  // Create sample adoption request
  const adoptionRequest = await prisma.adoption.create({
    data: {
      petId: createdPets[3].id, // Mimi (PENDING status)
      adopterId: adopter.id,
      adopterInfo: JSON.stringify({
        personalInfo: {
          fullName: 'Maria Santos',
          phone: '(11) 88888-8888',
          address: 'Rua das Palmeiras, 456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234567',
        },
        livingSituation: {
          housingType: 'apartment',
          hasYard: false,
          ownRent: 'rent',
          landlordApproval: true,
        },
        experience: {
          hadPetsBefore: true,
          currentPets: [
            {
              species: 'cat',
              breed: 'SRD',
              age: '6 anos',
            },
          ],
          veterinarianInfo: 'Dr. Carlos - Clínica VetCare',
        },
        motivation: {
          whyAdopt: 'Quero dar um lar amoroso para um animal que precisa',
          expectedCommitment: '15+ anos de cuidado e amor',
          availableTime: '4-6 horas diárias para interação',
        },
      }),
      message: 'Gostaria muito de adotar a Mimi. Tenho experiência com gatos e posso oferecer muito carinho.',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created users: ${[adopter, individualOwner, shelterAdmin].length}`);
  console.log(`Created shelter: ${shelter.name}`);
  console.log(`Created pets: ${createdPets.length}`);
  console.log(`Created adoption requests: 1`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });