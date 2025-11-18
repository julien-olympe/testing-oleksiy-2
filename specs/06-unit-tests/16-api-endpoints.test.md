# Unit Test Specification: API Endpoints

## Overview
This document specifies unit tests for all API endpoints, covering request validation, authentication/authorization, business logic execution, database operations, response formatting, and error handling.

## API Endpoints Overview

### Authentication Endpoints
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login
- `POST /api/auth/logout` - User Logout

### News Feed Endpoints
- `GET /api/news-feed` - View News Feed
- `GET /api/news-feed?q=query` - Search Rings in News Feed

### Ring Management Endpoints
- `GET /api/rings` - View My Rings List
- `GET /api/rings?q=query` - Search My Rings
- `POST /api/rings` - Create Ring
- `GET /api/rings/:id/chat` - View Ring Chat
- `POST /api/rings/:id/posts` - Post Message in Ring
- `POST /api/rings/:id/members` - Add User to Ring
- `GET /api/rings/search?q=query` - Find Ring (Search)
- `POST /api/rings/:id/join` - Join Ring

### Settings Endpoints
- `GET /api/settings` - View Settings

## Test Setup and Mock Data

### Mock Requirements
- Mock Fastify request/response objects
- Mock authentication middleware
- Mock database operations
- Mock file system operations
- Mock multipart parsing

## Test Cases

### TC-API-001: API Endpoint - Request Validation
**Description**: Test that all API endpoints validate request inputs.

**Test Steps**:
1. Arrange: Mock authentication and database
2. Act: Call endpoint with invalid input (missing required fields, wrong types, invalid formats)
3. Assert: Verify validation errors are returned
4. Assert: Verify correct HTTP status codes (400 Bad Request)

**Test Cases**:
- Missing required fields
- Invalid data types
- Invalid formats (UUIDs, email, etc.)
- Field length violations
- Invalid enum values

**Expected Output**:
- Status: 400 Bad Request
- Error message indicates validation failure

---

### TC-API-002: API Endpoint - Authentication Required
**Description**: Test that protected endpoints require authentication.

**Test Steps**:
1. Arrange: Mock request without authentication token
2. Act: Call protected endpoint
3. Assert: Verify authentication middleware rejects request
4. Assert: Verify correct HTTP status code (401 Unauthorized)

**Protected Endpoints**:
- All endpoints except `/api/auth/register` and `/api/auth/login`

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-API-003: API Endpoint - Invalid Authentication Token
**Description**: Test that invalid authentication tokens are rejected.

**Test Steps**:
1. Arrange: Mock request with invalid/expired token
2. Act: Call protected endpoint
3. Assert: Verify authentication validation fails
4. Assert: Verify correct HTTP status code (401 Unauthorized)

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Invalid or expired authentication token"

---

### TC-API-004: API Endpoint - Authorization Checks
**Description**: Test that endpoints verify user authorization.

**Test Steps**:
1. Arrange: Mock authenticated user
2. Arrange: Mock user attempting to access unauthorized resource
3. Act: Call endpoint requiring specific permissions
4. Assert: Verify authorization check fails
5. Assert: Verify correct HTTP status code (403 Forbidden)

**Authorization Checks**:
- Ring membership verification (View Ring Chat, Post Message)
- Resource ownership verification

**Expected Output**:
- Status: 403 Forbidden
- Error: Appropriate authorization error message

---

### TC-API-005: API Endpoint - Database Operation Success
**Description**: Test that database operations succeed in happy path.

**Test Steps**:
1. Arrange: Mock authentication and database operations
2. Arrange: Mock successful database queries/inserts
3. Act: Call endpoint
4. Assert: Verify database operations are called with correct parameters
5. Assert: Verify correct HTTP status codes (200 OK, 201 Created)

**Expected Output**:
- Status: 200 OK or 201 Created
- Response contains expected data

---

### TC-API-006: API Endpoint - Database Connection Error
**Description**: Test that database connection errors are handled gracefully.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock database connection to throw error
3. Act: Call endpoint
4. Assert: Verify error is caught and handled
5. Assert: Verify correct HTTP status code (500 Internal Server Error)
6. Assert: Verify user-friendly error message

**Expected Output**:
- Status: 500 Internal Server Error
- Error: User-friendly message (no technical details exposed)

---

### TC-API-007: API Endpoint - Database Query Error
**Description**: Test that database query errors are handled gracefully.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock database query to throw error
3. Act: Call endpoint
4. Assert: Verify error is caught and handled
5. Assert: Verify correct HTTP status code
6. Assert: Verify user-friendly error message

**Expected Output**:
- Status: 500 Internal Server Error
- Error: User-friendly message

---

### TC-API-008: API Endpoint - Database Constraint Violations
**Description**: Test that database constraint violations are handled correctly.

**Test Steps**:
1. Arrange: Mock authentication and database
2. Arrange: Mock unique constraint violation
3. Act: Call endpoint (e.g., register with duplicate username)
4. Assert: Verify constraint violation is caught
5. Assert: Verify correct HTTP status code (400 Bad Request)
6. Assert: Verify user-friendly error message

**Test Cases**:
- Unique constraint violations (username, ring name)
- Foreign key constraint violations
- NOT NULL constraint violations

**Expected Output**:
- Status: 400 Bad Request
- Error: User-friendly message (e.g., "Username already exists")

---

### TC-API-009: API Endpoint - Response Formatting
**Description**: Test that all API responses are properly formatted.

**Test Steps**:
1. Arrange: Mock all dependencies for successful operation
2. Act: Call endpoint
3. Assert: Verify response is valid JSON
4. Assert: Verify response structure matches specification
5. Assert: Verify correct HTTP status code
6. Assert: Verify correct Content-Type header

**Expected Output**:
- Status: Appropriate HTTP status code
- Content-Type: application/json
- Response: Valid JSON matching specification

---

### TC-API-010: API Endpoint - Error Response Formatting
**Description**: Test that error responses are properly formatted.

**Test Steps**:
1. Arrange: Mock error condition
2. Act: Call endpoint
3. Assert: Verify error response is valid JSON
4. Assert: Verify error response structure is consistent
5. Assert: Verify error message is user-friendly

**Expected Output**:
- Status: Appropriate error status code
- Content-Type: application/json
- Response: `{ error: "User-friendly error message" }`

---

### TC-API-011: API Endpoint - Rate Limiting
**Description**: Test that rate limiting is enforced on all endpoints.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set appropriate rate limits per endpoint
3. Act: Call endpoint exceeding rate limit
4. Assert: Verify rate limit is enforced
5. Assert: Verify correct HTTP status code (429 Too Many Requests)
6. Assert: Verify Retry-After header is included

**Rate Limits**:
- Authentication endpoints: 5 requests/minute per IP
- Post creation: 10 requests/minute per user
- Search endpoints: 20 requests/minute per user
- General endpoints: 100 requests/minute per user

**Expected Output**:
- Status: 429 Too Many Requests
- Headers: Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining

---

### TC-API-012: API Endpoint - CORS Headers
**Description**: Test that CORS headers are set correctly.

**Test Steps**:
1. Arrange: Mock request with Origin header
2. Act: Call endpoint
3. Assert: Verify CORS headers are included in response
4. Assert: Verify allowed origins are correct
5. Assert: Verify allowed methods are correct

**Expected Output**:
- Headers: Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials

---

### TC-API-013: API Endpoint - Request Body Parsing
**Description**: Test that request bodies are parsed correctly.

**Test Steps**:
1. Arrange: Mock request with JSON body
2. Act: Call POST/PUT endpoint
3. Assert: Verify request body is parsed
4. Assert: Verify body data is accessible in handler
5. Assert: Verify invalid JSON is rejected

**Expected Output**:
- Valid JSON: Parsed correctly
- Invalid JSON: 400 Bad Request

---

### TC-API-014: API Endpoint - Multipart Form Data Parsing
**Description**: Test that multipart form data (file uploads) are parsed correctly.

**Test Steps**:
1. Arrange: Mock request with multipart/form-data
2. Arrange: Mock file upload
3. Act: Call endpoint with file upload (Post Message with image)
4. Assert: Verify multipart data is parsed
5. Assert: Verify file is accessible in handler
6. Assert: Verify invalid multipart data is rejected

**Expected Output**:
- Valid multipart: Parsed correctly
- Invalid multipart: 400 Bad Request

---

### TC-API-015: API Endpoint - URL Parameter Validation
**Description**: Test that URL parameters are validated.

**Test Steps**:
1. Arrange: Mock request with URL parameters
2. Act: Call endpoint with invalid parameters (e.g., invalid UUID)
3. Assert: Verify parameter validation fails
4. Assert: Verify correct HTTP status code (400 Bad Request)

**Test Cases**:
- Invalid UUID format in :id parameters
- Missing required parameters
- Invalid parameter types

**Expected Output**:
- Status: 400 Bad Request
- Error: Parameter validation error

---

### TC-API-016: API Endpoint - Query Parameter Validation
**Description**: Test that query parameters are validated.

**Test Steps**:
1. Arrange: Mock request with query parameters
2. Act: Call endpoint with invalid query parameters
3. Assert: Verify query parameter validation
4. Assert: Verify correct handling of optional parameters

**Test Cases**:
- Invalid query parameter values
- Missing required query parameters
- Optional query parameters

**Expected Output**:
- Valid parameters: Processed correctly
- Invalid parameters: 400 Bad Request

---

### TC-API-017: API Endpoint - Transaction Management
**Description**: Test that endpoints using transactions handle them correctly.

**Test Steps**:
1. Arrange: Mock transaction operations
2. Act: Call endpoint requiring transaction (e.g., Create Ring with Membership)
3. Assert: Verify transaction is started
4. Assert: Verify transaction is committed on success
5. Assert: Verify transaction is rolled back on error

**Endpoints Using Transactions**:
- Create Ring (creates Ring + Membership)
- Post Message with Image (creates Post + uploads Image)

**Expected Output**:
- Success: Transaction committed
- Error: Transaction rolled back

---

### TC-API-018: API Endpoint - Concurrent Request Handling
**Description**: Test that endpoints handle concurrent requests correctly.

**Test Steps**:
1. Arrange: Mock authentication and database
2. Act: Simulate 100 concurrent requests to endpoint
3. Assert: Verify all requests are handled
4. Assert: Verify no race conditions
5. Assert: Verify database connection pool handles load

**Expected Output**:
- All requests complete successfully
- No connection pool exhaustion
- No race conditions

---

### TC-API-019: API Endpoint - Request Timeout Handling
**Description**: Test that endpoints handle request timeouts gracefully.

**Test Steps**:
1. Arrange: Mock slow database operation
2. Arrange: Set request timeout
3. Act: Call endpoint
4. Assert: Verify timeout is handled
5. Assert: Verify appropriate error response

**Expected Output**:
- Status: 504 Gateway Timeout or 500 Internal Server Error
- Error: User-friendly timeout message

---

### TC-API-020: API Endpoint - Security Headers
**Description**: Test that security headers are set correctly.

**Test Steps**:
1. Arrange: Mock request
2. Act: Call endpoint
3. Assert: Verify security headers are included
4. Assert: Verify headers prevent common attacks

**Security Headers**:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

**Expected Output**:
- Security headers included in all responses

---

### TC-API-021: API Endpoint - Input Sanitization
**Description**: Test that user inputs are sanitized to prevent XSS and injection attacks.

**Test Steps**:
1. Arrange: Mock request with malicious input
2. Act: Call endpoint
3. Assert: Verify input is sanitized
4. Assert: Verify XSS attempts are neutralized
5. Assert: Verify SQL injection attempts are prevented

**Test Cases**:
- XSS attempts in text fields
- SQL injection attempts
- Script tags in input

**Expected Output**:
- Malicious input sanitized or rejected
- No security vulnerabilities

---

### TC-API-022: API Endpoint - Resource Not Found
**Description**: Test that endpoints return 404 for non-existent resources.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock resource lookup to return null
3. Act: Call endpoint with non-existent resource ID
4. Assert: Verify 404 Not Found is returned
5. Assert: Verify user-friendly error message

**Expected Output**:
- Status: 404 Not Found
- Error: "Resource not found" or specific message

---

### TC-API-023: API Endpoint - Method Not Allowed
**Description**: Test that endpoints reject unsupported HTTP methods.

**Test Steps**:
1. Arrange: Mock request with unsupported method
2. Act: Call endpoint with wrong method (e.g., PUT on GET-only endpoint)
3. Assert: Verify 405 Method Not Allowed is returned

**Expected Output**:
- Status: 405 Method Not Allowed
- Headers: Allow header with supported methods

---

### TC-API-024: API Endpoint - Content-Length Validation
**Description**: Test that endpoints validate request body size.

**Test Steps**:
1. Arrange: Mock request with oversized body
2. Act: Call endpoint
3. Assert: Verify request is rejected
4. Assert: Verify correct HTTP status code (413 Payload Too Large)

**Expected Output**:
- Status: 413 Payload Too Large
- Error: Request body size limit exceeded

---

### TC-API-025: API Endpoint - Response Caching Headers
**Description**: Test that appropriate caching headers are set (if applicable).

**Test Steps**:
1. Arrange: Mock request
2. Act: Call endpoint
3. Assert: Verify caching headers are set appropriately
4. Assert: Verify dynamic content is not cached

**Expected Output**:
- Cache-Control headers set appropriately
- Dynamic content: no-cache
- Static content: appropriate cache headers

---

### TC-API-026: API Endpoint - Logging
**Description**: Test that API requests and errors are logged.

**Test Steps**:
1. Arrange: Mock logger
2. Act: Call endpoint (success and error cases)
3. Assert: Verify requests are logged
4. Assert: Verify errors are logged with appropriate detail
5. Assert: Verify sensitive information is not logged

**Expected Output**:
- Requests logged with timestamp, method, path, status
- Errors logged with stack traces (server-side only)
- Passwords and tokens not logged

---

### TC-API-027: API Endpoint - Performance Requirements
**Description**: Test that endpoints meet performance requirements.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Act: Call endpoint
3. Assert: Verify response time meets requirements
4. Assert: Verify database queries are optimized

**Performance Requirements**:
- Most endpoints: < 500ms
- News Feed: < 2 seconds
- Search: < 1 second

**Expected Output**:
- Response times within specified limits

---

### TC-API-028: API Endpoint - Pagination (If Implemented)
**Description**: Test that endpoints supporting pagination handle it correctly.

**Test Steps**:
1. Arrange: Mock large dataset
2. Act: Call endpoint with pagination parameters
3. Assert: Verify pagination works correctly
4. Assert: Verify page size limits are enforced

**Note**: Pagination may not be implemented in initial version, but test should verify behavior if added.

**Expected Output**:
- Pagination parameters respected
- Page size limits enforced
- Next/previous page links included (if applicable)
