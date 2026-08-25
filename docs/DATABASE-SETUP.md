# Database Setup Documentation

## Task 2.3: Database Connection and Migrations Configuration

### Overview

This document describes the completed database configuration for the PetAdopt platform, including connection pooling setup, schema migrations, and seed data for development.

### Configuration Components

#### 1. Database Schema (`prisma/schema.prisma`)

- **Database Provider**: SQLite (development-optimized)
- **Schema Version**: Compatible with Prisma 7.x
- **Models**: User, Pet, Adoption, Shelter, Account, Session
- **Features**: 
  - Complete relationship mapping
  - Optimized indexes for performance
  - JSON field storage for complex data
  - Enum types for controlled values

#### 2. Connection Pooling (`src/lib/database-pool.js`)

**Configuration:**
- **Max Connections**: 20 concurrent connections
- **Min Connections**: 5 maintained connections
- **Idle Timeout**: 30 seconds
- **Acquire Timeout**: 2 seconds  
- **Max Connection Uses**: 7,500 uses before retirement
- **Health Check Interval**: 10 seconds

**Features:**
- Automatic connection lifecycle management
- Health monitoring and connection recycling
- Query performance tracking
- Error handling and recovery
- Graceful shutdown procedures

#### 3. Database Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Generate Client | `npm run db:generate` | Generate Prisma client from schema |
| Push Schema | `npm run db:push` | Sync schema to database without migrations |
| Create Migration | `npm run db:migrate` | Create and apply migrations |
| Seed Database | `npm run db:seed` | Populate database with sample data |
| Test Pooling | `npm run db:test` | Validate connection pooling performance |
| Open Studio | `npm run db:studio` | Launch Prisma Studio GUI |

### Schema Structure

#### Core Models

**User Model:**
- Authentication data (email, password, OAuth)
- User types (Adopter, Individual Owner, Shelter Admin)
- Profile information and verification status

**Pet Model:**
- Complete pet information (species, breed, age, size)
- Health status and personality traits
- Image gallery support
- Adoption status tracking

**Adoption Model:**
- Adoption request workflow
- Adopter information collection
- Status tracking and approval flow
- Timestamp management

**Shelter Model:**
- Organization information
- Contact details and verification
- Multi-user management support

#### Relationships

```
User (1) ─── (N) Pet
User (1) ─── (N) Adoption
User (1) ─── (1) Shelter
Pet (1) ─── (N) Adoption
Shelter (1) ─── (N) Pet
```

### Sample Data

The seed script populates the database with:

**Users (3):**
- 1 Adopter (Maria Santos)
- 1 Individual Owner (João Silva)  
- 1 Shelter Admin (Ana Oliveira)

**Pets (4):**
- 2 Dogs (Rex, Bolt)
- 2 Cats (Luna, Mimi)
- Various sizes and adoption statuses

**Shelter (1):**
- Abrigo Patinhas Carinhosas
- Complete profile with verification

**Adoption Requests (1):**
- Sample adoption request for Mimi
- Complete adopter information

### Performance Optimization

#### Connection Pooling Benefits

1. **Resource Management**: Prevents connection exhaustion
2. **Performance**: Reduces connection overhead
3. **Reliability**: Automatic connection health checks
4. **Scalability**: Handles concurrent requests efficiently
5. **Monitoring**: Real-time performance statistics

#### Database Indexes

Optimized indexes for common query patterns:
- `pets(species, status)` - Pet catalog filtering
- `pets(size, status)` - Size-based searches  
- `pets(ownerId)` - Owner's pets lookup
- `adoptions(status)` - Adoption workflow queries
- `adoptions(adopterId, petId)` - User adoption history

### Development Workflow

#### First-Time Setup

```bash
# Generate Prisma client
npm run db:generate

# Create database and schema
npm run db:push

# Populate with sample data
npm run db:seed

# Test configuration
npm run db:test
```

#### Database Changes

```bash
# After schema changes
npm run db:push --accept-data-loss

# Regenerate client
npm run db:generate

# Reseed if needed
npm run db:seed
```

#### Validation

The connection pooling test validates:
- ✅ Basic database connectivity
- ✅ Connection pool statistics
- ✅ Concurrent query performance
- ✅ Complex joins and relationships
- ✅ Error handling
- ✅ Pool efficiency metrics

### Production Considerations

For production deployment:

1. **Database Provider**: Migrate to PostgreSQL
2. **Connection Limits**: Adjust pool sizes based on server capacity
3. **Monitoring**: Implement database performance monitoring
4. **Backup**: Set up automated database backups
5. **Security**: Enable SSL connections and access controls

### Requirements Compliance

**Task 2.3 Objectives:**

- ✅ **Connection Pooling**: Configured with optimized settings for performance
- ✅ **Initial Migrations**: Schema successfully created and synchronized
- ✅ **Development Seeds**: Realistic sample data populated
- ✅ **Validation**: Database connections tested and working correctly

**Referenced Requirements:**
- **Requirement 2.1**: Pet registry data models implemented
- **Requirement 12.3**: Database security and validation configured

### Troubleshooting

**Common Issues:**

1. **Database Lock Error**: Ensure no other processes are accessing the database file
2. **Permission Issues**: Check file system permissions on `prisma/dev.db`
3. **Connection Errors**: Verify database file path in configuration
4. **Schema Sync Issues**: Run `npm run db:push --accept-data-loss` to reset

**Debug Commands:**

```bash
# Check database status
node scripts/test-connection-pooling.js

# Validate Prisma configuration  
npx prisma validate

# View database structure
npm run db:studio
```

### Next Steps

With the database fully configured:

1. ✅ Connection pooling optimized for performance
2. ✅ Schema migrations completed successfully
3. ✅ Development data seeded and validated
4. ⏭️ Ready for application development (Task 3.1+)

The database foundation is now ready to support the PetAdopt platform's core functionality.