# View Settings

**Endpoint**: `GET /api/auth/settings`

**Description**: Retrieves the authenticated user's account settings, including username. Used to display the Settings screen.

**Authentication**: Required

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface SettingsResponse {
  user: {
    id: string; // UUID
    username: string;
    created_at: string; // ISO 8601 timestamp
  };
}
```

**Response Body Example**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `200 OK`: Settings retrieved successfully
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Error Responses**:
- `500 Internal Server Error`: `{ "error": "Unable to load settings. Please try again." }` - API request failed

**Processing**:
1. Validate user authentication token/session
2. Retrieve User record for authenticated user
3. Return user data (excluding password hash)

**Performance Target**: 500ms
