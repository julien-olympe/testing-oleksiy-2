# 4.2 Security

This document defines security requirements and mechanisms for the Rings application.

## 4.2.1 Password Security

**Password Hashing**:
- All passwords must be hashed using bcrypt algorithm
- Bcrypt salt rounds: 10 (minimum)
- Passwords must never be stored in plain text
- Password hashes must be stored in User.password_hash field
- Password comparison during login must use bcrypt compare function

**Password Validation**:
- Minimum length: 8 characters
- Must contain at least one letter (a-z, A-Z)
- Must contain at least one number (0-9)
- Validation must occur on both client-side and server-side
- Server-side validation is authoritative (client-side validation is for UX only)

## 4.2.2 Authentication and Session Management

**Authentication Tokens**:
- Authentication uses session cookies with @fastify/cookie plugin. Session cookies are HTTP-only and secure.
- Cookies must be secure (HTTPS-only) in production
- Session expiration: 7 days of inactivity
- Sessions must be invalidated on logout

**Session Management**:
- Session data stored server-side (in-memory or database)
- Session ID stored in HTTP-only cookie
- Session must be validated on every protected API request
- Invalid or expired sessions must return 401 Unauthorized response
- Session must be cleared on logout

**Authentication Middleware**:
- All protected API endpoints must validate authentication token/session
- Unauthenticated requests to protected endpoints must return 401 Unauthorized
- Authentication validation must occur before business logic execution

## 4.2.3 Input Validation and Sanitization

**SQL Injection Prevention**:
- All database queries must use parameterized queries (prepared statements)
- No string concatenation for SQL queries
- User input must never be directly inserted into SQL strings
- Database driver (pg) handles parameterization automatically when using parameterized queries

**XSS (Cross-Site Scripting) Prevention**:
- All user-generated content must be sanitized before display
- HTML tags in user input must be escaped or stripped
- React automatically escapes content in JSX, but explicit sanitization required for rich text (not in scope)
- Image URLs must be validated to prevent javascript: or data: protocol injections

**Input Validation Rules**:
- Username: 3-50 characters, alphanumeric and underscores only, server-side validation
- Ring name: 1-100 characters, server-side validation
- Message text: 1-5000 characters, server-side validation
- File uploads: File type validation (JPEG, PNG, GIF), file size validation (max 10MB), server-side validation
- All validation must occur server-side (client-side validation is for UX only)

## 4.2.4 CORS Configuration

**CORS Policy**:
- CORS must be configured using @fastify/cors plugin
- Allowed origins: Specific domain(s) in production, localhost for development
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization, Cookie
- Credentials: true (cookies and authentication headers allowed)
- Preflight requests: Handled automatically by @fastify/cors

## 4.2.5 Rate Limiting

**API Rate Limiting**:
- Rate limiting must be implemented on all API endpoints
- Authentication endpoints (login, registration): 5 requests per minute per IP address
- Post creation endpoints: 10 requests per minute per user
- Search endpoints: 20 requests per minute per user
- General API endpoints: 100 requests per minute per user
- Rate limit exceeded responses: HTTP 429 Too Many Requests with Retry-After header

**Rate Limiting Implementation**:
- Rate limiting is implemented using in-memory store. Rate limits are tracked per user/IP in server memory.
- Rate limits reset after time window expires
- Rate limit headers included in responses: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

## 4.2.6 Authorization and Access Control

**Ring Access Control**:
- Users can only access Rings they are members of
- API endpoints for Ring Chat must verify user membership before returning data
- API endpoints for posting in Ring must verify user membership before allowing post creation
- Unauthorized access attempts must return 403 Forbidden response

**User Data Access Control**:
- Users can only view their own user data (username, settings)
- Users cannot modify other users' data
- Users can only add posts to Rings they are members of
- Users can only add other users to Rings they are members of

**Resource Ownership**:
- Ring creators have no special permissions (all members have equal permissions)
- Users cannot delete Rings (not in scope)
- Users cannot delete posts (not in scope)
- Users cannot remove other members from Rings (not in scope)
