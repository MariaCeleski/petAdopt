#!/usr/bin/env node

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    const db = new Database('prisma/dev.db');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const insertUser = db.prepare(`
      INSERT OR REPLACE INTO users (id, email, name, password, type, emailVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    const adopter = { 
      id: 'adopter-1', 
      email: 'maria.adotante@example.com', 
      name: 'Maria Santos', 
      password: hashedPassword, 
      type: 'ADOPTER', 
      emailVerified: now, 
      createdAt: now, 
      updatedAt: now 
    };

    const individualOwner = { 
      id: 'owner-1', 
      email: 'joao.dono@example.com', 
      name: 'João Silva', 
      password: hashedPassword, 
      type: 'INDIVIDUAL_OWNER', 
      emailVerified: now, 
      createdAt: now, 
      updatedAt: now 
    };

    const shelterAdmin = { 
      id: 'shelter-admin-1', 
      email: 'admin@abrigo.com', 
      name: 'Ana Oliveira', 
      password: hashedPassword, 
      type: 'SHELTER_ADMIN', 
      emailVerified: now, 
      createdAt: now, 
      updatedAt: now 
    };

    // Insert users
    insertUser.run(adopter.id, adopter.email, adopter.name, adopter.password, adopter.type, adopter.emailVerified, adopter.createdAt, adopter.updatedAt);
    insertUser.run(individualOwner.id, individualOwner.email, individualOwner.name, individualOwner.password, individualOwner.type, individualOwner.emailVerified, individualOwner.createdAt, individualOwner.updatedAt);
    insertUser.run(shelterAdmin.id, shelterAdmin.email, shelterAdmin.name, shelterAdmin.password, shelterAdmin.type, shelterAdmin.emailVerified, shelterAdmin.createdAt, shelterAdmin.updatedAt);

    console.log('✅ Users created successfully!');

    // Create shelter
    const insertShelter = db.prepare(`
      INSERT OR REPLACE INTO shelters (id, name, address, city, state, zipCode, phone, email, website, description, images, isVerified, createdAt, updatedAt, adminId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const shelter = {
      id: 'shelter-1',
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
      isVerified: 1, // SQLite uses 1/0 for boolean
      createdAt: now,
      updatedAt: now,
      adminId: shelterAdmin.id
    };

    insertShelter.run(shelter.id, shelter.name, shelter.address, shelter.city, shelter.state, shelter.zipCode, shelter.phone, shelter.email, shelter.website, shelter.description, shelter.images, shelter.isVerified, shelter.createdAt, shelter.updatedAt, shelter.adminId);
    console.log('✅ Shelter created successfully!');

    // Create sample pets
    const insertPet = db.prepare(`
      INSERT OR REPLACE INTO pets (id, name, species, breed, age, size, gender, color, description, isNeutered, isVaccinated, healthStatus, personality, images, status, location, createdAt, updatedAt, ownerId, shelterId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const pets = [
      {
        id: 'pet-1',
        name: 'Rex',
        species: 'DOG',
        breed: 'Golden Retriever',
        age: '3 anos',
        size: 'LARGE',
        gender: 'MALE',
        color: 'Dourado',
        description: 'Rex é um cão carinhoso e brincalhão, adora crianças e outros animais.',
        isNeutered: 1,
        isVaccinated: 1,
        healthStatus: 'Excelente estado de saúde, vermifugado recentemente.',
        personality: JSON.stringify(['Brincalhão', 'Carinhoso', 'Obediente', 'Sociável']),
        images: JSON.stringify(['https://example.com/rex1.jpg', 'https://example.com/rex2.jpg']),
        status: 'AVAILABLE',
        location: 'São Paulo, SP',
        createdAt: now,
        updatedAt: now,
        ownerId: individualOwner.id,
        shelterId: null
      },
      {
        id: 'pet-2',
        name: 'Luna',
        species: 'CAT',
        breed: 'Siamês',
        age: '2 anos',
        size: 'SMALL',
        gender: 'FEMALE',
        color: 'Branco e Marrom',
        description: 'Luna é uma gata elegante e independente, muito carinhosa com seus donos.',
        isNeutered: 1,
        isVaccinated: 1,
        healthStatus: 'Saudável, sem problemas conhecidos.',
        personality: JSON.stringify(['Independente', 'Carinhosa', 'Elegante', 'Calma']),
        images: JSON.stringify(['https://example.com/luna1.jpg']),
        status: 'AVAILABLE',
        location: 'São Paulo, SP',
        createdAt: now,
        updatedAt: now,
        ownerId: shelterAdmin.id,
        shelterId: shelter.id
      },
      {
        id: 'pet-3',
        name: 'Bolt',
        species: 'DOG',
        breed: 'Border Collie',
        age: '5 anos',
        size: 'MEDIUM',
        gender: 'MALE',
        color: 'Preto e Branco',
        description: 'Bolt é muito inteligente e ativo, precisa de bastante exercício.',
        isNeutered: 0,
        isVaccinated: 1,
        healthStatus: 'Saudável, precisa castrar.',
        personality: JSON.stringify(['Inteligente', 'Ativo', 'Leal', 'Protetor']),
        images: JSON.stringify(['https://example.com/bolt1.jpg', 'https://example.com/bolt2.jpg', 'https://example.com/bolt3.jpg']),
        status: 'AVAILABLE',
        location: 'São Paulo, SP',
        createdAt: now,
        updatedAt: now,
        ownerId: shelterAdmin.id,
        shelterId: shelter.id
      },
      {
        id: 'pet-4',
        name: 'Mimi',
        species: 'CAT',
        breed: 'Persa',
        age: '4 anos',
        size: 'SMALL',
        gender: 'FEMALE',
        color: 'Branco',
        description: 'Mimi é uma gata muito dócil e caseira, adora carinho.',
        isNeutered: 1,
        isVaccinated: 1,
        healthStatus: 'Necessita cuidados especiais com pelos longos.',
        personality: JSON.stringify(['Dócil', 'Caseira', 'Carinhosa', 'Tranquila']),
        images: JSON.stringify(['https://example.com/mimi1.jpg']),
        status: 'PENDING',
        location: 'São Paulo, SP',
        createdAt: now,
        updatedAt: now,
        ownerId: individualOwner.id,
        shelterId: null
      }
    ];

    pets.forEach(pet => {
      insertPet.run(pet.id, pet.name, pet.species, pet.breed, pet.age, pet.size, pet.gender, pet.color, pet.description, pet.isNeutered, pet.isVaccinated, pet.healthStatus, pet.personality, pet.images, pet.status, pet.location, pet.createdAt, pet.updatedAt, pet.ownerId, pet.shelterId);
    });

    console.log('✅ Pets created successfully!');

    // Create sample adoption request
    const insertAdoption = db.prepare(`
      INSERT OR REPLACE INTO adoptions (id, status, message, adopterInfo, rejectionReason, createdAt, updatedAt, approvedAt, completedAt, petId, adopterId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const adopterInfo = JSON.stringify({
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
        currentPets: [{
          species: 'cat',
          breed: 'SRD',
          age: '6 anos',
        }],
        veterinarianInfo: 'Dr. Carlos - Clínica VetCare',
      },
      motivation: {
        whyAdopt: 'Quero dar um lar amoroso para um animal que precisa',
        expectedCommitment: '15+ anos de cuidado e amor',
        availableTime: '4-6 horas diárias para interação',
      },
    });

    insertAdoption.run(
      'adoption-1',
      'PENDING',
      'Gostaria muito de adotar a Mimi. Tenho experiência com gatos e posso oferecer muito carinho.',
      adopterInfo,
      null,
      now,
      now,
      null,
      null,
      'pet-4', // Mimi
      adopter.id
    );

    console.log('✅ Adoption request created successfully!');

    db.close();

    console.log('🎉 Database seeded successfully!');
    console.log(`✅ Created users: 3`);
    console.log(`✅ Created shelter: 1`);
    console.log(`✅ Created pets: 4`);
    console.log(`✅ Created adoption requests: 1`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();