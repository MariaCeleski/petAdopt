#!/usr/bin/env node
import { prisma } from './src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Create a test user first
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test Owner',
        password: hashedPassword,
        type: 'INDIVIDUAL_OWNER',
        emailVerified: new Date()
      }
    });

    console.log('✅ Test user created:', testUser.name);

    // Create a test pet
    const testPet = await prisma.pet.create({
      data: {
        name: 'Buddy',
        species: 'DOG',
        breed: 'Golden Retriever',
        age: '3 anos',
        size: 'LARGE',
        gender: 'MALE',
        color: 'Dourado',
        description: 'Buddy é um cão muito carinhoso e brincalhão. Adora crianças e outros animais. É perfeito para uma família ativa que possa dar muito amor e atenção.',
        isNeutered: true,
        isVaccinated: true,
        healthStatus: 'Excelente estado de saúde. Todas as vacinas em dia e vermifugado recentemente.',
        personality: JSON.stringify(['Brincalhão', 'Carinhoso', 'Obediente', 'Sociável']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80'
        ]),
        status: 'AVAILABLE',
        location: 'São Paulo, SP',
        ownerId: testUser.id
      }
    });

    console.log('✅ Test pet created:', testPet.name, 'ID:', testPet.id);
    console.log('🎉 Test complete! You can now visit: http://localhost:3000/pets/' + testPet.id);

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();