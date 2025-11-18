# User Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticates an existing user and creates a session. Upon successful login, a session cookie is set and the user can access all platform features.

**Authentication**: Not required (public endpoint)

**Request Schema**:
```typescript
interface LoginRequest {
  username: string; // Required
  password: string; // Required
}
```

**Request Body Example**:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response Schema** (Status: `200 OK`):
```typescript
interface LoginResponse {
  user: {
    id: string; // UUID
    username: string;
    created_at: string; // ISO 8601 timestamp
    last_login_at: string; // ISO 8601 timestamp
  };
}
```

**Response Body Example**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "created_at": "2024-01-15T10:30:00Z",
    "last_login_at": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `200 OK`: Login successful, session cookie set
- `400 Bad Request`: Invalid credentials or validation error
- `429 Too Many Requests`: Rate limit exceeded (5 requests per minute per IP)

**Error Responses**:
- `400 Bad Request`: `{ "error": "Invalid username or password" }` - Credentials are incorrect (does not specify which field is wrong for security)

**Input Validation Rules**:
- Username: Required
- Password: Required
- Password comparison uses bcrypt compare function

**Processing**:
1. Retrieve User record from database using provided username
2. If username does not exist, return error
3. Compare provided password with stored password hash using bcrypt
4. If password does not match, return error
5. Generate new session and set HTTP-only cookie
6. Update user's last_login_at timestamp
7. Return user data (excluding password hash)

**Performance Target**: 500ms
