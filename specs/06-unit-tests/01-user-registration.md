# User Registration Test Specification

## Test File: `user-registration.test.ts`

### Purpose
Tests for User Registration use case (3.1) covering successful registration, validation failures, duplicate usernames, and boundary conditions.

### Test Setup

**Before All Tests**:
```typescript
beforeAll(async () => {
  // Initialize test database connection
  // Set up test database schema
  // Clear existing test users
});
```

**Before Each Test**:
```typescript
beforeEach(async () => {
  // Clear users table
  // Reset mocks
});
```

**After Each Test**:
```typescript
afterEach(async () => {
  // Clean up test users
  // Reset database state
});
```

**After All Tests**:
```typescript
afterAll(async () => {
  // Close database connection
  // Clean up test resources
});
```

### Test Data

**Valid Test Users**:
```typescript
const validUser1 = {
  username: 'testuser1',
  password: 'password123'
};

const validUser2 = {
  username: 'user_name',
  password: 'Pass1234'
};

const validUser3 = {
  username: 'a'.repeat(3), // Minimum length
  password: 'pass1234'
};

const validUser4 = {
  username: 'a'.repeat(50), // Maximum length
  password: 'password123'
};
```

**Invalid Test Users**:
```typescript
const invalidUsers = {
  usernameTooShort: { username: 'ab', password: 'password123' }, // 2 chars
  usernameTooLong: { username: 'a'.repeat(51), password: 'password123' }, // 51 chars
  usernameInvalidChars: { username: 'user@name', password: 'password123' }, // Invalid character
  passwordTooShort: { username: 'testuser', password: 'pass123' }, // 7 chars
  passwordNoLetter: { username: 'testuser', password: '12345678' }, // No letter
  passwordNoNumber: { username: 'testuser', password: 'password' }, // No number
  emptyUsername: { username: '', password: 'password123' },
  emptyPassword: { username: 'testuser', password: '' },
  missingUsername: { password: 'password123' },
  missingPassword: { username: 'testuser' }
};
```

### Test Cases

#### Test 1: Successful User Registration - Happy Path
**Test Name**: `should successfully register user with valid username and password`

**Description**: Verifies that a user can be registered with valid credentials and receives authentication token.

**Test Steps**:
1. Send POST request to `/api/auth/register` with valid username and password
2. Verify response status code is 201 Created
3. Verify user is created in database with hashed password
4. Verify authentication token is returned
5. Verify password is hashed (not plain text)

**Expected Results**:
- HTTP status code: 201 Created
- Response body contains user data (username, id)
- Response body contains authentication token
- User record exists in database
- Password is hashed using bcrypt (10+ salt rounds)
- `created_at` timestamp is set
- `last_login_at` is null initially

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.user).toBeDefined();
expect(response.body.user.username).toBe(validUser1.username);
expect(response.body.user.id).toBeDefined();
expect(response.body.token).toBeDefined();
expect(response.body.user.password).toBeUndefined(); // Password never returned
// Verify password hash in database
const dbUser = await getUserFromDB(response.body.user.id);
expect(dbUser.password_hash).toBeDefined();
expect(dbUser.password_hash).not.toBe(validUser1.password);
expect(await bcrypt.compare(validUser1.password, dbUser.password_hash)).toBe(true);
```

#### Test 2: Username Validation - Minimum Length
**Test Name**: `should register user with minimum length username (3 characters)`

**Description**: Verifies that username with exactly 3 characters is accepted.

**Test Steps**:
1. Send POST request with username of exactly 3 characters
2. Verify registration succeeds

**Expected Results**:
- HTTP status code: 201 Created
- User is created successfully

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.user.username).toBe('a'.repeat(3));
```

#### Test 3: Username Validation - Maximum Length
**Test Name**: `should register user with maximum length username (50 characters)`

**Description**: Verifies that username with exactly 50 characters is accepted.

**Test Steps**:
1. Send POST request with username of exactly 50 characters
2. Verify registration succeeds

**Expected Results**:
- HTTP status code: 201 Created
- User is created successfully

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.user.username.length).toBe(50);
```

#### Test 4: Username Validation - Too Short
**Test Name**: `should reject registration with username shorter than 3 characters`

**Description**: Verifies that username with less than 3 characters is rejected.

**Test Steps**:
1. Send POST request with username of 2 characters
2. Verify registration fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('3-50 characters');
```

#### Test 5: Username Validation - Too Long
**Test Name**: `should reject registration with username longer than 50 characters`

**Description**: Verifies that username with more than 50 characters is rejected.

**Test Steps**:
1. Send POST request with username of 51 characters
2. Verify registration fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('3-50 characters');
```

#### Test 6: Username Validation - Invalid Characters
**Test Name**: `should reject registration with username containing invalid characters`

**Description**: Verifies that username with special characters (other than alphanumeric and underscore) is rejected.

**Test Steps**:
1. Send POST request with username containing '@', '#', '!', etc.
2. Verify registration fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('letters, numbers, and underscores');
```

#### Test 7: Username Validation - Valid Characters (Underscore)
**Test Name**: `should register user with username containing underscore`

**Description**: Verifies that username with underscore is accepted.

**Test Steps**:
1. Send POST request with username containing underscore
2. Verify registration succeeds

**Expected Results**:
- HTTP status code: 201 Created
- User is created successfully

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.user.username).toBe('user_name');
```

#### Test 8: Password Validation - Minimum Length
**Test Name**: `should register user with minimum length password (8 characters)`

**Description**: Verifies that password with exactly 8 characters containing letter and number is accepted.

**Test Steps**:
1. Send POST request with password of exactly 8 characters with letter and number
2. Verify registration succeeds

**Expected Results**:
- HTTP status code: 201 Created
- User is created successfully

**Assertions**:
```typescript
expect(response.status).toBe(201);
```

#### Test 9: Password Validation - Too Short
**Test Name**: `should reject registration with password shorter than 8 characters`

**Description**: Verifies that password with less than 8 characters is rejected.

**Test Steps**:
1. Send POST request with password of 7 characters
2. Verify registration fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Password must be at least 8 characters and contain at least one letter and one number"

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('at least 8 characters');
```

#### Test 10: Password Validation - No Letter
**Test Name**: `should reject registration with password containing no letters`

**Description**: Verifies that password with only numbers is rejected.

**Test Steps**:
1. Send POST request with password containing only numbers
2. Verify registration fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Password must be at least 8 characters and contain at least one letter and one number"

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('one letter and one number');
```

#### Test 11: Password Validation - No Number
**Test Name**: `should reject registration with password containing no numbers`

**Description**: Verifies that password with only letters is rejected.

**Test Steps**:
1. Send POST request with password containing only letters
2. Verify registration fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Password must be at least 8 characters and contain at least one letter and one number"

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('one letter and one number');
```

#### Test 12: Password Hashing - Bcrypt
**Test Name**: `should hash password using bcrypt with 10+ salt rounds`

**Description**: Verifies that password is hashed using bcrypt with appropriate salt rounds.

**Test Steps**:
1. Register user with valid credentials
2. Retrieve user from database
3. Verify password hash is bcrypt hash
4. Verify password can be verified using bcrypt.compare

**Expected Results**:
- Password hash is stored in database
- Password hash starts with bcrypt identifier ($2a$, $2b$, or $2y$)
- Bcrypt.compare returns true for correct password
- Bcrypt.compare returns false for incorrect password

**Assertions**:
```typescript
const dbUser = await getUserFromDB(userId);
expect(dbUser.password_hash).toMatch(/^\$2[aby]\$/); // Bcrypt hash format
expect(await bcrypt.compare(validPassword, dbUser.password_hash)).toBe(true);
expect(await bcrypt.compare('wrongpassword', dbUser.password_hash)).toBe(false);
```

#### Test 13: Duplicate Username
**Test Name**: `should reject registration with duplicate username`

**Description**: Verifies that registration with an existing username is rejected.

**Test Steps**:
1. Register first user with username 'testuser'
2. Attempt to register second user with same username 'testuser'
3. Verify second registration fails

**Expected Results**:
- First registration: HTTP status code 201 Created
- Second registration: HTTP status code 400 Bad Request
- Error message: "Username already exists"

**Assertions**:
```typescript
// First registration
expect(firstResponse.status).toBe(201);

// Second registration
expect(secondResponse.status).toBe(400);
expect(secondResponse.body.error).toBe('Username already exists');
```

#### Test 14: Empty Username
**Test Name**: `should reject registration with empty username`

**Description**: Verifies that registration with empty username is rejected.

**Test Steps**:
1. Send POST request with empty username
2. Verify registration fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates username validation failure

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 15: Empty Password
**Test Name**: `should reject registration with empty password`

**Description**: Verifies that registration with empty password is rejected.

**Test Steps**:
1. Send POST request with empty password
2. Verify registration fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates password validation failure

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 16: Missing Username Field
**Test Name**: `should reject registration with missing username field`

**Description**: Verifies that registration without username field is rejected.

**Test Steps**:
1. Send POST request without username field
2. Verify registration fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates missing required field

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 17: Missing Password Field
**Test Name**: `should reject registration with missing password field`

**Description**: Verifies that registration without password field is rejected.

**Test Steps**:
1. Send POST request without password field
2. Verify registration fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates missing required field

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 18: Authentication Token Generation
**Test Name**: `should return authentication token upon successful registration`

**Description**: Verifies that authentication token is generated and returned after successful registration.

**Test Steps**:
1. Register user with valid credentials
2. Verify authentication token is returned in response
3. Verify token is valid format (if applicable)

**Expected Results**:
- Response contains token field
- Token is not empty
- Token can be used for subsequent authenticated requests

**Assertions**:
```typescript
expect(response.body.token).toBeDefined();
expect(response.body.token).not.toBe('');
expect(typeof response.body.token).toBe('string');
```

#### Test 19: User Auto-Login After Registration
**Test Name**: `should automatically log in user after successful registration`

**Description**: Verifies that user is automatically authenticated after registration (can access protected endpoints).

**Test Steps**:
1. Register user with valid credentials
2. Use returned authentication token to access protected endpoint
3. Verify access is granted

**Expected Results**:
- User can access protected endpoints immediately after registration
- Authentication token is valid

**Assertions**:
```typescript
const protectedResponse = await fetch('/api/user/settings', {
  headers: { 'Authorization': `Bearer ${response.body.token}` }
});
expect(protectedResponse.status).toBe(200);
```

#### Test 20: Database Transaction - Registration Failure
**Test Name**: `should rollback transaction if user creation fails`

**Description**: Verifies that database transaction is rolled back if user creation fails (e.g., constraint violation).

**Test Steps**:
1. Attempt to create user with duplicate username (simulate race condition)
2. Verify no partial user data is created
3. Verify database state is consistent

**Expected Results**:
- No user record is created if registration fails
- Database state remains consistent

**Assertions**:
```typescript
// Verify user does not exist in database
const userCount = await getUserCountByUsername(username);
expect(userCount).toBe(0);
```

### Error Handling Tests

#### Test 21: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt registration
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: User-friendly message (not technical details)

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBeDefined();
expect(response.body.error).not.toContain('ECONNREFUSED'); // No technical details
```

#### Test 22: SQL Injection Prevention
**Test Name**: `should prevent SQL injection in username field`

**Description**: Verifies that SQL injection attempts are prevented through parameterized queries.

**Test Steps**:
1. Attempt registration with SQL injection payload in username
2. Verify registration fails with validation error (not SQL error)
3. Verify no SQL is executed

**Expected Results**:
- Registration fails with validation error
- No SQL injection occurs
- Database remains secure

**Assertions**:
```typescript
const sqlInjectionUsername = "'; DROP TABLE users; --";
const response = await registerUser({ username: sqlInjectionUsername, password: 'password123' });
expect(response.status).toBe(400); // Validation error, not SQL error
// Verify users table still exists
const tableExists = await checkTableExists('users');
expect(tableExists).toBe(true);
```

### Notes
- All password hashing must use bcrypt with minimum 10 salt rounds
- Username validation must be case-sensitive for uniqueness (but case-insensitive for matching may be acceptable)
- Authentication token format depends on implementation (JWT, session cookie, etc.)
- Database operations must use transactions to ensure atomicity
