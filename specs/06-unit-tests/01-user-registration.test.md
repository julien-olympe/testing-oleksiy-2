# Unit Test Specification: User Registration (Use Case 3.1)

## Overview
This document specifies unit tests for the User Registration use case, covering all business logic, validation, edge cases, and error conditions.

## Function/API Being Tested
- **API Endpoint**: `POST /api/auth/register`
- **Business Logic Functions**:
  - `validateUsername(username: string): ValidationResult`
  - `validatePassword(password: string): ValidationResult`
  - `hashPassword(password: string): Promise<string>`
  - `checkUsernameExists(username: string): Promise<boolean>`
  - `createUser(username: string, passwordHash: string): Promise<User>`
  - `generateAuthToken(userId: string): Promise<string>`
  - `registerUser(username: string, password: string): Promise<RegistrationResult>`

## Test Setup and Mock Data

### Mock Requirements
- Mock PostgreSQL connection pool (`pg.Pool`)
- Mock bcrypt password hashing functions
- Mock authentication token generation
- Mock database queries for username existence check
- Mock database insert for user creation

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

### TC-REG-001: Successful User Registration (Happy Path)
**Description**: Test successful user registration with valid username and password.

**Test Steps**:
1. Arrange: Mock database to return no existing user for username check
2. Arrange: Mock bcrypt.hash to return hashed password
3. Arrange: Mock database insert to return new user
4. Arrange: Mock token generation to return auth token
5. Act: Call `registerUser('newuser', 'password123')`
6. Assert: Verify username validation was called
7. Assert: Verify password validation was called
8. Assert: Verify username existence check was called with correct username
9. Assert: Verify password was hashed with bcrypt (10 salt rounds)
10. Assert: Verify user was created in database with correct data
11. Assert: Verify auth token was generated
12. Assert: Verify function returns success with user data and token

**Expected Output**:
- Status: 201 Created
- Response: `{ user: { id, username }, token: 'auth_token' }`
- Database: New user record created with hashed password

**Mock Verification**:
- `checkUsernameExists` called once with 'newuser'
- `hashPassword` called once with 'password123'
- `createUser` called once with username and hashed password
- `generateAuthToken` called once with user id

---

### TC-REG-002: Registration Fails - Username Already Exists
**Description**: Test registration failure when username is already taken.

**Test Steps**:
1. Arrange: Mock database to return existing user for username check
2. Act: Call `registerUser('existinguser', 'password123')`
3. Assert: Verify username existence check was called
4. Assert: Verify password hashing was NOT called
5. Assert: Verify user creation was NOT called
6. Assert: Verify function throws error or returns error response

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username already exists"

**Mock Verification**:
- `checkUsernameExists` called once, returns true
- `hashPassword` not called
- `createUser` not called

---

### TC-REG-003: Registration Fails - Username Too Short (2 characters)
**Description**: Test registration failure when username is below minimum length.

**Test Steps**:
1. Arrange: Set up test with username 'ab' (2 characters)
2. Act: Call `registerUser('ab', 'password123')`
3. Assert: Verify username validation fails
4. Assert: Verify username existence check was NOT called
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

**Mock Verification**:
- `validateUsername` called once, returns validation error
- `checkUsernameExists` not called

---

### TC-REG-004: Registration Fails - Username Too Long (51 characters)
**Description**: Test registration failure when username exceeds maximum length.

**Test Steps**:
1. Arrange: Set up test with username of 51 characters
2. Act: Call `registerUser('a'.repeat(51), 'password123')`
3. Assert: Verify username validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

---

### TC-REG-005: Registration Fails - Username at Minimum Length (3 characters)
**Description**: Test successful registration with username at minimum valid length.

**Test Steps**:
1. Arrange: Mock database to return no existing user
2. Arrange: Mock password hashing and user creation
3. Act: Call `registerUser('abc', 'password123')`
4. Assert: Verify registration succeeds
5. Assert: Verify username validation passes for 3-character username

**Expected Output**:
- Status: 201 Created
- Response: User created successfully

---

### TC-REG-006: Registration Succeeds - Username at Maximum Length (50 characters)
**Description**: Test successful registration with username at maximum valid length.

**Test Steps**:
1. Arrange: Mock database to return no existing user
2. Arrange: Mock password hashing and user creation
3. Act: Call `registerUser('a'.repeat(50), 'password123')`
4. Assert: Verify registration succeeds
5. Assert: Verify username validation passes for 50-character username

**Expected Output**:
- Status: 201 Created
- Response: User created successfully

---

### TC-REG-007: Registration Fails - Username Contains Invalid Characters
**Description**: Test registration failure when username contains invalid characters.

**Test Steps**:
1. Arrange: Set up test with username containing special characters
2. Act: Call `registerUser('user@name', 'password123')` (contains @)
3. Assert: Verify username validation fails
4. Act: Call `registerUser('user-name', 'password123')` (contains -)
5. Assert: Verify username validation fails
6. Act: Call `registerUser('user name', 'password123')` (contains space)
7. Assert: Verify username validation fails

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

**Test Cases**:
- Username with @ symbol
- Username with hyphen
- Username with space
- Username with special characters (!, #, $, etc.)

---

### TC-REG-008: Registration Succeeds - Username with Underscores
**Description**: Test successful registration with username containing underscores (valid).

**Test Steps**:
1. Arrange: Mock database to return no existing user
2. Arrange: Mock password hashing and user creation
3. Act: Call `registerUser('user_name_123', 'password123')`
4. Assert: Verify registration succeeds
5. Assert: Verify username validation passes for username with underscores

**Expected Output**:
- Status: 201 Created
- Response: User created successfully

---

### TC-REG-009: Registration Fails - Password Too Short (7 characters)
**Description**: Test registration failure when password is below minimum length.

**Test Steps**:
1. Arrange: Set up test with password 'pass123' (7 characters, has letter and number)
2. Act: Call `registerUser('newuser', 'pass123')`
3. Assert: Verify password validation fails
4. Assert: Verify username existence check was NOT called
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password must be at least 8 characters and contain at least one letter and one number"

---

### TC-REG-010: Registration Fails - Password at Minimum Length but No Letter
**Description**: Test registration failure when password has 8 characters but no letter.

**Test Steps**:
1. Arrange: Set up test with password '12345678' (8 characters, numbers only)
2. Act: Call `registerUser('newuser', '12345678')`
3. Assert: Verify password validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password must be at least 8 characters and contain at least one letter and one number"

---

### TC-REG-011: Registration Fails - Password at Minimum Length but No Number
**Description**: Test registration failure when password has 8 characters but no number.

**Test Steps**:
1. Arrange: Set up test with password 'password' (8 characters, letters only)
2. Act: Call `registerUser('newuser', 'password')`
3. Assert: Verify password validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password must be at least 8 characters and contain at least one letter and one number"

---

### TC-REG-012: Registration Succeeds - Password at Minimum Length with Letter and Number
**Description**: Test successful registration with password at minimum valid length.

**Test Steps**:
1. Arrange: Mock database to return no existing user
2. Arrange: Mock password hashing and user creation
3. Act: Call `registerUser('newuser', 'pass1234')` (8 chars, has letter and number)
4. Assert: Verify registration succeeds
5. Assert: Verify password validation passes

**Expected Output**:
- Status: 201 Created
- Response: User created successfully

---

### TC-REG-013: Registration Succeeds - Password with Mixed Case and Numbers
**Description**: Test successful registration with complex password.

**Test Steps**:
1. Arrange: Mock database to return no existing user
2. Arrange: Mock password hashing and user creation
3. Act: Call `registerUser('newuser', 'PassWord123')`
4. Assert: Verify registration succeeds
5. Assert: Verify password validation passes for mixed case password

**Expected Output**:
- Status: 201 Created
- Response: User created successfully

---

### TC-REG-014: Registration Fails - Empty Username
**Description**: Test registration failure when username is empty.

**Test Steps**:
1. Arrange: Set up test with empty username
2. Act: Call `registerUser('', 'password123')`
3. Assert: Verify username validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

---

### TC-REG-015: Registration Fails - Empty Password
**Description**: Test registration failure when password is empty.

**Test Steps**:
1. Arrange: Set up test with empty password
2. Act: Call `registerUser('newuser', '')`
3. Assert: Verify password validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password must be at least 8 characters and contain at least one letter and one number"

---

### TC-REG-016: Registration Fails - Null Username
**Description**: Test registration failure when username is null.

**Test Steps**:
1. Arrange: Set up test with null username
2. Act: Call `registerUser(null, 'password123')`
3. Assert: Verify username validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username is required"

---

### TC-REG-017: Registration Fails - Null Password
**Description**: Test registration failure when password is null.

**Test Steps**:
1. Arrange: Set up test with null password
2. Act: Call `registerUser('newuser', null)`
3. Assert: Verify password validation fails
4. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Password is required"

---

### TC-REG-018: Registration Fails - Database Connection Error
**Description**: Test registration failure when database connection fails.

**Test Steps**:
1. Arrange: Mock database connection to throw error
2. Act: Call `registerUser('newuser', 'password123')`
3. Assert: Verify error is caught and handled
4. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to register user. Please try again." (user-friendly message)

**Mock Verification**:
- Database error is logged (not exposed to client)
- User-friendly error message returned

---

### TC-REG-019: Registration Fails - Database Query Error During Username Check
**Description**: Test registration failure when database query fails during username existence check.

**Test Steps**:
1. Arrange: Mock database query to throw error
2. Act: Call `registerUser('newuser', 'password123')`
3. Assert: Verify error is caught and handled
4. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to register user. Please try again."

---

### TC-REG-020: Registration Fails - Database Insert Error
**Description**: Test registration failure when database insert fails.

**Test Steps**:
1. Arrange: Mock username check to return false (username available)
2. Arrange: Mock password hashing to succeed
3. Arrange: Mock database insert to throw error
4. Act: Call `registerUser('newuser', 'password123')`
5. Assert: Verify error is caught and handled
6. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to register user. Please try again."

---

### TC-REG-021: Registration Fails - Password Hashing Error
**Description**: Test registration failure when password hashing fails.

**Test Steps**:
1. Arrange: Mock username check to return false
2. Arrange: Mock bcrypt.hash to throw error
3. Act: Call `registerUser('newuser', 'password123')`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to register user. Please try again."

---

### TC-REG-022: Registration - Password Hash Uses Bcrypt with Correct Salt Rounds
**Description**: Test that password hashing uses bcrypt with 10 salt rounds.

**Test Steps**:
1. Arrange: Mock username check to return false
2. Arrange: Mock bcrypt.hash to verify salt rounds parameter
3. Act: Call `registerUser('newuser', 'password123')`
4. Assert: Verify bcrypt.hash was called with password and salt rounds = 10
5. Assert: Verify hashed password is stored (not plain text)

**Mock Verification**:
- `bcrypt.hash` called with password and 10 salt rounds
- Plain password never stored in database

---

### TC-REG-023: Registration - Auth Token Generated After User Creation
**Description**: Test that authentication token is generated after successful user creation.

**Test Steps**:
1. Arrange: Mock all dependencies for successful registration
2. Act: Call `registerUser('newuser', 'password123')`
3. Assert: Verify user creation completes before token generation
4. Assert: Verify token generation is called with correct user id
5. Assert: Verify token is included in response

**Mock Verification**:
- `createUser` completes successfully
- `generateAuthToken` called with user id
- Token returned in response

---

### TC-REG-024: Registration - User Automatically Logged In
**Description**: Test that user is automatically logged in after registration.

**Test Steps**:
1. Arrange: Mock all dependencies for successful registration
2. Act: Call `registerUser('newuser', 'password123')`
3. Assert: Verify auth token is generated
4. Assert: Verify token is returned in response
5. Assert: Verify session is established

**Expected Output**:
- Response includes authentication token
- User can immediately access protected endpoints

---

### TC-REG-025: Registration - Database Transaction Rollback on Error
**Description**: Test that database transaction is rolled back if any step fails.

**Test Steps**:
1. Arrange: Mock transaction begin
2. Arrange: Mock username check to succeed
3. Arrange: Mock password hashing to succeed
4. Arrange: Mock user creation to fail
5. Act: Call `registerUser('newuser', 'password123')`
6. Assert: Verify transaction rollback is called
7. Assert: Verify no partial data is saved

**Mock Verification**:
- Transaction begin called
- Transaction rollback called on error
- No user record created

---

### TC-REG-026: Registration - SQL Injection Prevention
**Description**: Test that SQL injection attempts are safely handled.

**Test Steps**:
1. Arrange: Mock database with parameterized query verification
2. Act: Call `registerUser("'; DROP TABLE users; --", 'password123')`
3. Assert: Verify parameterized queries are used (not string concatenation)
4. Assert: Verify SQL injection attempt is treated as invalid username
5. Assert: Verify database is not compromised

**Mock Verification**:
- Database queries use parameterized statements
- No raw SQL string concatenation
- Invalid username rejected by validation

---

### TC-REG-027: Registration - Concurrent Registration Attempts
**Description**: Test handling of concurrent registration attempts with same username.

**Test Steps**:
1. Arrange: Mock database to simulate race condition
2. Arrange: First registration check returns false (username available)
3. Arrange: Second registration check returns false (username available)
4. Arrange: First insert succeeds
5. Arrange: Second insert fails with unique constraint violation
6. Act: Simulate two concurrent registration calls with same username
7. Assert: Verify first registration succeeds
8. Assert: Verify second registration fails with "Username already exists"

**Expected Output**:
- First registration: 201 Created
- Second registration: 400 Bad Request - "Username already exists"

**Mock Verification**:
- Database unique constraint prevents duplicate usernames
- Error handling converts constraint violation to user-friendly message

---

### TC-REG-028: Registration - Rate Limiting
**Description**: Test that registration endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 5 requests per minute
3. Act: Call registration endpoint 6 times rapidly
4. Assert: Verify first 5 requests succeed
5. Assert: Verify 6th request returns 429 Too Many Requests

**Expected Output**:
- First 5 requests: 201 Created
- 6th request: 429 Too Many Requests with Retry-After header

**Mock Verification**:
- Rate limiter tracks requests per IP
- Rate limit headers included in response
