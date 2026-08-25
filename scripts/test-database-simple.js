#!/usr/bin/env node

import Database from 'better-sqlite3';

async function testDatabase() {
  try {
    console.log('🔗 Testing direct SQLite connection...');
    
    const db = new Database('prisma/dev.db');
    
    // Test basic connection
    const result = db.prepare('SELECT sqlite_version() as version').get();
    console.log('✅ SQLite connection successful!');
    console.log('📊 SQLite version:', result.version);
    
    // Check if tables exist
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all();
    
    console.log(`📋 Tables in database: ${tables.length}`);
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    if (tables.length > 0) {
      console.log('✅ Database schema exists.');
      
      // Test inserting a simple user
      try {
        const insertUser = db.prepare(`
          INSERT INTO users (id, email, name, type, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const now = new Date().toISOString();
        insertUser.run('test-id-123', 'test@example.com', 'Test User', 'ADOPTER', now, now);
        
        console.log('✅ Test user inserted successfully.');
        
        // Clean up test data
        db.prepare('DELETE FROM users WHERE id = ?').run('test-id-123');
        console.log('🧹 Test data cleaned up.');
        
      } catch (insertError) {
        console.log('⚠️  Could not test database insertion:', insertError.message);
      }
    } else {
      console.log('⚠️  Database is empty. Schema needs to be pushed.');
    }
    
    db.close();
    return tables.length > 0;
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

const success = await testDatabase();
process.exit(success ? 0 : 1);