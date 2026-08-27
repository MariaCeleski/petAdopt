# Adoption Approval System - Integration Guide

## Quick Start

### 1. Import Components
```jsx
import { 
  AdoptionRequest, 
  AdoptionRequestList, 
  ApprovalModal, 
  RejectionModal 
} from '@/components/adoption';
```

### 2. Access the Page
Navigate to: `/dashboard/adoptions`

Only users with `SHELTER_ADMIN` or `INDIVIDUAL_OWNER` user types can access this page. `ADOPTER` users are redirected to the main dashboard.

## Component Usage Examples

### Display a List of Adoption Requests
```jsx
'use client';

import { useState, useEffect } from 'react';
import { AdoptionRequestList } from '@/components/adoption';

export default function MyAdoptionsPage() {
  const [adoptions, setAdoptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      const response = await fetch('/api/adoptions');
      const data = await response.json();
      setAdoptions(data.adoptions || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdoptionRequestList
      adoptions={adoptions}
      isLoading={isLoading}
      onRefresh={fetchAdoptions}
      showStatusFilter={true}
      canApprove={true}
    />
  );
}
```

### Handle Adoption Status Change
```jsx
const handleStatusChange = async (updatedAdoption) => {
  // Called when approval/rejection is successful
  console.log('Adoption updated:', updatedAdoption);
  
  // Update local state or refresh list
  setAdoptions(prev => 
    prev.map(a => a.id === updatedAdoption.id ? updatedAdoption : a)
  );
};
```

## API Integration Details

### Fetch Adoptions
```javascript
// Get all adoptions for current user
const response = await fetch('/api/adoptions?page=1&limit=10');
const data = await response.json();

// Response structure
{
  adoptions: [
    {
      id: "adoption-id",
      status: "PENDING", // PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED
      createdAt: "2024-01-15T10:00:00Z",
      pet: {
        id: "pet-id",
        name: "Rex",
        species: "DOG",
        breed: "Labrador",
        age: "2 anos",
        size: "LARGE",
        gender: "MALE",
        images: ["url1", "url2"],
        status: "PENDING"
      },
      adopter: {
        id: "adopter-id",
        name: "João Silva",
        email: "joao@example.com"
      },
      adopterInfo: {
        personalInfo: { ... },
        livingSituation: { ... },
        experience: { ... },
        motivation: { ... }
      }
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3
  }
}
```

### Update Adoption Status
```javascript
// Approve adoption
const response = await fetch(`/api/adoptions/${adoptionId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'APPROVED',
    confirmationText: 'Optional notes'
  })
});

// Reject adoption
const response = await fetch(`/api/adoptions/${adoptionId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'REJECTED',
    rejectionReason: 'Reason for rejection'
  })
});

// Response includes updated adoption object
const updatedAdoption = await response.json();
```

## Error Handling

### Component-Level Error Handling
All components include try-catch error handling and display user-friendly error messages.

### Error Response Example
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...},
  "timestamp": "2024-01-15T10:00:00Z",
  "path": "/api/adoptions/123"
}
```

## Status Transitions

Valid status transitions:
- `PENDING` → `APPROVED`, `REJECTED`, `CANCELLED`
- `APPROVED` → `COMPLETED`, `CANCELLED`
- `REJECTED` → (no transitions)
- `COMPLETED` → (no transitions)
- `CANCELLED` → (no transitions)

Pet Status Updates:
- Adoption `PENDING`: Pet status = `PENDING`
- Adoption `APPROVED`: Pet status = `PENDING`
- Adoption `REJECTED`: Pet status = `AVAILABLE`
- Adoption `COMPLETED`: Pet status = `ADOPTED`
- Adoption `CANCELLED`: Pet status = `AVAILABLE`

## Email Notifications

When an adoption status changes, automatic email notifications are sent:

1. **APPROVED**: Email sent to adopter
   - Subject: "Sua solicitação de adoção foi aprovada"
   - Contains: Pet info, next steps

2. **REJECTED**: Email sent to adopter
   - Subject: "Sua solicitação de adoção foi rejeitada"
   - Contains: Rejection reason, encouragement

3. **COMPLETED**: Email sent to adopter
   - Subject: "Parabéns pela adoção!"
   - Contains: Congratulations, helpful resources

## Authorization

### Who Can View Adoption Requests?
- **Pet Owner**: Can view all adoption requests for their pets
- **Adopter**: Can view only their own adoption requests
- **Admin**: Can view all adoption requests (if implemented)

### Who Can Update Adoption Status?
- **Only Pet Owner**: Can approve/reject requests for their pets
- **Only Adopter**: Can cancel their own pending requests

## Styling and Customization

### Color Scheme
- Pending: `warning` (yellow)
- Approved: `success` (green)
- Rejected: `error` (red)
- Completed: `info` (blue)

### CSS Variables
Components use CSS custom properties for theming:
```css
--color-primary-orange: #FF8C42;
--color-primary-blue: #4A90E2;
--color-primary-green: #2ECC71;
--color-secondary-coral: #FF6B6B;
--color-neutral-dark: #2C3E50;
--color-neutral-medium: #7F8C8D;
--color-neutral-light: #ECF0F1;
```

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 640px

## Accessibility Features

1. **Semantic HTML**: Proper use of headings, buttons, forms
2. **ARIA Labels**: Screen reader support
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Management**: Proper focus trap in modals
5. **Color Contrast**: WCAG AA compliant
6. **Form Labels**: Associated labels for all inputs
7. **Error Messages**: Clear and contextual

## Performance Considerations

1. **Image Optimization**: Uses OptimizedImage component for pet photos
2. **Pagination**: Adoption requests are paginated (default 10 per page)
3. **Lazy Loading**: Components use React lazy loading where appropriate
4. **Memoization**: Components properly memoized to prevent unnecessary re-renders
5. **Debouncing**: Character input in forms is debounced

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## Troubleshooting

### Adoptions Not Loading
1. Check authentication status
2. Verify user has correct role (SHELTER_ADMIN or INDIVIDUAL_OWNER)
3. Check browser console for API errors
4. Verify API endpoint is responding

### Approval/Rejection Not Working
1. Ensure you're the pet owner
2. Check that adoption status is PENDING
3. Verify API response for errors
4. Check network tab for failed requests

### Emails Not Sending
1. Verify email service is configured
2. Check email templates exist
3. Review server logs for errors
4. Verify adopter email is valid

## Examples

### Complete Pet Owner Dashboard Section
```jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AdoptionRequestList } from '@/components/adoption';

export function AdoptionManagementSection() {
  const { data: session } = useSession();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.type !== 'ADOPTER') {
      loadAdoptions();
    }
  }, [session]);

  const loadAdoptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/adoptions?limit=50');
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      setAdoptions(data.adoptions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;
  if (session.user.type === 'ADOPTER') return null;

  return (
    <section>
      <h2>Solicitações de Adoção</h2>
      <AdoptionRequestList
        adoptions={adoptions}
        isLoading={loading}
        onRefresh={loadAdoptions}
        canApprove={true}
      />
      {error && <p className="error">{error}</p>}
    </section>
  );
}
```

## Support

For issues or questions about the adoption approval system:
1. Check this documentation
2. Review component README files
3. Check test files for usage examples
4. Review the implementation summary document
