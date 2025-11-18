# 5. API Description

This document provides comprehensive API documentation for the Rings application. All APIs follow the rules and conventions defined in `rules.md`.

## 5.1 Introduction

### 5.1.1 Authentication Mechanism

The Rings API uses session-based authentication with HTTP-only cookies:

- **Plugin**: `@fastify/cookie` for cookie management
- **Cookie Configuration**:
  - HTTP-only: `true` (prevents JavaScript access)
  - Secure: `true` (HTTPS-only in production)
  - SameSite: `strict` (CSRF protection)
  - Expiration: 7 days of inactivity
  - Path: `/`
- **Session Validation**: Every protected request validates the session cookie
- **Session Storage**: Server-side session storage (in-memory or database)
- **Invalid Sessions**: Return `401 Unauthorized` response

### 5.1.2 Logging Patterns

All errors are logged server-side with the following information:

- **Timestamp**: ISO 8601 format
- **Error Type**: Error class/type name
- **Error Message**: Descriptive error message
- **Stack Trace**: Full stack trace for debugging
- **Request Details**:
  - HTTP method
  - Request path
  - User ID (if authenticated)
  - Request ID (for tracing)
- **No Sensitive Data**: Passwords, tokens, and other sensitive data are never logged

### 5.1.3 Error Handling Patterns

**Error Handling Strategy**:
- All endpoints wrap business logic in try-catch blocks
- Exceptions are caught and converted to HTTP error responses
- User-friendly error messages are returned to clients
- Technical error details are logged server-side only

**Error Response Format**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message"
  }
}
```

**HTTP Status Codes**:
- `200 OK`: Successful request
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid request data or validation errors
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side errors

## 5.2 Authentication APIs

### 5.2.1 POST /api/auth/register

**Description**: Register a new user account. Upon successful registration, the user is automatically logged in and a session cookie is set.

**Authentication**: Public (no authentication required)

**Request Schema**:
```json
{
  "username": "string (required, 3-50 characters, alphanumeric and underscores only)",
  "password": "string (required, minimum 8 characters, must contain at least one letter and one number)"
}
```

**Request Validation**:
- `username`: Required, string, 3-50 characters, matches pattern `^[a-zA-Z0-9_]+$`
- `password`: Required, string, minimum 8 characters, must contain at least one letter (a-z, A-Z) and one number (0-9)

**Success Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Username must be 3-50 characters and contain only letters, numbers, and underscores",
      "field": "username"
    }
  }
  ```
  OR
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Password must be at least 8 characters and contain at least one letter and one number",
      "field": "password"
    }
  }
  ```
- `409 Conflict`: Username already exists
  ```json
  {
    "error": {
      "code": "USERNAME_EXISTS",
      "message": "Username already exists"
    }
  }
  ```
- `429 Too Many Requests`: Rate limit exceeded
  ```json
  {
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests. Please try again later."
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An error occurred during registration. Please try again."
    }
  }
  ```

**Rate Limiting**: 5 requests per minute per IP address

**Request Example**:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 5.2.2 POST /api/auth/login

**Description**: Authenticate an existing user and establish a session. A session cookie is set upon successful login.

**Authentication**: Public (no authentication required)

**Request Schema**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Request Validation**:
- `username`: Required, string, non-empty
- `password`: Required, string, non-empty

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLoginAt": "2024-01-20T14:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Missing username or password
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Username and password are required"
    }
  }
  ```
- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Invalid username or password"
    }
  }
  ```
- `429 Too Many Requests`: Rate limit exceeded
  ```json
  {
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests. Please try again later."
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An error occurred during login. Please try again."
    }
  }
  ```

**Rate Limiting**: 5 requests per minute per IP address

**Request Example**:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLoginAt": "2024-01-20T14:30:00Z"
}
```

### 5.2.3 POST /api/auth/logout

**Description**: Log out the current user and invalidate the session. The session cookie is cleared.

**Authentication**: Protected (requires valid session)

**Request Schema**: No request body required

**Success Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An error occurred during logout. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: No body

**Response Example**:
```json
{
  "message": "Logged out successfully"
}
```

### 5.2.4 GET /api/auth/me

**Description**: Get the current authenticated user's information. Used for the Settings screen.

**Authentication**: Protected (requires valid session)

**Request Schema**: No request body or query parameters

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to load settings. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: No body

**Response Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## 5.3 News Feed APIs

### 5.3.1 GET /api/news-feed

**Description**: Get the News Feed aggregating posts from all Rings the user is a member of. Posts are returned in reverse chronological order (newest first). Optionally filter by Ring name using the `search` query parameter.

**Authentication**: Protected (requires valid session)

**Query Parameters**:
- `search` (optional, string): Filter posts to only show posts from Rings whose names contain this search query (case-insensitive partial match). If omitted or empty, returns all posts from user's Rings.

**Success Response** (200 OK):
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "ringId": "770e8400-e29b-41d4-a716-446655440000",
    "ringName": "My Ring",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "messageText": "This is a post message that may be longer than 100 characters and will be truncated in the UI to show only the first 100 characters...",
    "imageUrl": "/uploads/images/abc123.jpg",
    "createdAt": "2024-01-20T14:30:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "ringId": "770e8400-e29b-41d4-a716-446655440001",
    "ringName": "Another Ring",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "username": "janedoe",
    "messageText": "Another post",
    "imageUrl": null,
    "createdAt": "2024-01-20T13:00:00Z"
  }
]
```

**Response Fields**:
- `id`: UUID, Post ID
- `ringId`: UUID, Ring ID
- `ringName`: string, Ring name
- `userId`: UUID, User ID of post author
- `username`: string, Username of post author
- `messageText`: string, Full message text (not truncated, frontend handles truncation to 100 chars)
- `imageUrl`: string | null, URL or path to image if present, null if no image
- `createdAt`: ISO 8601 timestamp, Post creation timestamp

**Empty Response** (200 OK): Returns empty array `[]` if user has no Rings or no posts match the search criteria.

**Error Responses**:
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to load news feed. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Examples**:
- Get all posts: `GET /api/news-feed`
- Search by Ring name: `GET /api/news-feed?search=My%20Ring`

**Response Example** (with search):
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "ringId": "770e8400-e29b-41d4-a716-446655440000",
    "ringName": "My Ring",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "messageText": "This is a post message",
    "imageUrl": "/uploads/images/abc123.jpg",
    "createdAt": "2024-01-20T14:30:00Z"
  }
]
```

## 5.4 Ring Management APIs

### 5.4.1 GET /api/rings

**Description**: Get all Rings the authenticated user is a member of. Optionally filter by Ring name using the `search` query parameter.

**Authentication**: Protected (requires valid session)

**Query Parameters**:
- `search` (optional, string): Filter Rings to only show Rings whose names contain this search query (case-insensitive partial match). If omitted or empty, returns all user's Rings.

**Success Response** (200 OK):
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "My Ring",
    "memberCount": 15,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Another Ring",
    "memberCount": 8,
    "createdAt": "2024-01-16T11:00:00Z"
  }
]
```

**Response Fields**:
- `id`: UUID, Ring ID
- `name`: string, Ring name (full name, frontend handles ellipsizing to 20 chars)
- `memberCount`: number, Total number of members in the Ring
- `createdAt`: ISO 8601 timestamp, Ring creation timestamp

**Empty Response** (200 OK): Returns empty array `[]` if user has no Rings or no Rings match the search criteria.

**Error Responses**:
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to load rings. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Examples**:
- Get all Rings: `GET /api/rings`
- Search Rings: `GET /api/rings?search=My`

**Response Example** (with search):
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "My Ring",
    "memberCount": 15,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### 5.4.2 POST /api/rings

**Description**: Create a new Ring with a unique name. The creator automatically becomes a member of the new Ring.

**Authentication**: Protected (requires valid session)

**Request Schema**:
```json
{
  "name": "string (required, 1-100 characters)"
}
```

**Request Validation**:
- `name`: Required, string, 1-100 characters, non-empty after trimming

**Success Response** (201 Created):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "My New Ring",
  "memberCount": 1,
  "createdAt": "2024-01-20T14:30:00Z"
}
```

**Response Fields**:
- `id`: UUID, Ring ID
- `name`: string, Ring name
- `memberCount`: number, Total number of members (initially 1, the creator)
- `createdAt`: ISO 8601 timestamp, Ring creation timestamp

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Ring name must be between 1 and 100 characters.",
      "field": "name"
    }
  }
  ```
- `409 Conflict`: Ring name already exists
  ```json
  {
    "error": {
      "code": "RING_NAME_EXISTS",
      "message": "Ring name already exists. Please choose a different name."
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to create ring. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**:
```json
{
  "name": "My New Ring"
}
```

**Response Example**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "My New Ring",
  "memberCount": 1,
  "createdAt": "2024-01-20T14:30:00Z"
}
```

### 5.4.3 GET /api/rings/search

**Description**: Search for Rings by name. Returns all Rings whose names match the search query, along with membership status for the authenticated user.

**Authentication**: Protected (requires valid session)

**Query Parameters**:
- `q` (required, string): Search query, minimum 1 character, case-insensitive partial match on Ring names

**Request Validation**:
- `q`: Required, string, minimum 1 character, non-empty

**Success Response** (200 OK):
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "My Ring",
    "memberCount": 15,
    "isMember": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "My Other Ring",
    "memberCount": 8,
    "isMember": false,
    "createdAt": "2024-01-16T11:00:00Z"
  }
]
```

**Response Fields**:
- `id`: UUID, Ring ID
- `name`: string, Ring name
- `memberCount`: number, Total number of members in the Ring
- `isMember`: boolean, Whether the authenticated user is a member of this Ring
- `createdAt`: ISO 8601 timestamp, Ring creation timestamp

**Empty Response** (200 OK): Returns empty array `[]` if no Rings match the search query.

**Error Responses**:
- `400 Bad Request`: Missing or empty search query
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Please enter a search query."
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to search rings. Please try again."
    }
  }
  ```

**Rate Limiting**: 20 requests per minute per user

**Request Example**: `GET /api/rings/search?q=My`

**Response Example**:
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "My Ring",
    "memberCount": 15,
    "isMember": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### 5.4.4 POST /api/rings/:id/join

**Description**: Join a Ring that the user is not currently a member of. The user becomes a member immediately upon successful join.

**Authentication**: Protected (requires valid session)

**Path Parameters**:
- `id` (required, UUID): Ring ID to join

**Request Schema**: No request body required

**Success Response** (200 OK):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "My Ring",
  "memberCount": 16,
  "isMember": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response Fields**:
- `id`: UUID, Ring ID
- `name`: string, Ring name
- `memberCount`: number, Updated total number of members (includes the newly joined user)
- `isMember`: boolean, Always `true` after successful join
- `createdAt`: ISO 8601 timestamp, Ring creation timestamp

**Error Responses**:
- `400 Bad Request`: Invalid Ring ID format
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid ring ID format"
    }
  }
  ```
- `404 Not Found`: Ring not found
  ```json
  {
    "error": {
      "code": "RING_NOT_FOUND",
      "message": "Ring not found"
    }
  }
  ```
- `409 Conflict`: User is already a member
  ```json
  {
    "error": {
      "code": "ALREADY_MEMBER",
      "message": "You are already a member of this Ring."
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to join Ring. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: `POST /api/rings/770e8400-e29b-41d4-a716-446655440000/join`

**Response Example**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "My Ring",
  "memberCount": 16,
  "isMember": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 5.4.5 GET /api/rings/:id

**Description**: Get details of a specific Ring. Used to display Ring information in the Ring Chat screen header.

**Authentication**: Protected (requires valid session)

**Path Parameters**:
- `id` (required, UUID): Ring ID

**Request Schema**: No request body or query parameters

**Success Response** (200 OK):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "My Ring",
  "memberCount": 15,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response Fields**:
- `id`: UUID, Ring ID
- `name`: string, Ring name
- `memberCount`: number, Total number of members in the Ring
- `createdAt`: ISO 8601 timestamp, Ring creation timestamp

**Error Responses**:
- `400 Bad Request`: Invalid Ring ID format
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid ring ID format"
    }
  }
  ```
- `403 Forbidden`: User is not a member of this Ring
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "You are not a member of this Ring."
    }
  }
  ```
- `404 Not Found`: Ring not found
  ```json
  {
    "error": {
      "code": "RING_NOT_FOUND",
      "message": "Ring not found"
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to load ring details. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: `GET /api/rings/770e8400-e29b-41d4-a716-446655440000`

**Response Example**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "My Ring",
  "memberCount": 15,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 5.4.6 GET /api/rings/:id/members

**Description**: Get the member count for a specific Ring. This endpoint can be used to get member count without full Ring details.

**Authentication**: Protected (requires valid session)

**Path Parameters**:
- `id` (required, UUID): Ring ID

**Request Schema**: No request body or query parameters

**Success Response** (200 OK):
```json
{
  "memberCount": 15
}
```

**Response Fields**:
- `memberCount`: number, Total number of members in the Ring

**Error Responses**:
- `400 Bad Request`: Invalid Ring ID format
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid ring ID format"
    }
  }
  ```
- `403 Forbidden`: User is not a member of this Ring
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "You are not a member of this Ring."
    }
  }
  ```
- `404 Not Found`: Ring not found
  ```json
  {
    "error": {
      "code": "RING_NOT_FOUND",
      "message": "Ring not found"
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to load member count. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: `GET /api/rings/770e8400-e29b-41d4-a716-446655440000/members`

**Response Example**:
```json
{
  "memberCount": 15
}
```

## 5.5 Post APIs

### 5.5.1 GET /api/rings/:id/posts

**Description**: Get all posts for a specific Ring. Posts are returned in chronological order (oldest first) for display in the Ring Chat.

**Authentication**: Protected (requires valid session)

**Path Parameters**:
- `id` (required, UUID): Ring ID

**Request Schema**: No request body or query parameters

**Success Response** (200 OK):
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "ringId": "770e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "messageText": "This is a post message with full text displayed in the chat.",
    "imageUrl": "/uploads/images/abc123.jpg",
    "createdAt": "2024-01-20T10:00:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "ringId": "770e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "username": "janedoe",
    "messageText": "Another message",
    "imageUrl": null,
    "createdAt": "2024-01-20T11:00:00Z"
  }
]
```

**Response Fields**:
- `id`: UUID, Post ID
- `ringId`: UUID, Ring ID
- `userId`: UUID, User ID of post author
- `username`: string, Username of post author
- `messageText`: string, Full message text (not truncated)
- `imageUrl`: string | null, URL or path to image if present, null if no image
- `createdAt`: ISO 8601 timestamp, Post creation timestamp

**Empty Response** (200 OK): Returns empty array `[]` if Ring has no posts.

**Error Responses**:
- `400 Bad Request`: Invalid Ring ID format
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid ring ID format"
    }
  }
  ```
- `403 Forbidden`: User is not a member of this Ring
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "You are not a member of this Ring."
    }
  }
  ```
- `404 Not Found`: Ring not found
  ```json
  {
    "error": {
      "code": "RING_NOT_FOUND",
      "message": "Ring not found"
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to load posts. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: `GET /api/rings/770e8400-e29b-41d4-a716-446655440000/posts`

**Response Example**:
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "ringId": "770e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "messageText": "This is a post message",
    "imageUrl": "/uploads/images/abc123.jpg",
    "createdAt": "2024-01-20T10:00:00Z"
  }
]
```

### 5.5.2 POST /api/rings/:id/posts

**Description**: Create a new post in a Ring. The post can include message text and optionally an image file. The user must be a member of the Ring to post.

**Authentication**: Protected (requires valid session)

**Path Parameters**:
- `id` (required, UUID): Ring ID

**Request Schema**: `multipart/form-data` (for file upload support)

**Request Fields**:
- `messageText` (required, string): Post message text, 1-5000 characters, cannot be empty
- `image` (optional, file): Image file, maximum 10MB, supported formats: JPEG, PNG, GIF

**Request Validation**:
- `messageText`: Required, string, 1-5000 characters, non-empty after trimming
- `image`: Optional, file, maximum 10MB, MIME types: `image/jpeg`, `image/png`, `image/gif`, file extensions: `.jpg`, `.jpeg`, `.png`, `.gif`

**Success Response** (201 Created):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "ringId": "770e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "messageText": "This is a new post message",
  "imageUrl": "/uploads/images/abc123.jpg",
  "createdAt": "2024-01-20T14:30:00Z"
}
```

**Response Fields**:
- `id`: UUID, Post ID
- `ringId`: UUID, Ring ID
- `userId`: UUID, User ID of post author (authenticated user)
- `username`: string, Username of post author
- `messageText`: string, Post message text
- `imageUrl`: string | null, URL or path to uploaded image if present, null if no image was uploaded
- `createdAt`: ISO 8601 timestamp, Post creation timestamp

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Message cannot be empty.",
      "field": "messageText"
    }
  }
  ```
  OR
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Message must be 5000 characters or less.",
      "field": "messageText"
    }
  }
  ```
  OR
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Image file is too large. Maximum size is 10MB.",
      "field": "image"
    }
  }
  ```
  OR
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Unsupported image format. Please use JPEG, PNG, or GIF.",
      "field": "image"
    }
  }
  ```
- `400 Bad Request`: Invalid Ring ID format
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid ring ID format"
    }
  }
  ```
- `403 Forbidden`: User is not a member of this Ring
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "You are not a member of this Ring."
    }
  }
  ```
- `404 Not Found`: Ring not found
  ```json
  {
    "error": {
      "code": "RING_NOT_FOUND",
      "message": "Ring not found"
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to create post. Please try again."
    }
  }
  ```

**Rate Limiting**: 10 requests per minute per user

**Request Example**: `POST /api/rings/770e8400-e29b-41d4-a716-446655440000/posts`
```
Content-Type: multipart/form-data

messageText: "This is a new post message"
image: [binary file data]
```

**Response Example**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "ringId": "770e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "messageText": "This is a new post message",
  "imageUrl": "/uploads/images/abc123.jpg",
  "createdAt": "2024-01-20T14:30:00Z"
}
```

## 5.6 Membership APIs

### 5.6.1 POST /api/rings/:id/members

**Description**: Add a registered user to a Ring. The authenticated user must be a member of the Ring to add other users. The added user immediately becomes a member and gains access to the Ring.

**Authentication**: Protected (requires valid session)

**Path Parameters**:
- `id` (required, UUID): Ring ID

**Request Schema**:
```json
{
  "username": "string (required, must be an existing registered username)"
}
```

**Request Validation**:
- `username`: Required, string, non-empty, must exist in database

**Success Response** (200 OK):
```json
{
  "message": "User 'janedoe' has been added to the Ring.",
  "ringId": "770e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "username": "janedoe"
}
```

**Response Fields**:
- `message`: string, Success message
- `ringId`: UUID, Ring ID
- `userId`: UUID, User ID of the added user
- `username`: string, Username of the added user

**Error Responses**:
- `400 Bad Request`: Missing username
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Username is required",
      "field": "username"
    }
  }
  ```
- `400 Bad Request`: Invalid Ring ID format
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid ring ID format"
    }
  }
  ```
- `403 Forbidden`: Authenticated user is not a member of this Ring
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "You are not a member of this Ring."
    }
  }
  ```
- `404 Not Found`: User not found
  ```json
  {
    "error": {
      "code": "USER_NOT_FOUND",
      "message": "User 'janedoe' not found."
    }
  }
  ```
- `404 Not Found`: Ring not found
  ```json
  {
    "error": {
      "code": "RING_NOT_FOUND",
      "message": "Ring not found"
    }
  }
  ```
- `409 Conflict`: User is already a member
  ```json
  {
    "error": {
      "code": "ALREADY_MEMBER",
      "message": "User 'janedoe' is already a member of this Ring."
    }
  }
  ```
- `401 Unauthorized`: No valid session
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required"
    }
  }
  ```
- `500 Internal Server Error`: Server error
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unable to add user to ring. Please try again."
    }
  }
  ```

**Rate Limiting**: 100 requests per minute per user

**Request Example**: `POST /api/rings/770e8400-e29b-41d4-a716-446655440000/members`
```json
{
  "username": "janedoe"
}
```

**Response Example**:
```json
{
  "message": "User 'janedoe' has been added to the Ring.",
  "ringId": "770e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "username": "janedoe"
}
```

## 5.7 Health Check API

### 5.7.1 GET /api/health

**Description**: Health check endpoint for application monitoring. Returns the health status of the application and its dependencies.

**Authentication**: Public (no authentication required)

**Request Schema**: No request body or query parameters

**Success Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T14:30:00Z",
  "database": "connected"
}
```

**Response Fields**:
- `status`: string, Overall health status (`"healthy"` or `"unhealthy"`)
- `timestamp`: ISO 8601 timestamp, Current server time
- `database`: string, Database connection status (`"connected"` or `"disconnected"`)

**Error Response** (503 Service Unavailable): If application is unhealthy
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-20T14:30:00Z",
  "database": "disconnected"
}
```

**Rate Limiting**: No rate limiting (monitoring endpoint)

**Request Example**: `GET /api/health`

**Response Example**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T14:30:00Z",
  "database": "connected"
}
```

## 5.8 API Coverage Summary

This API documentation covers 100% of the functional requirements:

**Authentication (3.1, 3.2, 3.13, 3.14)**:
- ✅ POST /api/auth/register (3.1)
- ✅ POST /api/auth/login (3.2)
- ✅ GET /api/auth/me (3.13)
- ✅ POST /api/auth/logout (3.14)

**News Feed (3.3, 3.4)**:
- ✅ GET /api/news-feed (3.3)
- ✅ GET /api/news-feed?search=<ring-name> (3.4)

**Ring Management (3.5, 3.6, 3.7, 3.11, 3.12)**:
- ✅ POST /api/rings (3.5)
- ✅ GET /api/rings (3.6)
- ✅ GET /api/rings?search=<query> (3.7)
- ✅ GET /api/rings/search?q=<query> (3.11)
- ✅ POST /api/rings/:id/join (3.12)
- ✅ GET /api/rings/:id (for Ring Chat header)
- ✅ GET /api/rings/:id/members (for member count)

**Post Management (3.8, 3.9)**:
- ✅ GET /api/rings/:id/posts (3.8)
- ✅ POST /api/rings/:id/posts (3.9)

**Membership Management (3.10)**:
- ✅ POST /api/rings/:id/members (3.10)

**Health Check**:
- ✅ GET /api/health (for application monitoring)

All functional requirements from sections 3.1 through 3.14 are fully covered by the documented APIs.
