# Create Ring

**Endpoint**: `POST /api/rings`

**Description**: Creates a new Ring with a unique name. Upon creation, the user automatically becomes a member of the new Ring and can immediately post in it.

**Authentication**: Required

**Request Schema**:
```typescript
interface CreateRingRequest {
  name: string; // 1-100 characters, must be unique
}
```

**Request Body Example**:
```json
{
  "name": "Tech Talk"
}
```

**Response Schema** (Status: `201 Created`):
```typescript
interface CreateRingResponse {
  ring: {
    id: string; // UUID
    name: string;
    creator_id: string; // UUID
    created_at: string; // ISO 8601 timestamp
    member_count: number; // Always 1 for newly created ring
  };
}
```

**Response Body Example**:
```json
{
  "ring": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Talk",
    "creator_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-15T10:30:00Z",
    "member_count": 1
  }
}
```

**Status Codes**:
- `201 Created`: Ring created successfully
- `400 Bad Request`: Validation error (see error messages below)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Ring name already exists. Please choose a different name." }` - Ring name is already taken
- `400 Bad Request`: `{ "error": "Ring name must be between 1 and 100 characters." }` - Invalid name length

**Input Validation Rules**:
- Name: Required, 1-100 characters, must be unique across all Rings

**Processing**:
1. Validate user authentication token/session
2. Validate Ring name is not empty and meets length requirements
3. Check if Ring name already exists in database
4. If Ring name exists, return error
5. Create new Ring record in database with name and creator user_id (within transaction)
6. Create Membership record linking user to the new Ring (within same transaction)
7. Return new Ring data with member_count (always 1 for newly created ring)

**Performance Target**: 500ms
