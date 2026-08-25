#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('Testing direct Prisma connection...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:./dev.db"
      }
    }
  });
  
  try {
    const result = await prisma.$executeRaw`SELECT COUNT(*) as count FROM sqlite_master WHERE type='table';`;
    console.log('✅ Database connection successful!');
    console.log('Tables found:', result);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    await prisma.$disconnect();
  }
}

testConnection();