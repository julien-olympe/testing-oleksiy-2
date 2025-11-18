# 5. API Description

This document provides comprehensive API documentation for the Rings application. All APIs follow RESTful conventions and are designed to be testable and mockable.

## 5.1 Introduction

### Authentication Mechanism

The Rings API uses session-based authentication with HTTP-only cookies managed by the `@fastify/cookie` plugin. This provides secure, stateless session management without exposing session tokens to client-side JavaScript.

**Session Cookie Configuration**:
- **HTTP-only**: Cookies are not accessible via JavaScript (prevents XSS attacks)
- **Secure**: Cookies are only sent over HTTPS in production
- **Expiration**: 7 days of inactivity
- **Path**: `/` (available to all API endpoints)

**Authentication Flow**:
1. User authenticates via `/api/auth/register` or `/api/auth/login`
2. Server creates a session and sets an HTTP-only cookie with session ID
3. Client automatically includes the cookie in subsequent requests
4. Server validates the session on each protected endpoint
5. Invalid or expired sessions return `401 Unauthorized`

**Protected Endpoints**: All endpoints except `/api/auth/register` and `/api/auth/login` require authentication.

### Logging and Error Handling

**Logging Patterns**:
- All API requests are logged with: timestamp, HTTP method, endpoint path, user ID (if authenticated), request ID
- All errors are logged server-side with: timestamp, error type, error message, stack trace, request details
- Logs do not contain sensitive information (passwords, authentication tokens, session IDs)

**Error Handling Patterns**:
- All API endpoints implement try-catch blocks to handle exceptions
- Unhandled exceptions do not crash the server
- All exceptions are caught and converted to appropriate HTTP error responses
- Error responses include user-friendly error messages in response body
- Technical error details (stack traces, database errors) are not exposed to clients in production

**Database Exception Handling**:
- All database operations are wrapped in try-catch blocks
- Database connection errors are handled gracefully
- Query errors are caught and converted to user-friendly messages
- Foreign key constraint violations return specific error messages (e.g., "Ring not found")
- Unique constraint violations return specific error messages (e.g., "Username already exists")

**Transaction Management**:
- All database operations that modify multiple tables use transactions
- Transactions are rolled back if any operation within the transaction fails
- Default transaction isolation level: READ COMMITTED
- Transactions prevent race conditions (e.g., duplicate memberships)

For detailed error handling patterns, see `rules.md`.

## 5.2 Authentication APIs

### 5.2.1 User Registration

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

---

### 5.2.2 User Login

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

---

### 5.2.3 Logout

**Endpoint**: `POST /api/auth/logout`

**Description**: Logs out the authenticated user by invalidating their session. The session cookie is cleared and the user must authenticate again to access the platform.

**Authentication**: Required

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface LogoutResponse {
  message: string;
}
```

**Response Body Example**:
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200 OK`: Logout successful, session cookie cleared
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error during logout

**Error Responses**:
- `500 Internal Server Error`: `{ "error": "Unable to logout. Please try again." }` - API request failed (user is still logged out on client side)

**Processing**:
1. Validate user authentication token/session
2. Invalidate the user's session on server
3. Clear session data on server
4. Clear session cookie on client
5. Return success response

**Performance Target**: 500ms

---

### 5.2.4 View Settings

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

---

## 5.3 News Feed APIs

### 5.3.1 View News Feed

**Endpoint**: `GET /api/news-feed`

**Description**: Retrieves the News Feed for the authenticated user, displaying posts from all Rings the user is a member of. Posts are returned in reverse chronological order (newest first) as News Tiles.

**Authentication**: Required

**Query Parameters**:
- `ringName` (optional, string): Filter posts to only show posts from Rings whose names contain this query (case-insensitive partial matching). If not provided, returns all posts from user's Rings.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface NewsFeedResponse {
  posts: Array<{
    id: string; // UUID
    ring_id: string; // UUID
    ring_name: string;
    user_id: string; // UUID
    author_username: string;
    message_text: string; // First 100 characters, truncated with ellipsis if longer
    image_url: string | null; // URL or file path, null if no image
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "posts": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "ring_id": "770e8400-e29b-41d4-a716-446655440000",
      "ring_name": "Tech Talk",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "author_username": "johndoe",
      "message_text": "This is a post message that might be longer than 100 characters and will be truncated...",
      "image_url": "/uploads/images/post-123.jpg",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: News Feed retrieved successfully (may be empty array)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Error Responses**:
- `500 Internal Server Error`: `{ "error": "Unable to load news feed. Please try again." }` - API request failed

**Processing**:
1. Validate user authentication token/session
2. Retrieve all Rings where user is a member (Membership records)
3. If `ringName` query parameter provided, filter Rings by name (case-insensitive partial matching)
4. Retrieve all Posts from those Rings, ordered by creation timestamp descending
5. For each Post, retrieve author username
6. Format each Post as News Tile:
   - Include full post data
   - Truncate message_text to first 100 characters with ellipsis if longer
   - Include ring_name
7. Return News Feed data

**Empty State**: If user has no Rings or Rings have no posts, returns empty array `{ "posts": [] }`. Frontend displays: "No posts yet. Join or create a Ring to see posts here."

**Performance Target**: 2 seconds (for users with up to 50 Rings and up to 1000 posts total)

---

### 5.3.2 Search Rings in News Feed

**Endpoint**: `GET /api/news-feed?ringName=<query>`

**Description**: Searches for posts in the News Feed by filtering to show only posts from Rings whose names match the search query. This is the same endpoint as View News Feed but with the `ringName` query parameter.

**Authentication**: Required

**Query Parameters**:
- `ringName` (required, string): Search query to filter Ring names (case-insensitive partial matching). Minimum 1 character.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`): Same as View News Feed

**Status Codes**:
- `200 OK`: Filtered News Feed retrieved successfully (may be empty array)
- `400 Bad Request`: Invalid query parameter
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Search query must be at least 1 character" }` - Empty search query
- `500 Internal Server Error`: `{ "error": "Unable to load news feed. Please try again." }` - API request failed

**Processing**:
1. Validate user authentication token/session
2. Validate search query is not empty (minimum 1 character)
3. Perform case-insensitive partial matching on Ring names
4. Retrieve all Rings where user is a member AND Ring name contains search query
5. Retrieve all Posts from matching Rings, ordered by creation timestamp descending
6. Format Posts as News Tiles (same format as View News Feed)
7. Return filtered News Feed data

**Empty State**: If no Rings match or matching Rings have no posts, returns empty array. Frontend displays: "No posts found for '[search query]'"

**Performance Target**: 1 second

---

## 5.4 Ring Management APIs

### 5.4.1 Create Ring

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

---

### 5.4.2 View My Rings List

**Endpoint**: `GET /api/rings`

**Description**: Retrieves a list of all Rings the authenticated user is a member of. Each Ring includes the name (ellipsized to 20 characters if longer) and the member count.

**Authentication**: Required

**Query Parameters**:
- `search` (optional, string): Filter Rings by name (case-insensitive partial matching). If not provided, returns all user's Rings.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface MyRingsResponse {
  rings: Array<{
    id: string; // UUID
    name: string; // Truncated to 20 characters with ellipsis if longer
    member_count: number;
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "rings": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Talk",
      "member_count": 15,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "name": "Very Long Ring Name Th...",
      "member_count": 8,
      "created_at": "2024-01-14T09:20:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Rings list retrieved successfully (may be empty array)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Processing**:
1. Validate user authentication token/session
2. Retrieve all Rings where user is a member (Membership records)
3. If `search` query parameter provided, filter Rings by name (case-insensitive partial matching)
4. For each Ring, count total members (Membership records for that Ring)
5. Format each Ring:
   - Include Ring id, name, member_count, created_at
   - Truncate name to 20 characters with ellipsis if longer
6. Return Rings list data

**Empty State**: If user has no Rings, returns empty array `{ "rings": [] }`. Frontend displays: "You haven't joined any Rings yet. Create or find a Ring to get started."

**Performance Target**: 500ms

---

### 5.4.3 Search My Rings

**Endpoint**: `GET /api/rings?search=<query>`

**Description**: Searches for Rings within the user's My Rings list by filtering to show only Rings whose names match the search query. This is the same endpoint as View My Rings List but with the `search` query parameter.

**Authentication**: Required

**Query Parameters**:
- `search` (optional, string): Search query to filter Ring names (case-insensitive partial matching). If empty or not provided, returns full My Rings list.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`): Same as View My Rings List

**Status Codes**:
- `200 OK`: Filtered Rings list retrieved successfully (may be empty array)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Processing**:
1. Validate user authentication token/session
2. If search query is empty or not provided, return full My Rings list (same as View My Rings List)
3. If search query provided, perform case-insensitive partial matching on Ring names
4. Retrieve all Rings where user is a member AND Ring name contains search query
5. For each matching Ring, count total members
6. Format Rings with name (ellipsized to 20 chars) and member count
7. Return filtered Rings list

**Empty State**: If no Rings match, returns empty array. Frontend displays: "No Rings found matching '[search query]'"

**Performance Target**: 1 second

---

### 5.4.4 Find Ring (Search)

**Endpoint**: `GET /api/rings/search?q=<query>`

**Description**: Searches for Rings by name across the entire platform. Returns a list of Rings whose names match the search query, indicating which Rings the user is already a member of.

**Authentication**: Required

**Query Parameters**:
- `q` (required, string): Search query to match Ring names (case-insensitive partial matching). Minimum 1 character.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface FindRingResponse {
  rings: Array<{
    id: string; // UUID
    name: string;
    member_count: number;
    is_member: boolean; // Whether the authenticated user is a member
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "rings": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Talk",
      "member_count": 15,
      "is_member": true,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "990e8400-e29b-41d4-a716-446655440002",
      "name": "Tech News",
      "member_count": 42,
      "is_member": false,
      "created_at": "2024-01-10T08:15:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Search results retrieved successfully (may be empty array)
- `400 Bad Request`: Invalid query parameter
- `401 Unauthorized`: Missing or invalid authentication
- `429 Too Many Requests`: Rate limit exceeded (20 requests per minute per user)
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Please enter a search query." }` - Search query is empty

**Processing**:
1. Validate user authentication token/session
2. Validate search query is not empty (minimum 1 character)
3. Perform case-insensitive partial matching on Ring names
4. Retrieve all Rings whose names contain the search query
5. For each matching Ring:
   - Count total members
   - Check if user is a member (check Membership record)
6. Format each Ring with id, name, member_count, is_member flag, created_at
7. Return search results

**Empty State**: If no Rings match, returns empty array. Frontend displays: "No Rings found matching '[search query]'"

**Performance Target**: 1 second

---

### 5.4.5 Join Ring (Apply for Membership)

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

---

### 5.4.6 Add User to Ring

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

---

## 5.5 Post APIs

### 5.5.1 View Ring Chat

**Endpoint**: `GET /api/rings/:id/chat`

**Description**: Retrieves all posts in a specific Ring's chat for the authenticated user. Posts are returned in chronological order (oldest first). The user must be a member of the Ring to access the chat.

**Authentication**: Required

**Path Parameters**:
- `id` (required, string, UUID): The Ring ID to view chat for

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface RingChatResponse {
  ring: {
    id: string; // UUID
    name: string;
    created_at: string; // ISO 8601 timestamp
  };
  posts: Array<{
    id: string; // UUID
    user_id: string; // UUID
    author_username: string;
    message_text: string; // Full text, not truncated
    image_url: string | null; // URL or file path, null if no image
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "ring": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Talk",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "posts": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "author_username": "johndoe",
      "message_text": "This is a full post message that is not truncated.",
      "image_url": "/uploads/images/post-123.jpg",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Ring Chat retrieved successfully (may have empty posts array)
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: User is not a member of this Ring
- `404 Not Found`: Ring does not exist
- `500 Internal Server Error`: Server error

**Error Responses**:
- `403 Forbidden`: `{ "error": "You are not a member of this Ring." }` - User tries to access Ring they don't belong to
- `404 Not Found`: `{ "error": "Ring not found." }` - Ring ID does not exist

**Processing**:
1. Validate user authentication token/session
2. Validate Ring ID format (UUID)
3. Retrieve Ring record from database
4. If Ring does not exist, return 404
5. Verify user is a member of the specified Ring (check Membership record)
6. If user is not a member, return 403
7. Retrieve Ring details (name, creation date)
8. Retrieve all Posts for that Ring, ordered by creation timestamp ascending (oldest first)
9. For each Post, retrieve author username
10. Format each Post with full message text (not truncated), picture URL, author username, creation timestamp
11. Return Ring Chat data

**Empty State**: If Ring has no posts, returns empty array `{ "posts": [] }`. Frontend displays: "No messages yet. Be the first to post!"

**Performance Target**: 500ms

---

### 5.5.2 Post Message in Ring

**Endpoint**: `POST /api/rings/:id/posts`

**Description**: Creates a new post in a Ring the authenticated user is a member of. The post contains message text and optionally includes a picture. Once posted, the post immediately appears in the Ring Chat and in the News Feed for all members of that Ring.

**Authentication**: Required

**Path Parameters**:
- `id` (required, string, UUID): The Ring ID to post in

**Request Schema**:
```typescript
// Request uses multipart/form-data for file uploads
interface PostMessageRequest {
  message_text: string; // 1-5000 characters, required
  image?: File; // Optional image file (JPEG, PNG, GIF, max 10MB)
}
```

**Request Body**: `multipart/form-data` with fields:
- `message_text`: Text string (required)
- `image`: File upload (optional)

**Response Schema** (Status: `201 Created`):
```typescript
interface PostMessageResponse {
  post: {
    id: string; // UUID
    ring_id: string; // UUID
    user_id: string; // UUID
    author_username: string;
    message_text: string; // Full text
    image_url: string | null; // URL or file path, null if no image
    created_at: string; // ISO 8601 timestamp
  };
}
```

**Response Body Example**:
```json
{
  "post": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "ring_id": "770e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "author_username": "johndoe",
    "message_text": "This is a new post message.",
    "image_url": "/uploads/images/post-123.jpg",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `201 Created`: Post created successfully
- `400 Bad Request`: Validation error (see error messages below)
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: User is not a member of this Ring
- `404 Not Found`: Ring does not exist
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Message cannot be empty." }` - Message text is empty
- `400 Bad Request`: `{ "error": "Message must be 5000 characters or less." }` - Message exceeds length limit
- `400 Bad Request`: `{ "error": "Image file is too large. Maximum size is 10MB." }` - Image exceeds size limit
- `400 Bad Request`: `{ "error": "Unsupported image format. Please use JPEG, PNG, or GIF." }` - Invalid image format
- `403 Forbidden`: `{ "error": "You are not a member of this Ring." }` - User tries to post in Ring they don't belong to
- `404 Not Found`: `{ "error": "Ring not found." }` - Ring ID does not exist

**Input Validation Rules**:
- Message text: Required, 1-5000 characters, cannot be empty
- Image file: Optional, maximum 10MB, supported formats: JPEG, PNG, GIF
- File type validation must occur before file processing
- File size validation must occur before file storage attempt

**Processing**:
1. Validate user authentication token/session
2. Validate Ring ID format (UUID)
3. Retrieve Ring record from database
4. If Ring does not exist, return 404
5. Verify user is a member of the specified Ring (check Membership record)
6. If user is not a member, return 403
7. Validate message text is not empty and meets length requirements
8. If picture is provided:
   - Validate file type (JPEG, PNG, GIF)
   - Validate file size (max 10MB)
   - Upload image file to local filesystem storage
   - Generate image URL/path
9. Create new Post record in database with ring_id, user_id, message_text, image_url (if provided), creation timestamp (within transaction)
10. Retrieve author username
11. Return success response with new Post data

**Performance Target**: 
- Text-only post: 500ms
- Post with image: 2 seconds (includes image upload and processing)

---

## 5.6 API Summary

### Authentication APIs
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/settings` - View Settings

### News Feed APIs
- `GET /api/news-feed` - View News Feed
- `GET /api/news-feed?ringName=<query>` - Search Rings in News Feed

### Ring Management APIs
- `POST /api/rings` - Create Ring
- `GET /api/rings` - View My Rings List
- `GET /api/rings?search=<query>` - Search My Rings
- `GET /api/rings/search?q=<query>` - Find Ring (Search)
- `POST /api/rings/:id/join` - Join Ring
- `POST /api/rings/:id/members` - Add User to Ring

### Post APIs
- `GET /api/rings/:id/chat` - View Ring Chat
- `POST /api/rings/:id/posts` - Post Message in Ring

### Common Patterns
- All endpoints use JSON for requests/responses (except file uploads which use multipart/form-data)
- All protected endpoints require authentication via session cookie
- All endpoints return consistent error response format: `{ "error": "message" }`
- All endpoints include rate limit headers in responses
- All timestamps are in ISO 8601 format
- All UUIDs are in standard UUID format
