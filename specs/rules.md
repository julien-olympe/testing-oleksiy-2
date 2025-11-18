# API General Rules

This document defines general rules and patterns that apply to all APIs in the Rings application.

## 1. Authentication Mechanism

### Session Management
- All APIs use session-based authentication with HTTP-only cookies
- Session cookies are managed using the `@fastify/cookie` plugin
- Cookies are HTTP-only (not accessible via JavaScript) for security
- Cookies are secure (HTTPS-only) in production environments
- Session expiration: 7 days of inactivity
- Sessions are invalidated on logout

### Authentication Flow
1. User authenticates via `/api/auth/register` or `/api/auth/login`
2. Server creates a session and sets an HTTP-only cookie
3. Client includes the cookie automatically in subsequent requests
4. Server validates the session on each protected endpoint
5. Invalid or expired sessions return `401 Unauthorized`

### Protected Endpoints
- All endpoints except `/api/auth/register` and `/api/auth/login` require authentication
- Unauthenticated requests to protected endpoints return `401 Unauthorized`
- Authentication validation occurs before any business logic execution

## 2. Logging and Error Handling

### Logging Patterns
- All API requests must be logged with: timestamp, HTTP method, endpoint path, user ID (if authenticated), request ID
- All errors must be logged server-side with: timestamp, error type, error message, stack trace, request details
- Logs must not contain sensitive information (passwords, authentication tokens, session IDs)
- Logs are stored in files or logging service (not in database)

### Error Handling Patterns
- All API endpoints must implement try-catch blocks to handle exceptions
- Unhandled exceptions must not crash the server
- All exceptions must be caught and converted to appropriate HTTP error responses
- Error responses must include user-friendly error messages in response body
- Technical error details (stack traces, database errors) must not be exposed to clients in production

### HTTP Status Codes
- `200 OK`: Successful GET, PUT, DELETE requests
- `201 Created`: Successful POST requests that create resources
- `400 Bad Request`: Invalid input, validation errors, malformed requests
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized to access resource
- `404 Not Found`: Resource does not exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side errors, database failures

### Error Response Format
All error responses follow this structure:
```typescript
{
  error: string; // User-friendly error message
  code?: string; // Optional error code for client-side handling
}
```

### Database Exception Handling
- All database operations must be wrapped in try-catch blocks
- Database connection errors must be handled gracefully
- Query errors (SQL syntax, constraint violations) must be caught and converted to user-friendly messages
- Foreign key constraint violations must return specific error messages (e.g., "Ring not found")
- Unique constraint violations must return specific error messages (e.g., "Username already exists")

### Transaction Management
- All database operations that modify multiple tables must use transactions
- Transactions must be rolled back if any operation within the transaction fails
- Default transaction isolation level: READ COMMITTED
- Transactions prevent race conditions (e.g., duplicate memberships)

## 3. Input Validation

### Validation Rules
- All input validation must occur server-side (client-side validation is for UX only)
- Validation errors return `400 Bad Request` with specific error message
- Input must be validated before any database operations

### Common Validation Patterns
- **Username**: 3-50 characters, alphanumeric and underscores only
- **Password**: Minimum 8 characters, must contain at least one letter and one number
- **Ring name**: 1-100 characters, not empty
- **Message text**: 1-5000 characters, not empty
- **File uploads**: File type validation (JPEG, PNG, GIF), file size validation (max 10MB)

### SQL Injection Prevention
- All database queries must use parameterized queries (prepared statements)
- No string concatenation for SQL queries
- User input must never be directly inserted into SQL strings

### XSS Prevention
- All user-generated content must be sanitized before display
- HTML tags in user input must be escaped or stripped
- Image URLs must be validated to prevent javascript: or data: protocol injections

## 4. Rate Limiting

### Rate Limit Rules
- Rate limiting is implemented using in-memory store
- Rate limits are tracked per user/IP in server memory
- Rate limits reset after time window expires
- Rate limit exceeded responses: HTTP `429 Too Many Requests` with `Retry-After` header

### Rate Limit Headers
All responses include rate limit headers:
- `X-RateLimit-Limit`: Maximum number of requests allowed in time window
- `X-RateLimit-Remaining`: Number of requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when rate limit resets

### Rate Limit Thresholds
- Authentication endpoints (login, registration): 5 requests per minute per IP address
- Post creation endpoints: 10 requests per minute per user
- Search endpoints: 20 requests per minute per user
- General API endpoints: 100 requests per minute per user

## 5. CORS Configuration

### CORS Policy
- CORS configured using `@fastify/cors` plugin
- Allowed origins: Specific domain(s) in production, localhost for development
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization, Cookie
- Credentials: true (cookies and authentication headers allowed)
- Preflight requests: Handled automatically by `@fastify/cors`

## 6. API Design Standards

### RESTful Conventions
- All API endpoints follow RESTful conventions
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- URL structure: `/api/<resource>` (e.g., `/api/auth/register`, `/api/rings`, `/api/posts`)
- Resource naming: Plural nouns (rings, posts, users, memberships)
- Response format: JSON for all responses

### Request/Response Format
- All requests and responses use JSON format
- Content-Type header: `application/json` for JSON requests
- Content-Type header: `multipart/form-data` for file uploads
- All timestamps are in ISO 8601 format (e.g., `2024-01-15T10:30:00Z`)

### TypeScript Types
- All request and response schemas must have TypeScript type definitions
- Types must be defined using TypeScript interfaces
- Types must match database schema types where applicable

## 7. Performance Requirements

### Response Time Targets
- News Feed loading: Within 2 seconds (for users with up to 50 Rings)
- Search operations: Within 1 second
- General API endpoints: Within 500ms under normal load
- Post creation with image: Within 2 seconds (includes image upload and processing)

### Database Query Performance
- All database queries must use indexes (as defined in Data Structure Specification)
- Complex queries (News Feed aggregation) must complete within 1.5 seconds
- Simple queries (single record lookup) must complete within 50ms

## 8. Testability

### Mockable Design
- All APIs must be designed to be testable in a mockable way
- No calls to external APIs (all functionality is self-contained)
- Database operations must be abstracted to allow mocking in tests
- File system operations must be abstracted to allow mocking in tests

### Test Data
- Test data must be isolated and cleaned up after tests
- Test factories or fixtures should be used for consistent test data creation
- Tests must not depend on production data

## 9. Authorization and Access Control

### Ring Access Control
- Users can only access Rings they are members of
- API endpoints for Ring Chat must verify user membership before returning data
- API endpoints for posting in Ring must verify user membership before allowing post creation
- Unauthorized access attempts return `403 Forbidden` response

### User Data Access Control
- Users can only view their own user data (username, settings)
- Users cannot modify other users' data
- Users can only add posts to Rings they are members of
- Users can only add other users to Rings they are members of

## 10. File Upload Handling

### Image Upload Rules
- Maximum file size: 10MB
- Supported formats: JPEG, PNG, GIF
- File type validation must occur before file processing
- File size validation must occur before file storage attempt
- Images stored in local filesystem with references in database
- Image URLs stored in database (Post.image_url field)

### File Upload Error Handling
- Image upload failures must be caught and handled
- File system errors (disk full, permission denied) must return error messages
- Invalid file type errors must be caught before file processing
- File size validation must occur before file storage attempt
