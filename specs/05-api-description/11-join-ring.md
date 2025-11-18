# Join Ring (Apply for Membership)

**Endpoint**: `POST /api/rings/:id/join`

**Description**: Adds the authenticated user as a member of a Ring they are not currently a member of. Upon joining, the user immediately becomes a member and gains access to view and post in that Ring.

**Authentication**: Required

**Path Parameters**:
- `id` (required, string, UUID): The Ring ID to join

**Request Schema**: No request body required

**Response Schema** (Status: `201 Created`):
```typescript
interface JoinRingResponse {
  message: string;
  ring: {
    id: string; // UUID
    name: string;
    member_count: number;
    is_member: boolean; // Always true after joining
  };
}
```

**Response Body Example**:
```json
{
  "message": "You have joined 'Tech Talk'.",
  "ring": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Talk",
    "member_count": 16,
    "is_member": true
  }
}
```

**Status Codes**:
- `201 Created`: User joined Ring successfully
- `400 Bad Request`: User is already a member
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Ring does not exist
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "You are already a member of this Ring." }` - User tries to join Ring they're already in
- `404 Not Found`: `{ "error": "Ring not found." }` - Ring ID does not exist
- `500 Internal Server Error`: `{ "error": "Unable to join Ring. Please try again." }` - API request failed

**Processing**:
1. Validate user authentication token/session
2. Validate Ring ID format (UUID)
3. Retrieve Ring record from database
4. If Ring does not exist, return 404
5. Verify user is not already a member of the Ring (check Membership record)
6. If user is already a member, return error
7. Create new Membership record linking user to the Ring (within transaction)
8. Return success response with updated Ring data (member_count incremented, is_member: true)

**Performance Target**: 500ms
