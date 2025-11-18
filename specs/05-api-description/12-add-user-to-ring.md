# Add User to Ring

**Endpoint**: `POST /api/rings/:id/members`

**Description**: Adds another registered user to a Ring the authenticated user is a member of. The added user immediately becomes a member and gains access to view and post in that Ring.

**Authentication**: Required

**Path Parameters**:
- `id` (required, string, UUID): The Ring ID to add the user to

**Request Schema**:
```typescript
interface AddUserToRingRequest {
  username: string; // Must be an existing registered username
}
```

**Request Body Example**:
```json
{
  "username": "janedoe"
}
```

**Response Schema** (Status: `201 Created`):
```typescript
interface AddUserToRingResponse {
  message: string;
  user: {
    id: string; // UUID
    username: string;
  };
  ring: {
    id: string; // UUID
    name: string;
    member_count: number;
  };
}
```

**Response Body Example**:
```json
{
  "message": "User 'janedoe' has been added to the Ring.",
  "user": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "username": "janedoe"
  },
  "ring": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Talk",
    "member_count": 16
  }
}
```

**Status Codes**:
- `201 Created`: User added to Ring successfully
- `400 Bad Request`: Validation error or user is already a member
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated user is not a member of the Ring
- `404 Not Found`: Ring or user does not exist
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "User 'janedoe' is already a member of this Ring." }` - User is already a member
- `403 Forbidden`: `{ "error": "You are not a member of this Ring." }` - Adding user is not a member
- `404 Not Found`: `{ "error": "User 'janedoe' not found." }` - Username does not exist
- `404 Not Found`: `{ "error": "Ring not found." }` - Ring ID does not exist

**Input Validation Rules**:
- Username: Required, must be an existing registered username

**Processing**:
1. Validate user authentication token/session (for the user doing the adding)
2. Validate Ring ID format (UUID)
3. Retrieve Ring record from database
4. If Ring does not exist, return 404
5. Verify the adding user is a member of the specified Ring (check Membership record)
6. If adding user is not a member, return 403
7. Retrieve User record for the username to be added
8. If username does not exist, return 404
9. Check if the user to be added is already a member of the Ring
10. If user is already a member, return error
11. Create new Membership record linking the user to the Ring (within transaction)
12. Return success response with user and Ring data

**Performance Target**: 500ms
