# User Registration

**Endpoint**: `POST /api/auth/register`

**Description**: Creates a new user account and automatically logs the user in. Upon successful registration, a session cookie is set and the user can access all platform features.

**Authentication**: Not required (public endpoint)

**Request Schema**:
```typescript
interface RegisterRequest {
  username: string; // 3-50 characters, alphanumeric and underscores only
  password: string; // Minimum 8 characters, must contain at least one letter and one number
}
```

**Request Body Example**:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response Schema** (Status: `201 Created`):
```typescript
interface RegisterResponse {
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
- `201 Created`: Registration successful, session cookie set
- `400 Bad Request`: Validation error (see error messages below)
- `429 Too Many Requests`: Rate limit exceeded (5 requests per minute per IP)

**Error Responses**:
- `400 Bad Request`: `{ "error": "Username already exists" }` - Username is already taken
- `400 Bad Request`: `{ "error": "Username must be 3-50 characters and contain only letters, numbers, and underscores" }` - Invalid username format
- `400 Bad Request`: `{ "error": "Password must be at least 8 characters and contain at least one letter and one number" }` - Invalid password format

**Input Validation Rules**:
- Username: Required, 3-50 characters, alphanumeric and underscores only, must be unique
- Password: Required, minimum 8 characters, must contain at least one letter and one number
- Password is hashed using bcrypt (salt rounds: 10) before storage

**Processing**:
1. Validate username format and check if username already exists
2. Validate password meets requirements
3. Hash password using bcrypt
4. Create new User record in database (within transaction)
5. Generate session and set HTTP-only cookie
6. Return user data (excluding password hash)

**Performance Target**: 500ms
