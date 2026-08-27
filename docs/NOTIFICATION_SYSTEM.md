# Notification System Documentation

## Overview

The PetAdopt notification system implements three types of email notifications as per Requirements 8.1, 8.2, and 8.3:

1. **Adoption Request Notifications** - Pet owner receives email when adopter submits a request
2. **Status Change Notifications** - Adopter receives email when adoption status changes
3. **Pet Matching Alerts** - Adopter receives email when new pet matches their preferences

## Architecture

### Components

#### 1. Email Service (`src/lib/email.js`)
- **Status**: ✅ Complete (Task 12.1)
- **Features**:
  - Multi-provider support (Resend API, SendGrid, SMTP)
  - Automatic retry logic (up to 3 times with exponential backoff)
  - Professional HTML email templates
  - Unsubscribe option in all emails
  - Email validation and delivery status tracking

**Key Functions**:
- `sendEmail(emailData)` - Generic email sending with retry logic
- `sendAdoptionRequestEmail()` - Notify pet owner of new adoption request
- `sendAdoptionApprovedEmail()` - Notify adopter of approval
- `sendAdoptionRejectedEmail()` - Notify adopter of rejection
- `sendPetMatchingEmail()` - Alert adopter of matching pet

#### 2. Pet Matching Service (`src/lib/pet-matching.js`)
- **Status**: ✅ Complete (Task 12.2)
- **Features**:
  - Intelligent pet-adopter matching based on multiple criteria
  - Match score calculation (0-100)
  - Duplicate notification prevention
  - Search preference persistence
  - Notification logging

**Key Functions**:
- `calculateMatchScore(pet, preferences)` - Calculate match quality (0-100)
- `findMatchingPets(adopterId)` - Find all matching pets for an adopter
- `saveAdopterSearchPreferences(userId, preferences)` - Save search preferences
- `wasNotificationSent(userId, petId, type)` - Check for duplicate alerts
- `logNotification(userId, petId, type, email, status)` - Log notification sends

#### 3. Notification Preferences (`src/lib/email.js`)
- **Models**: `EmailPreference`, `AdopterSearchPreference`, `NotificationLog`
- **Fields**:
  - `adoptionNotifications` - Enable/disable adoption request emails
  - `statusChangeNotifications` - Enable/disable status update emails
  - `petMatchingAlerts` - Enable/disable matching pet alerts
  - `newsletter` - Enable/disable general newsletters
  - `unsubscribedAll` - Master unsubscribe flag

### API Endpoints

#### 1. Check Matching Pets
```
POST /api/notifications/check-matching-pets
Authorization: Bearer {CRON_SECRET}
```

**Purpose**: Check for new pets matching adopter preferences and send alerts

**Parameters**:
- `petId` (optional) - Check specific pet
- `sinceDays` (optional) - Check pets created in last N days (default: 7)

**Response**:
```json
{
  "success": true,
  "petsChecked": 5,
  "totalNotificationsSent": 12,
  "results": [
    {
      "petId": "pet-1",
      "petName": "Max",
      "notificationsSent": 3
    }
  ]
}
```

#### 2. Adopter Search Preferences
```
GET /api/adopters/search-preferences
POST /api/adopters/search-preferences
PATCH /api/adopters/search-preferences
Authorization: Bearer {session_token}
```

**Purpose**: Manage adopter's search preferences for pet matching

**POST/PATCH Body**:
```json
{
  "species": "DOG",                    // DOG or CAT
  "sizePreferences": ["MEDIUM", "LARGE"],
  "minAge": "1",
  "maxAge": "5",
  "genderPreference": "MALE",          // MALE or FEMALE
  "personalityTraits": ["friendly", "energetic"],
  "location": "São Paulo",
  "searchRadius": 10,                  // km
  "isActive": true
}
```

#### 3. Unsubscribe
```
GET /api/notifications/unsubscribe?token={unsubscribeToken}&action={action}
```

**Purpose**: Handle email unsubscribe requests

**Actions**:
- `all` - Unsubscribe from all notifications
- `matching` - Unsubscribe from matching pet alerts
- `status` - Unsubscribe from status change emails
- `adoption` - Unsubscribe from adoption request emails

**Response**: HTML page with unsubscribe confirmation

### Workflow

#### When Adoption Request is Submitted
1. User creates adoption request via POST `/api/adoptions`
2. System sends email to pet owner via `sendAdoptionRequestEmail()`
3. Pet status changes to PENDING
4. Notification is logged

#### When Adoption Status Changes
1. Pet owner approves/rejects via PATCH `/api/adoptions/[id]`
2. System sends appropriate email to adopter:
   - `sendAdoptionApprovedEmail()` if approved
   - `sendAdoptionRejectedEmail()` if rejected
3. Pet status is updated accordingly
4. Notification is logged

#### When New Pet is Added (Pet Matching)
1. Pet owner creates pet via POST `/api/pets`
2. System triggers async check via `/api/notifications/check-matching-pets?petId={petId}`
3. For each adopter with active search preferences:
   - Calculate match score
   - If score > 40% and not already sent:
     - Send email via `sendPetMatchingEmail()`
     - Log notification to prevent duplicates
4. Adopter receives email with pet details and image

### Match Score Calculation

Match score is calculated as weighted percentage (0-100):

| Criteria | Weight | Points | Notes |
|----------|--------|--------|-------|
| Species | 20% | 20 | Exact match required if preference set |
| Size | 20% | 20 | Pet must match at least one size preference |
| Age | 20% | 20 | Pet age must fall within min-max range |
| Gender | 15% | 15 | Exact match if preference set |
| Personality | 15% | 15 | Proportional to overlap with preferences |
| Location | 10% | 10 | Partial/flexible matching |

**Minimum threshold**: 40% match score (before email is sent)

### Database Models

#### EmailPreference
```prisma
model EmailPreference {
  id                        String    @id @default(cuid())
  userId                    String    @unique
  adoptionNotifications     Boolean   @default(true)
  statusChangeNotifications Boolean   @default(true)
  petMatchingAlerts         Boolean   @default(true)
  newsletter                Boolean   @default(true)
  unsubscribedAll           Boolean   @default(false)
  unsubscribeToken          String    @unique
  createdAt                 DateTime  @default(now())
  updatedAt                 DateTime  @updatedAt
  user                      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### AdopterSearchPreference
```prisma
model AdopterSearchPreference {
  id                  String      @id @default(cuid())
  userId              String      @unique
  species             Species?
  sizePreferences     String      // JSON array: ["SMALL", "MEDIUM", "LARGE"]
  minAge              String?
  maxAge              String?
  genderPreference    Gender?
  personalityTraits   String?     // JSON array: ["friendly", "energetic"]
  location            String?
  searchRadius        Int?
  isActive            Boolean     @default(true)
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### NotificationLog
```prisma
model NotificationLog {
  id                  String      @id @default(cuid())
  userId              String
  petId               String
  notificationType    String      // 'adoption_request', 'status_change', 'pet_matching'
  sentAt              DateTime    @default(now())
  deliveryStatus      String      @default("sent")
  email               String
  
  // Prevent duplicates
  @@unique([userId, petId, notificationType])
}
```

## Environment Variables

```bash
# Email Service (Resend API is primary)
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=notifications@petadopt.com

# Fallback SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Notification System
CRON_SECRET=your-cron-secret-key
APP_URL=https://petadopt.com
```

## Usage Examples

### Save Adopter Preferences (Frontend)
```javascript
// Save search preferences
const response = await fetch('/api/adopters/search-preferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    species: 'DOG',
    sizePreferences: ['MEDIUM', 'LARGE'],
    minAge: '1',
    maxAge: '5',
    genderPreference: 'MALE',
    personalityTraits: ['friendly', 'energetic'],
    location: 'São Paulo'
  })
});
```

### Check Matching Pets (Cron Job)
```javascript
// Trigger matching check periodically
const response = await fetch('/api/notifications/check-matching-pets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.CRON_SECRET}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sinceDays: 7  // Check pets created in last 7 days
  })
});
```

### Unsubscribe Management (Email Template)
```html
<!-- In email footer -->
<p>
  <a href="https://petadopt.com/api/notifications/unsubscribe?token={unsubscribeToken}&action=matching">
    Parar de receber notificações de pets compatíveis
  </a>
</p>
```

## Performance Considerations

1. **Matching Checks**: Run via cron job (e.g., 2x daily) or triggered on new pet creation
2. **Notification Log**: Indexed on `(userId, petId, notificationType)` for duplicate prevention
3. **Email Retries**: Exponential backoff (1s, 2s, 4s) up to 3 attempts
4. **Preference Updates**: Efficient upsert prevents duplicate preferences

## Testing

### Unit Tests (`src/lib/__tests__/pet-matching.test.js`)
- Match score calculation with various preference combinations
- Duplicate notification prevention
- Search preference persistence
- Edge cases and error handling

### Integration Tests
- End-to-end adoption workflow with emails
- Pet matching alerts for multiple adopters
- Unsubscribe functionality
- Email delivery with retries

### Manual Testing
```bash
# Check matching for specific pet
curl -X POST http://localhost:3000/api/notifications/check-matching-pets \
  -H "Authorization: Bearer dev-secret" \
  -H "Content-Type: application/json" \
  -d '{"petId":"pet-123"}'

# Get adopter preferences
curl http://localhost:3000/api/adopters/search-preferences \
  -H "Cookie: next-auth.session-token=..."

# Trigger unsubscribe
curl "http://localhost:3000/api/notifications/unsubscribe?token=xyz&action=all"
```

## Monitoring & Logging

All email operations are logged with context:
```
[EMAIL] Sending email to adopter@example.com (resend)
[EMAIL] Successfully sent to adopter@example.com (MessageID: abc123)
[MATCHING] Sent notification to adopter@example.com for pet Max (score: 92%)
[UNSUBSCRIBE] User user-123 unsubscribed from: all
```

## Requirements Mapping

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| 8.1 | New adoption email to owner | ✅ Complete |
| 8.2 | Status change email to adopter | ✅ Complete |
| 8.3 | Pet matching alert emails | ✅ Complete |
| 8.4 | Email template customization | ✅ Complete |
| 8.5 | Unsubscribe option | ✅ Complete |
| 8.6 | Email delivery status | ✅ Complete |
| 8.7 | Automatic retry (3 times) | ✅ Complete |
| 10.6 | Save search preferences | ✅ Complete |

## Future Enhancements

1. SMS notifications as alternative channel
2. Notification preferences per pet type
3. Scheduling of matching checks (e.g., morning only)
4. Analytics dashboard for notification performance
5. A/B testing of email templates
6. Machine learning-based match score optimization
