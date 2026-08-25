# Prisma Schema Constraints and Business Rules

## Database Integrity Rules

### Referential Integrity

#### User -> Pet Relationship
- **Constraint**: `Pet.ownerId` → `User.id`
- **Rule**: Pets must have valid owners
- **Delete Behavior**: Restricted (pets should be archived, not deleted)
- **Business Logic**: When user is deactivated, pets status should change to `UNAVAILABLE`

#### User -> Adoption Relationship
- **Constraint**: `Adoption.adopterId` → `User.id`
- **Rule**: Adoptions must have valid adopters
- **Delete Behavior**: Restricted (preserve adoption history)

#### Pet -> Adoption Relationship
- **Constraint**: `Adoption.petId` → `Pet.id`  
- **Rule**: Adoptions must reference valid pets
- **Delete Behavior**: Restricted (preserve adoption history)

#### User -> Shelter Relationship
- **Constraint**: `Shelter.adminId` → `User.id` (UNIQUE)
- **Rule**: Each shelter has exactly one admin, each user can admin max one shelter
- **Delete Behavior**: Cascade (if admin deleted, shelter should be archived)

#### Shelter -> Pet Relationship
- **Constraint**: `Pet.shelterId` → `Shelter.id` (OPTIONAL)
- **Rule**: Pets can optionally belong to shelters
- **Delete Behavior**: Set NULL (pets remain but lose shelter association)

#### NextAuth Integration
- **Constraint**: `Account.userId` → `User.id` (CASCADE)
- **Constraint**: `Session.userId` → `User.id` (CASCADE)
- **Rule**: OAuth accounts and sessions are tied to users and deleted with users

### Business Logic Constraints

#### Pet Status Rules
```sql
-- Pet can only be ADOPTED if there's a COMPLETED adoption
CHECK (status != 'ADOPTED' OR EXISTS (
  SELECT 1 FROM adoptions 
  WHERE pet_id = id AND status = 'COMPLETED'
))

-- Pet with PENDING status should have pending adoptions
CHECK (status != 'PENDING' OR EXISTS (
  SELECT 1 FROM adoptions 
  WHERE pet_id = id AND status IN ('PENDING', 'APPROVED')
))
```

#### Adoption Status Workflow
```sql
-- Adoption dates must follow logical sequence
CHECK (
  approved_at IS NULL OR approved_at >= created_at
)
CHECK (
  completed_at IS NULL OR (approved_at IS NOT NULL AND completed_at >= approved_at)
)
```

#### User Type Business Rules
- `ADOPTER`: Can create adoption requests, cannot create pets
- `INDIVIDUAL_OWNER`: Can create pets, manage adoption requests for their pets
- `SHELTER_ADMIN`: Can create pets, manage shelter, manage adoption requests

#### Image Storage Rules
- Pet images array limited to 10 items max (enforced in application)
- Shelter images array limited to 20 items max (enforced in application)
- All image URLs must be valid HTTPS URLs (enforced in validation layer)

### Performance Optimization Indexes

#### Pet Search Indexes
```sql
-- Basic filters
CREATE INDEX idx_pets_species_status ON pets(species, status);
CREATE INDEX idx_pets_size_status ON pets(size, status);
CREATE INDEX idx_pets_gender_status ON pets(gender, status);

-- Location-based searches
CREATE INDEX idx_pets_location ON pets(location);

-- Combined filters for common searches
CREATE INDEX idx_pets_species_size_status ON pets(species, size, status);

-- Owner relationship
CREATE INDEX idx_pets_owner_id ON pets(owner_id);

-- Chronological ordering
CREATE INDEX idx_pets_created_at ON pets(created_at);
CREATE INDEX idx_pets_updated_at ON pets(updated_at);
```

#### Adoption Management Indexes
```sql
-- Status-based queries
CREATE INDEX idx_adoptions_status ON adoptions(status);
CREATE INDEX idx_adoptions_status_created ON adoptions(status, created_at);

-- User-based queries  
CREATE INDEX idx_adoptions_adopter_id ON adoptions(adopter_id);

-- Pet-based queries
CREATE INDEX idx_adoptions_pet_id ON adoptions(pet_id);

-- Date-based queries
CREATE INDEX idx_adoptions_created_at ON adoptions(created_at);
```

#### User and Authentication Indexes
```sql
-- Authentication
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(type);

-- NextAuth support
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE UNIQUE INDEX idx_sessions_token ON sessions(session_token);
```

#### Shelter Management Indexes
```sql
-- Location-based shelter search
CREATE INDEX idx_shelters_city_state ON shelters(city, state);

-- Verification status
CREATE INDEX idx_shelters_verified ON shelters(is_verified);

-- Activity tracking
CREATE INDEX idx_shelters_created_at ON shelters(created_at);
```

### Data Validation Rules

#### Email Validation
- Users must have unique, valid email addresses
- Email verification required before full account activation

#### Password Security
- Minimum 8 characters (enforced in application layer)
- Hashed with bcrypt using 12 salt rounds

#### Pet Data Validation
- All mandatory fields must be present: name, species, breed, age, size, gender, description
- Species limited to DOG, CAT enum values
- Size limited to SMALL, MEDIUM, LARGE enum values
- Gender limited to MALE, FEMALE enum values
- Status limited to defined PetStatus enum values

#### Adoption Data Validation
- AdopterInfo JSON must contain all required sections:
  - personalInfo: contact and address information
  - livingSituation: housing details and permissions
  - experience: pet ownership history
  - motivation: adoption reasoning

#### Image Upload Validation
- Maximum 5MB per image file
- Supported formats: JPEG, PNG, WebP
- Maximum 10 images per pet
- Image URLs stored as array in database

### Security Considerations

#### Data Privacy (LGPD Compliance)
- User personal data encrypted at rest
- Sensitive fields marked for privacy protection
- Audit trail for data access and modifications

#### Input Sanitization
- All user inputs validated against SQL injection
- XSS protection on text fields
- File upload validation for security

#### Access Control
- Row-level security based on user ownership
- API rate limiting per user type
- Session management with secure tokens

### Migration Strategy

When implementing schema changes:

1. **Add new optional fields first** - maintain backward compatibility
2. **Create indexes separately** - avoid blocking operations
3. **Test constraints on staging** - ensure business rules work
4. **Plan for rollback** - keep migration reversible
5. **Monitor performance** - watch for query plan changes

### Monitoring and Alerts

#### Performance Metrics
- Track query execution times for indexed operations
- Monitor connection pool utilization
- Alert on slow queries (>100ms for search operations)

#### Data Integrity Checks
- Regular validation of foreign key constraints
- Business rule validation (pet status consistency)
- Orphaned record detection and cleanup