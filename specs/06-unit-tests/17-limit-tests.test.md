# Unit Test Specification: Limit Tests

## Overview
This document specifies unit tests for system limits, including maximum concurrent users, file size limits, text length limits, database connection pool limits, and rate limiting boundaries.

## Test Setup and Mock Data

### Mock Requirements
- Mock database connection pool
- Mock rate limiter
- Mock file system
- Mock concurrent request handling

## Test Cases

### TC-LIMIT-001: Maximum Concurrent Users (1000)
**Description**: Test system behavior with maximum concurrent users.

**Test Steps**:
1. Arrange: Mock 1000 concurrent authenticated users
2. Arrange: Mock concurrent operations (News Feed, Post Creation, Search)
3. Act: Simulate 1000 concurrent requests
4. Assert: Verify all requests are handled
5. Assert: Verify system remains stable
6. Assert: Verify response times remain acceptable
7. Assert: Verify no connection pool exhaustion

**Expected Output**:
- All 1000 requests complete successfully
- Response times within acceptable limits
- No connection pool exhaustion
- System remains stable

**Performance Targets**:
- News Feed requests: Up to 1000 simultaneous
- Post creation: Up to 100 concurrent
- Search operations: Up to 200 concurrent
- Ring creation: Up to 50 concurrent
- Authentication: Up to 100 concurrent

---

### TC-LIMIT-002: Maximum File Size - Image Upload (10MB)
**Description**: Test image upload with maximum file size.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock image file with size exactly 10MB
3. Act: Call post creation endpoint with 10MB image
4. Assert: Verify file size validation passes
5. Assert: Verify image upload succeeds
6. Arrange: Mock image file with size 10.1MB
7. Act: Call post creation endpoint with 10.1MB image
8. Assert: Verify file size validation fails
9. Assert: Verify upload is rejected

**Expected Output**:
- 10MB file: Upload succeeds
- 10.1MB file: 400 Bad Request - "Image file is too large. Maximum size is 10MB."

**Boundary Tests**:
- 9.9MB: Should succeed
- 10MB: Should succeed
- 10.1MB: Should fail
- 9MB: Should succeed

---

### TC-LIMIT-003: Maximum Text Length - Message (5000 characters)
**Description**: Test message text with maximum length.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message text exactly 5000 characters
3. Act: Call post creation endpoint with 5000 character message
4. Assert: Verify message validation passes
5. Assert: Verify post creation succeeds
6. Arrange: Mock message text with 5001 characters
7. Act: Call post creation endpoint with 5001 character message
8. Assert: Verify message validation fails
9. Assert: Verify post creation is rejected

**Expected Output**:
- 5000 characters: Post creation succeeds
- 5001 characters: 400 Bad Request - "Message must be 5000 characters or less."

**Boundary Tests**:
- 4999 characters: Should succeed
- 5000 characters: Should succeed
- 5001 characters: Should fail
- 1 character: Should succeed (minimum)

---

### TC-LIMIT-004: Maximum Text Length - Ring Name (100 characters)
**Description**: Test ring name with maximum length.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock ring name exactly 100 characters
3. Act: Call ring creation endpoint with 100 character name
4. Assert: Verify ring name validation passes
5. Assert: Verify ring creation succeeds
6. Arrange: Mock ring name with 101 characters
7. Act: Call ring creation endpoint with 101 character name
8. Assert: Verify ring name validation fails
9. Assert: Verify ring creation is rejected

**Expected Output**:
- 100 characters: Ring creation succeeds
- 101 characters: 400 Bad Request - "Ring name must be between 1 and 100 characters."

**Boundary Tests**:
- 99 characters: Should succeed
- 100 characters: Should succeed
- 101 characters: Should fail
- 1 character: Should succeed (minimum)

---

### TC-LIMIT-005: Maximum Text Length - Username (50 characters)
**Description**: Test username with maximum length.

**Test Steps**:
1. Arrange: Mock database
2. Arrange: Mock username exactly 50 characters
3. Act: Call user registration endpoint with 50 character username
4. Assert: Verify username validation passes
5. Assert: Verify registration succeeds
6. Arrange: Mock username with 51 characters
7. Act: Call user registration endpoint with 51 character username
8. Assert: Verify username validation fails
9. Assert: Verify registration is rejected

**Expected Output**:
- 50 characters: Registration succeeds
- 51 characters: 400 Bad Request - "Username must be 3-50 characters and contain only letters, numbers, and underscores."

**Boundary Tests**:
- 49 characters: Should succeed
- 50 characters: Should succeed
- 51 characters: Should fail
- 3 characters: Should succeed (minimum)
- 2 characters: Should fail (below minimum)

---

### TC-LIMIT-006: Database Connection Pool - Minimum (20 connections)
**Description**: Test system behavior with minimum connection pool size.

**Test Steps**:
1. Arrange: Mock database connection pool with 20 connections
2. Arrange: Mock 20 concurrent database operations
3. Act: Execute 20 concurrent requests requiring database access
4. Assert: Verify all requests are handled
5. Assert: Verify no connection pool exhaustion
6. Assert: Verify requests complete successfully

**Expected Output**:
- All 20 requests complete successfully
- No connection pool exhaustion
- Connections are properly managed

---

### TC-LIMIT-007: Database Connection Pool - Maximum (100 connections)
**Description**: Test system behavior with maximum connection pool size.

**Test Steps**:
1. Arrange: Mock database connection pool with 100 connections
2. Arrange: Mock 100 concurrent database operations
3. Act: Execute 100 concurrent requests requiring database access
4. Assert: Verify all requests are handled
5. Assert: Verify connection pool reaches maximum
6. Assert: Verify additional requests wait for available connections
7. Assert: Verify no connection pool overflow

**Expected Output**:
- All 100 requests complete successfully
- Connection pool reaches maximum capacity
- Additional requests wait for available connections
- No connection pool overflow

---

### TC-LIMIT-008: Database Connection Pool - Exhaustion Handling
**Description**: Test system behavior when connection pool is exhausted.

**Test Steps**:
1. Arrange: Mock database connection pool with all connections in use
2. Arrange: Mock additional request requiring database access
3. Act: Execute request when pool is exhausted
4. Assert: Verify request waits for available connection
5. Assert: Verify request eventually completes
6. Assert: Verify appropriate timeout handling
7. Assert: Verify error is returned if timeout exceeded

**Expected Output**:
- Request waits for available connection
- Request completes when connection available
- Timeout error if wait exceeds limit

---

### TC-LIMIT-009: Rate Limiting - Authentication Endpoints (5 requests/minute)
**Description**: Test rate limiting on authentication endpoints.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 5 requests per minute per IP
3. Act: Call authentication endpoint 6 times rapidly
4. Assert: Verify first 5 requests succeed
5. Assert: Verify 6th request returns 429 Too Many Requests
6. Assert: Verify Retry-After header is included
7. Assert: Verify rate limit headers are included

**Expected Output**:
- First 5 requests: 200 OK or 201 Created
- 6th request: 429 Too Many Requests
- Headers: Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

**Boundary Tests**:
- 4 requests: Should succeed
- 5 requests: Should succeed
- 6 requests: Should fail
- Wait 1 minute: Should reset and allow 5 more requests

---

### TC-LIMIT-010: Rate Limiting - Post Creation (10 requests/minute)
**Description**: Test rate limiting on post creation endpoint.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 10 requests per minute per user
3. Act: Call post creation endpoint 11 times rapidly
4. Assert: Verify first 10 requests succeed
5. Assert: Verify 11th request returns 429 Too Many Requests

**Expected Output**:
- First 10 requests: 201 Created
- 11th request: 429 Too Many Requests

**Boundary Tests**:
- 9 requests: Should succeed
- 10 requests: Should succeed
- 11 requests: Should fail

---

### TC-LIMIT-011: Rate Limiting - Search Endpoints (20 requests/minute)
**Description**: Test rate limiting on search endpoints.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 20 requests per minute per user
3. Act: Call search endpoint 21 times rapidly
4. Assert: Verify first 20 requests succeed
5. Assert: Verify 21st request returns 429 Too Many Requests

**Expected Output**:
- First 20 requests: 200 OK
- 21st request: 429 Too Many Requests

**Boundary Tests**:
- 19 requests: Should succeed
- 20 requests: Should succeed
- 21 requests: Should fail

---

### TC-LIMIT-012: Rate Limiting - General Endpoints (100 requests/minute)
**Description**: Test rate limiting on general API endpoints.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 100 requests per minute per user
3. Act: Call general endpoint 101 times rapidly
4. Assert: Verify first 100 requests succeed
5. Assert: Verify 101st request returns 429 Too Many Requests

**Expected Output**:
- First 100 requests: 200 OK
- 101st request: 429 Too Many Requests

**Boundary Tests**:
- 99 requests: Should succeed
- 100 requests: Should succeed
- 101 requests: Should fail

---

### TC-LIMIT-013: Rate Limiting - Reset After Time Window
**Description**: Test that rate limits reset after time window expires.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 5 requests per minute
3. Act: Call endpoint 5 times (exhaust limit)
4. Arrange: Mock time passage (1 minute)
5. Act: Call endpoint again
6. Assert: Verify rate limit is reset
7. Assert: Verify request succeeds

**Expected Output**:
- After time window: Rate limit reset
- Request succeeds after reset

---

### TC-LIMIT-014: Rate Limiting - Per User vs Per IP
**Description**: Test that rate limiting works correctly per user and per IP.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 5 requests per minute per IP for auth endpoints
3. Arrange: Set rate limit to 10 requests per minute per user for post creation
4. Act: Call auth endpoint 6 times from same IP
5. Assert: Verify 6th request is rate limited
6. Act: Call post creation endpoint 11 times from same user
7. Assert: Verify 11th request is rate limited

**Expected Output**:
- Rate limiting works per IP for auth endpoints
- Rate limiting works per user for user-specific endpoints

---

### TC-LIMIT-015: Concurrent Operations - News Feed (1000 requests)
**Description**: Test concurrent News Feed requests at maximum load.

**Test Steps**:
1. Arrange: Mock 1000 concurrent authenticated users
2. Arrange: Mock News Feed data
3. Act: Simulate 1000 concurrent News Feed requests
4. Assert: Verify all requests complete successfully
5. Assert: Verify response times remain within 2 seconds
6. Assert: Verify database connection pool handles load

**Expected Output**:
- All 1000 requests: 200 OK
- Response times: < 2 seconds
- No connection pool exhaustion

---

### TC-LIMIT-016: Concurrent Operations - Post Creation (100 requests)
**Description**: Test concurrent post creation at maximum load.

**Test Steps**:
1. Arrange: Mock 100 concurrent authenticated users
2. Arrange: Mock membership verification
3. Act: Simulate 100 concurrent post creation requests
4. Assert: Verify all requests complete successfully
5. Assert: Verify response times remain within 500ms
6. Assert: Verify database handles concurrent inserts

**Expected Output**:
- All 100 requests: 201 Created
- Response times: < 500ms
- All posts created successfully

---

### TC-LIMIT-017: Concurrent Operations - Search (200 requests)
**Description**: Test concurrent search requests at maximum load.

**Test Steps**:
1. Arrange: Mock 200 concurrent authenticated users
2. Arrange: Mock search data
3. Act: Simulate 200 concurrent search requests
4. Assert: Verify all requests complete successfully
5. Assert: Verify response times remain within 1 second
6. Assert: Verify database handles concurrent queries

**Expected Output**:
- All 200 requests: 200 OK
- Response times: < 1 second
- All searches complete successfully

---

### TC-LIMIT-018: Concurrent Operations - Ring Creation (50 requests)
**Description**: Test concurrent ring creation at maximum load.

**Test Steps**:
1. Arrange: Mock 50 concurrent authenticated users
2. Arrange: Mock unique ring names
3. Act: Simulate 50 concurrent ring creation requests
4. Assert: Verify all requests complete successfully
5. Assert: Verify response times remain within 500ms
6. Assert: Verify unique constraint is maintained

**Expected Output**:
- All 50 requests: 201 Created
- Response times: < 500ms
- All rings created with unique names

---

### TC-LIMIT-019: Concurrent Operations - Authentication (100 requests)
**Description**: Test concurrent authentication requests at maximum load.

**Test Steps**:
1. Arrange: Mock 100 concurrent login/registration requests
2. Arrange: Mock user data and password verification
3. Act: Simulate 100 concurrent authentication requests
4. Assert: Verify all requests complete successfully
5. Assert: Verify response times remain within 500ms
6. Assert: Verify rate limiting is enforced

**Expected Output**:
- All 100 requests: 200 OK or 201 Created
- Response times: < 500ms
- Rate limiting enforced per IP

---

### TC-LIMIT-020: Text Length - Empty String Handling
**Description**: Test handling of empty strings at minimum boundaries.

**Test Steps**:
1. Arrange: Mock authentication
2. Act: Test empty string for each text field:
   - Username: '' (should fail, minimum 3 chars)
   - Ring name: '' (should fail, minimum 1 char)
   - Message: '' (should fail, minimum 1 char)
3. Assert: Verify empty strings are rejected
4. Assert: Verify appropriate error messages

**Expected Output**:
- Empty username: 400 Bad Request
- Empty ring name: 400 Bad Request
- Empty message: 400 Bad Request

---

### TC-LIMIT-021: File Size - Minimum File Size
**Description**: Test handling of very small image files.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock image file with size 1 byte
3. Act: Call post creation endpoint with tiny image
4. Assert: Verify file validation (may accept or reject based on specification)
5. Assert: Verify behavior is consistent

**Expected Output**:
- Very small files handled appropriately
- Validation consistent with specification

---

### TC-LIMIT-022: Database Connection Pool - Connection Reuse
**Description**: Test that database connections are properly reused.

**Test Steps**:
1. Arrange: Mock database connection pool
2. Arrange: Mock connection lifecycle
3. Act: Execute multiple sequential requests
4. Assert: Verify connections are reused
5. Assert: Verify connections are returned to pool
6. Assert: Verify idle connections are closed after timeout

**Expected Output**:
- Connections reused efficiently
- Connections returned to pool after use
- Idle connections closed after timeout

---

### TC-LIMIT-023: Rate Limiting - Header Information
**Description**: Test that rate limit headers are included in responses.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Act: Call endpoint multiple times
3. Assert: Verify X-RateLimit-Limit header is included
4. Assert: Verify X-RateLimit-Remaining header is included
5. Assert: Verify X-RateLimit-Reset header is included
6. Assert: Verify header values are correct

**Expected Output**:
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- Header values reflect current rate limit state

---

### TC-LIMIT-024: Concurrent Users - Database Query Performance
**Description**: Test database query performance under maximum concurrent load.

**Test Steps**:
1. Arrange: Mock 1000 concurrent users
2. Arrange: Mock complex queries (News Feed aggregation)
3. Act: Execute queries under load
4. Assert: Verify queries complete within 1.5 seconds
5. Assert: Verify simple queries complete within 50ms
6. Assert: Verify indexes are used effectively

**Expected Output**:
- Complex queries: < 1.5 seconds
- Simple queries: < 50ms
- Indexes used for optimization

---

### TC-LIMIT-025: System Stability - Extended Load
**Description**: Test system stability under extended load conditions.

**Test Steps**:
1. Arrange: Mock sustained load (1000 concurrent users for extended period)
2. Act: Execute operations continuously
3. Assert: Verify system remains stable
4. Assert: Verify no memory leaks
5. Assert: Verify connection pool remains healthy
6. Assert: Verify response times remain consistent

**Expected Output**:
- System remains stable under extended load
- No memory leaks
- Connection pool remains healthy
- Response times consistent
