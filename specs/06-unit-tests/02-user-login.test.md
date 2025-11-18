# Unit Test Specification: User Login (Use Case 3.2)

## Overview
This document specifies unit tests for the User Login use case, covering authentication, password verification, session management, and error conditions.

## Function/API Being Tested
- **API Endpoint**: `POST /api/auth/login`
- **Business Logic Functions**:
  - `findUserByUsername(username: string): Promise<User | null>`
  - `verifyPassword(password: string, hash: string): Promise<boolean>`
  - `updateLastLogin(userId: string): Promise<void>`
  - `generateAuthToken(userId: string): Promise<string>`
  - `loginUser(username: string, password: string): Promise<LoginResult>`

## Test Setup and Mock Data

### Mock Requirements
- Mock PostgreSQL connection pool
- Mock bcrypt password comparison
- Mock user lookup from database
- Mock last login timestamp update
- Mock authentication token generation

### Test Data Factories
```typescript
const createTestUser = (overrides = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'testuser',
  password_hash: '$2b$10$hashedpassword',
  created_at: new Date('2024-01-01T00:00:00Z'),
  last_login_at: null,
  ...overrides
});
```

## Test Cases

### TC-LOGIN-001: Successful User Login (Happy Path)
**Description**: Test successful login with correct username and password.

**Test Steps**:
1. Arrange: Mock user lookup to return test user
2. Arrange: Mock bcrypt.compare to return true (password matches)
3. Arrange: Mock last login update to succeed
4. Arrange: Mock token generation to return auth token
5. Act: Call `loginUser('testuser', 'password123')`
6. Assert: Verify user lookup was called with correct username
7. Assert: Verify password comparison was called with password and hash
8. Assert: Verify last login timestamp was updated
9. Assert: Verify auth token was generated
10. Assert: Verify function returns success with user data and token

**Expected Output**:
- Status: 200 OK
- Response: `{ user: { id, username }, token: 'auth_token' }`
- Database: last_login_at updated to current timestamp

**Mock Verification**:
- `findUserByUsername` called once with 'testuser'
- `verifyPassword` called once with password and hash
- `updateLastLogin` called once with user id
- `generateAuthToken` called once with user id

---

### TC-LOGIN-002: Login Fails - Username Not Found
**Description**: Test login failure when username does not exist.

**Test Steps**:
1. Arrange: Mock user lookup to return null (user not found)
2. Act: Call `loginUser('nonexistent', 'password123')`
3. Assert: Verify user lookup was called
4. Assert: Verify password comparison was NOT called
5. Assert: Verify function returns authentication error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Invalid username or password" (generic message for security)

**Mock Verification**:
- `findUserByUsername` called once
- `verifyPassword` not called
- `updateLastLogin` not called
- `generateAuthToken` not called

---

### TC-LOGIN-003: Login Fails - Incorrect Password
**Description**: Test login failure when password is incorrect.

**Test Steps**:
1. Arrange: Mock user lookup to return test user
2. Arrange: Mock bcrypt.compare to return false (password doesn't match)
3. Act: Call `loginUser('testuser', 'wrongpassword')`
4. Assert: Verify user lookup was called
5. Assert: Verify password comparison was called
6. Assert: Verify function returns authentication error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Invalid username or password" (generic message for security)

**Mock Verification**:
- `findUserByUsername` called once
- `verifyPassword` called once, returns false
- `updateLastLogin` not called
- `generateAuthToken` not called

---

### TC-LOGIN-004: Login Fails - Empty Username
**Description**: Test login failure when username is empty.

**Test Steps**:
1. Arrange: Set up test with empty username
2. Act: Call `loginUser('', 'password123')`
3. Assert: Verify input validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username is required"

---

### TC-LOGIN-005: Login Fails - Empty Password
**Description**: Test login failure when password is empty.

**Test Steps**:
1. Arrange: Set up test with empty password
2. Act: Call `loginUser('testuser', '')`
3. Assert: Verify input validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password is required"

---

### TC-LOGIN-006: Login Fails - Null Username
**Description**: Test login failure when username is null.

**Test Steps**:
1. Arrange: Set up test with null username
2. Act: Call `loginUser(null, 'password123')`
3. Assert: Verify input validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username is required"

---

### TC-LOGIN-007: Login Fails - Null Password
**Description**: Test login failure when password is null.

**Test Steps**:
1. Arrange: Set up test with null password
2. Act: Call `loginUser('testuser', null)`
3. Assert: Verify input validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password is required"

---

### TC-LOGIN-008: Login Fails - Database Connection Error
**Description**: Test login failure when database connection fails.

**Test Steps**:
1. Arrange: Mock database connection to throw error
2. Act: Call `loginUser('testuser', 'password123')`
3. Assert: Verify error is caught and handled
4. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to login. Please try again." (user-friendly message)

**Mock Verification**:
- Database error is logged (not exposed to client)

---

### TC-LOGIN-009: Login Fails - Database Query Error
**Description**: Test login failure when database query fails.

**Test Steps**:
1. Arrange: Mock user lookup to throw database error
2. Act: Call `loginUser('testuser', 'password123')`
3. Assert: Verify error is caught and handled
4. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to login. Please try again."

---

### TC-LOGIN-010: Login - Password Comparison Uses Bcrypt
**Description**: Test that password comparison uses bcrypt.compare correctly.

**Test Steps**:
1. Arrange: Mock user lookup to return test user with password hash
2. Arrange: Mock bcrypt.compare to verify parameters
3. Act: Call `loginUser('testuser', 'password123')`
4. Assert: Verify bcrypt.compare was called with plain password and stored hash
5. Assert: Verify comparison result is used correctly

**Mock Verification**:
- `bcrypt.compare` called with plain password and password_hash
- Comparison result determines login success/failure

---

### TC-LOGIN-011: Login - Last Login Timestamp Updated
**Description**: Test that last login timestamp is updated on successful login.

**Test Steps**:
1. Arrange: Mock all dependencies for successful login
2. Arrange: Mock current timestamp
3. Act: Call `loginUser('testuser', 'password123')`
4. Assert: Verify updateLastLogin was called with user id
5. Assert: Verify last_login_at was updated to current timestamp

**Mock Verification**:
- `updateLastLogin` called once with user id
- Database update query executed with current timestamp

---

### TC-LOGIN-012: Login - Auth Token Generated
**Description**: Test that authentication token is generated on successful login.

**Test Steps**:
1. Arrange: Mock all dependencies for successful login
2. Act: Call `loginUser('testuser', 'password123')`
3. Assert: Verify generateAuthToken was called with user id
4. Assert: Verify token is included in response
5. Assert: Verify token can be used for subsequent requests

**Mock Verification**:
- `generateAuthToken` called once with user id
- Token returned in response

---

### TC-LOGIN-013: Login - Generic Error Message for Security
**Description**: Test that error message doesn't reveal whether username or password is wrong.

**Test Steps**:
1. Arrange: Mock user lookup to return null (username not found)
2. Act: Call `loginUser('nonexistent', 'password123')`
3. Assert: Verify error message is "Invalid username or password" (not "Username not found")
4. Arrange: Mock user lookup to return user, password comparison to fail
5. Act: Call `loginUser('testuser', 'wrongpassword')`
6. Assert: Verify error message is "Invalid username or password" (not "Incorrect password")

**Expected Output**:
- Both scenarios return same generic error message
- No information leakage about which field is incorrect

---

### TC-LOGIN-014: Login - SQL Injection Prevention
**Description**: Test that SQL injection attempts are safely handled.

**Test Steps**:
1. Arrange: Mock database with parameterized query verification
2. Act: Call `loginUser("'; DROP TABLE users; --", 'password123')`
3. Assert: Verify parameterized queries are used
4. Assert: Verify SQL injection attempt is treated as invalid username
5. Assert: Verify database is not compromised

**Mock Verification**:
- Database queries use parameterized statements
- No raw SQL string concatenation

---

### TC-LOGIN-015: Login - Rate Limiting
**Description**: Test that login endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 5 requests per minute per IP
3. Act: Call login endpoint 6 times rapidly with wrong credentials
4. Assert: Verify first 5 requests return 401
5. Assert: Verify 6th request returns 429 Too Many Requests

**Expected Output**:
- First 5 requests: 401 Unauthorized
- 6th request: 429 Too Many Requests with Retry-After header

**Mock Verification**:
- Rate limiter tracks requests per IP
- Rate limit headers included in response

---

### TC-LOGIN-016: Login - Session Cookie Set
**Description**: Test that session cookie is set on successful login.

**Test Steps**:
1. Arrange: Mock all dependencies for successful login
2. Arrange: Mock Fastify reply.setCookie
3. Act: Call login endpoint with valid credentials
4. Assert: Verify setCookie was called with session cookie
5. Assert: Verify cookie is HTTP-only and secure

**Mock Verification**:
- `reply.setCookie` called with session cookie
- Cookie options: httpOnly: true, secure: true (in production)

---

### TC-LOGIN-017: Login - Concurrent Login Attempts
**Description**: Test handling of concurrent login attempts.

**Test Steps**:
1. Arrange: Mock user lookup and password verification
2. Act: Simulate multiple concurrent login calls with same credentials
3. Assert: Verify all valid logins succeed
4. Assert: Verify each login generates new token
5. Assert: Verify last login timestamp is updated correctly

**Expected Output**:
- All concurrent valid logins: 200 OK
- Each login receives unique token
- Last login timestamp reflects most recent login

---

### TC-LOGIN-018: Login - User with Previous Last Login
**Description**: Test login for user who has logged in before.

**Test Steps**:
1. Arrange: Mock user with previous last_login_at timestamp
2. Arrange: Mock all dependencies for successful login
3. Act: Call `loginUser('testuser', 'password123')`
4. Assert: Verify login succeeds
5. Assert: Verify last_login_at is updated to new timestamp

**Expected Output**:
- Status: 200 OK
- last_login_at updated to current timestamp (replacing old value)

---

### TC-LOGIN-019: Login - Password Hash Verification Edge Cases
**Description**: Test password verification with various hash formats.

**Test Steps**:
1. Arrange: Mock user with different hash formats
2. Act: Test login with valid password
3. Assert: Verify bcrypt.compare handles all valid hash formats correctly
4. Assert: Verify invalid hash formats are rejected

**Test Cases**:
- Valid bcrypt hash: succeeds
- Invalid hash format: fails gracefully
- Corrupted hash: fails gracefully

---

### TC-LOGIN-020: Login - Case Sensitivity
**Description**: Test username case sensitivity handling.

**Test Steps**:
1. Arrange: Mock user with username 'TestUser'
2. Act: Call `loginUser('testuser', 'password123')` (lowercase)
3. Assert: Verify username lookup is case-sensitive or case-insensitive as specified
4. Act: Call `loginUser('TESTUSER', 'password123')` (uppercase)
5. Assert: Verify behavior matches specification

**Note**: Username lookup should be case-sensitive based on database collation. Test both scenarios.
