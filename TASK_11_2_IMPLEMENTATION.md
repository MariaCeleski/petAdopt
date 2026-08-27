# Task 11.2 Implementation Summary: Criar API routes para adoção

## Overview
Implemented complete adoption workflow API routes for the PetAdopt platform, enabling adopters to submit adoption requests and pet owners to approve, reject, or complete adoptions.

## Files Created

### 1. POST/GET /api/adoptions (`src/app/api/adoptions/route.js`)
Implements adoption request creation and listing endpoints.

#### POST /api/adoptions - Create Adoption Request
**Requirements Met:**
- Requirement 6.3: WHEN adoption form is submitted, THE Adoption_Workflow SHALL create adoption request
- Requirement 6.4: THE Adoption_Workflow SHALL notify Pet_Owner via email about new request

**Features:**
- Authentication required (adopters only)
- Validates adoption form data using Zod schema
- Checks pet exists and has AVAILABLE status
- Prevents duplicate pending requests for same pet
- Creates adoption record with PENDING status
- Updates pet status to PENDING
- Sends email notification to pet owner
- Returns created adoption request with parsed JSON fields

**Key Validations:**
- Only ADOPTER user type can create adoption requests
- Pet must exist and be in AVAILABLE status
- Adoption form data must pass schema validation
- Prevents duplicate pending requests for the same pet

#### GET /api/adoptions - List Adoption Requests
**Requirements Met:**
- Requirement 6.8: THE Adoption_Workflow SHALL track adoption request history and status

**Features:**
- Filters by user role and ID
  - ADOPTER users see only their own adoption requests
  - SHELTER_ADMIN/INDIVIDUAL_OWNER users see adoption requests for their pets
- Supports pagination (page, limit)
- Returns formatted adoption data with parsed adopterInfo and pet images
- Ordered by creation date (descending)

### 2. PATCH/GET /api/adoptions/[id] (`src/app/api/adoptions/[id]/route.js`)
Implements adoption status updates and individual adoption request retrieval.

#### PATCH /api/adoptions/[id] - Update Adoption Status
**Requirements Met:**
- Requirement 6.5: WHEN Pet_Owner reviews request, THE Adoption_Workflow SHALL allow approval, rejection, or maintaining pending status
- Requirement 6.6: WHEN adoption is approved, THE Adoption_Workflow SHALL notify Adopter via email
- Requirement 6.7: WHEN adoption is completed, THE Adoption_Workflow SHALL update pet status to "adopted" and prevent status updates when adoption is rejected or incomplete
- Requirement 6.8: Track adoption request history and status

**Features:**
- Authorization checks based on status change type:
  - APPROVED/REJECTED: Only pet owner
  - COMPLETED: Only pet owner
  - CANCELLED: Only adopter
- Validates status transitions:
  - PENDING → APPROVED, REJECTED, CANCELLED
  - APPROVED → COMPLETED, CANCELLED
  - REJECTED, COMPLETED, CANCELLED: No transitions allowed
- Updates pet status appropriately:
  - APPROVED: Pet status → PENDING (adoption in progress)
  - REJECTED: Pet status → AVAILABLE (pet available again)
  - COMPLETED: Pet status → ADOPTED (adoption finalized)
  - CANCELLED: Pet status → AVAILABLE (pet available again)
- Sends email notifications to adopter when status changes
- Records approval and completion timestamps

**Status Transitions:**
```
PENDING
  ├─→ APPROVED (pet owner approves)
  │    └─→ COMPLETED (pet owner completes) → Pet status: ADOPTED
  ├─→ REJECTED (pet owner rejects) → Pet status: AVAILABLE
  └─→ CANCELLED (adopter cancels) → Pet status: AVAILABLE
```

#### GET /api/adoptions/[id] - Get Single Adoption Request
**Features:**
- Retrieves a single adoption request by ID
- Authorization: Only adopter or pet owner can view
- Returns formatted adoption data with parsed JSON fields
- Includes complete pet and adopter information

## Data Flow

### Adoption Creation Flow
```
Client submits adoption form
    ↓
POST /api/adoptions
    ↓
Validate auth (ADOPTER only)
    ↓
Validate adoption data (Zod schema)
    ↓
Check pet exists and is AVAILABLE
    ↓
Check no duplicate PENDING request
    ↓
Create Adoption (status: PENDING)
    ↓
Update Pet status to PENDING
    ↓
Send email to pet owner
    ↓
Return adoption request (status 201)
```

### Adoption Approval Flow
```
Pet owner reviews adoption request
    ↓
PATCH /api/adoptions/[id] with status=APPROVED
    ↓
Authorize (must be pet owner)
    ↓
Validate transition (PENDING → APPROVED)
    ↓
Update adoption (status: APPROVED, approvedAt: now)
    ↓
Update pet status to PENDING
    ↓
Send approval email to adopter
    ↓
Return updated adoption (status 200)
```

### Adoption Completion Flow
```
Pet owner completes adoption (after finalizing details)
    ↓
PATCH /api/adoptions/[id] with status=COMPLETED
    ↓
Authorize (must be pet owner)
    ↓
Validate transition (APPROVED → COMPLETED)
    ↓
Update adoption (status: COMPLETED, completedAt: now)
    ↓
Update pet status to ADOPTED
    ↓
Return updated adoption (status 200)
```

### Adoption Rejection Flow
```
Pet owner reviews and rejects adoption
    ↓
PATCH /api/adoptions/[id] with status=REJECTED, rejectionReason
    ↓
Authorize (must be pet owner)
    ↓
Validate transition (PENDING → REJECTED)
    ↓
Update adoption (status: REJECTED, rejectionReason)
    ↓
Update pet status to AVAILABLE
    ↓
Send rejection email to adopter with reason
    ↓
Return updated adoption (status 200)
```

## Error Handling

All endpoints return structured error responses with:
- `error`: Human-readable error message
- `code`: Machine-readable error code
- `details`: Optional detailed error information
- `timestamp`: ISO timestamp of error
- `path`: API path where error occurred

### Error Codes Implemented
- `401 UNAUTHORIZED`: Authentication required
- `403 FORBIDDEN`: User lacks permission for operation
- `404 NOT_FOUND`: Resource not found
- `400 VALIDATION_ERROR`: Input validation failed
- `400 PET_UNAVAILABLE`: Pet not available for adoption
- `409 DUPLICATE_REQUEST`: Duplicate pending adoption request
- `400 INVALID_TRANSITION`: Invalid status transition
- `500 CREATE_ERROR`/`UPDATE_ERROR`/`FETCH_ERROR`: Server errors

## Email Integration

Leverages existing email service (`src/lib/email.js`) with templates:
- `sendAdoptionRequestEmail`: Notification to pet owner of new adoption request
- `sendAdoptionStatusEmail`: Notifications to adopter about approval/rejection

Gracefully handles email service failures without failing API requests.

## Database Operations

### Adoption Creation
- Creates adoption record with validated data
- Stores adopterInfo as JSON string (SQLite compatibility)
- Updates pet status atomically
- Includes full pet and adopter information in response

### Adoption Status Update
- Updates adoption status and timestamps
- Maintains adoption history (updates only current record)
- Updates pet status based on adoption status change
- Preserves rejection reasons for audit trail

### Adoption Querying
- Filters by user type and ID for secure access
- Supports pagination for large result sets
- Parses JSON fields for consistent response format
- Orders chronologically for tracking history

## Validation

### Adoption Form Schema
Uses existing `adoptionSchema` from `src/lib/validation/schemas.js` with:
- Personal information (name, phone, address, city, state, zipCode)
- Living situation (housing type, yard, rent/own, landlord approval)
- Experience (previous pets, veterinarian info)
- Motivation (why adopt, commitment level, available time)

### Status Update Validation
Uses `adoptionStatusUpdateSchema` with:
- Valid status values (PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED)
- Optional rejection reason (max 500 chars)
- Valid transitions based on current status

## Security Features

- **Authentication**: All endpoints require NextAuth session
- **Authorization**: Role-based access control
  - Only adopters can create adoption requests
  - Only pet owners can approve/reject/complete
  - Only adopters can cancel their requests
- **Input Validation**: Comprehensive Zod schema validation
- **Data Sanitization**: Email inputs sanitized
- **SQL Injection Prevention**: Parameterized Prisma queries
- **CORS-safe**: Proper error status codes

## Testing

Comprehensive unit tests created in `src/app/api/adoptions/__tests__/adoptions.test.js` covering:
- Authentication checks
- Authorization checks
- Validation failures
- Pet availability checks
- Duplicate request prevention
- Adoption creation with valid data
- Status transitions (APPROVED, REJECTED, COMPLETED, CANCELLED)
- Pet status updates based on adoption status
- Email notifications
- Pagination
- Role-based filtering

## Build Verification

✅ Build successful with no errors
✅ All routes properly compiled
✅ No TypeScript errors
✅ All imports and dependencies resolved

## Requirements Validation

✅ Requirement 6.3: Adoption request creation implemented
✅ Requirement 6.4: Email notification to pet owner implemented
✅ Requirement 6.5: Adoption approval, rejection, and pending status implemented
✅ Requirement 6.6: Email notification to adopter on status change implemented
✅ Requirement 6.7: Pet status updates and rejection/incompleteness handling implemented
✅ Requirement 6.8: Adoption request history and status tracking implemented

## Next Steps

1. Configure email service (Resend or SendGrid) for production
2. Implement adoption form UI component (AdoptionForm)
3. Implement adoption request review UI (AdoptionRequest component)
4. Add GET /api/adoptions filtering options (by date range, status)
5. Implement webhook handling for email delivery status
6. Add adoption cancellation from adopter side
7. Implement adoption statistics and analytics
