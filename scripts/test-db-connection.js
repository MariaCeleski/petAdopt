#!/usr/bin/env node

import 'dotenv/config';
import { Pool } from 'pg';

async function testConnection() {
  try {
    console.log('🔗 Testing database connection...');
    console.log('📍 Database URL:', process.env.DATABASE_URL ? 'Configured' : 'Not configured');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Test direct PostgreSQL connection
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1 // Only 1 connection for testing
    });
    
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    // Test table existence
    const tableCount = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    console.log(`📋 Tables in database: ${tableCount.rows[0].count}`);
    
    client.release();
    await pool.end();
    
    if (parseInt(tableCount.rows[0].count) === 0) {
      console.log('⚠️  Database is empty. Schema needs to be pushed.');
      return false;
    } else {
      console.log('✅ Database has tables. Schema already exists.');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 This might be because:');
    console.error('   - PostgreSQL server is not running');
    console.error('   - DATABASE_URL is incorrect');
    console.error('   - Network connectivity issues');
    
    return false;
  }
}

const hasSchema = await testConnection();
process.exit(hasSchema ? 0 : 1);