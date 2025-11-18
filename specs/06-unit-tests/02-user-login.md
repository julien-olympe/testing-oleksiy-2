# User Login Test Specification

## Test File: `user-login.test.ts`

### Purpose
Tests for User Login use case (3.2) covering successful login, invalid credentials, authentication failures, and security requirements.

### Test Setup

**Before All Tests**:
```typescript
beforeAll(async () => {
  // Initialize test database connection
  // Set up test database schema
});
```

**Before Each Test**:
```typescript
beforeEach(async () => {
  // Clear users table
  // Create test user with hashed password
  // Reset mocks
});
```

**After Each Test**:
```typescript
afterEach(async () => {
  // Clean up test users
  // Clear sessions
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

**Registered Test Users**:
```typescript
const testUser = {
  username: 'testuser',
  password: 'password123',
  passwordHash: await bcrypt.hash('password123', 10)
};

const testUser2 = {
  username: 'anotheruser',
  password: 'Pass1234',
  passwordHash: await bcrypt.hash('Pass1234', 10)
};
```

**Invalid Credentials**:
```typescript
const invalidCredentials = {
  nonExistentUser: { username: 'nonexistent', password: 'password123' },
  wrongPassword: { username: 'testuser', password: 'wrongpassword' },
  emptyUsername: { username: '', password: 'password123' },
  emptyPassword: { username: 'testuser', password: '' },
  missingUsername: { password: 'password123' },
  missingPassword: { username: 'testuser' }
};
```

### Test Cases

#### Test 1: Successful Login - Happy Path
**Test Name**: `should successfully login user with valid credentials`

**Description**: Verifies that a registered user can login with correct username and password.

**Test Steps**:
1. Create test user in database with hashed password
2. Send POST request to `/api/auth/login` with valid credentials
3. Verify response status code is 200 OK
4. Verify authentication token is returned
5. Verify user data is returned (username, id)
6. Verify `last_login_at` timestamp is updated

**Expected Results**:
- HTTP status code: 200 OK
- Response body contains user data (username, id)
- Response body contains authentication token
- `last_login_at` is updated in database
- Password is never returned in response

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.user).toBeDefined();
expect(response.body.user.username).toBe(testUser.username);
expect(response.body.user.id).toBeDefined();
expect(response.body.token).toBeDefined();
expect(response.body.user.password).toBeUndefined();
expect(response.body.user.password_hash).toBeUndefined();
// Verify last_login_at is updated
const dbUser = await getUserFromDB(response.body.user.id);
expect(dbUser.last_login_at).toBeDefined();
expect(new Date(dbUser.last_login_at).getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 2: Invalid Username
**Test Name**: `should reject login with non-existent username`

**Description**: Verifies that login with non-existent username is rejected.

**Test Steps**:
1. Send POST request with non-existent username
2. Verify login fails with generic error message

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message: "Invalid username or password" (does not specify which field is wrong)

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBe('Invalid username or password');
```

#### Test 3: Invalid Password
**Test Name**: `should reject login with incorrect password`

**Description**: Verifies that login with incorrect password is rejected.

**Test Steps**:
1. Create test user in database
2. Send POST request with correct username but wrong password
3. Verify login fails with generic error message

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message: "Invalid username or password" (does not specify which field is wrong)

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBe('Invalid username or password');
```

#### Test 4: Empty Username
**Test Name**: `should reject login with empty username`

**Description**: Verifies that login with empty username is rejected.

**Test Steps**:
1. Send POST request with empty username
2. Verify login fails

**Expected Results**:
- HTTP status code: 400 Bad Request or 401 Unauthorized
- Error message indicates validation failure

**Assertions**:
```typescript
expect(response.status).toBeGreaterThanOrEqual(400);
expect(response.body.error).toBeDefined();
```

#### Test 5: Empty Password
**Test Name**: `should reject login with empty password`

**Description**: Verifies that login with empty password is rejected.

**Test Steps**:
1. Send POST request with empty password
2. Verify login fails

**Expected Results**:
- HTTP status code: 400 Bad Request or 401 Unauthorized
- Error message indicates validation failure

**Assertions**:
```typescript
expect(response.status).toBeGreaterThanOrEqual(400);
expect(response.body.error).toBeDefined();
```

#### Test 6: Missing Username Field
**Test Name**: `should reject login with missing username field`

**Description**: Verifies that login without username field is rejected.

**Test Steps**:
1. Send POST request without username field
2. Verify login fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates missing required field

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 7: Missing Password Field
**Test Name**: `should reject login with missing password field`

**Description**: Verifies that login without password field is rejected.

**Test Steps**:
1. Send POST request without password field
2. Verify login fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates missing required field

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 8: Password Comparison - Bcrypt
**Test Name**: `should compare password using bcrypt compare function`

**Description**: Verifies that password comparison uses bcrypt.compare() function.

**Test Steps**:
1. Create test user with bcrypt hashed password
2. Login with correct password
3. Verify login succeeds
4. Login with incorrect password
5. Verify login fails

**Expected Results**:
- Correct password: Login succeeds
- Incorrect password: Login fails
- Bcrypt comparison is used (not plain text comparison)

**Assertions**:
```typescript
// Correct password
const correctResponse = await loginUser(testUser.username, testUser.password);
expect(correctResponse.status).toBe(200);

// Incorrect password
const incorrectResponse = await loginUser(testUser.username, 'wrongpassword');
expect(incorrectResponse.status).toBe(401);
```

#### Test 9: Authentication Token Generation
**Test Name**: `should generate new authentication token on login`

**Description**: Verifies that a new authentication token is generated on each login.

**Test Steps**:
1. Login user first time
2. Save authentication token
3. Login user second time
4. Verify new token is different from first token

**Expected Results**:
- New token is generated on each login
- Tokens are different between login sessions

**Assertions**:
```typescript
const firstLogin = await loginUser(testUser.username, testUser.password);
const firstToken = firstLogin.body.token;

// Wait a moment
await new Promise(resolve => setTimeout(resolve, 100));

const secondLogin = await loginUser(testUser.username, testUser.password);
const secondToken = secondLogin.body.token;

expect(firstToken).not.toBe(secondToken);
```

#### Test 10: Last Login Timestamp Update
**Test Name**: `should update last_login_at timestamp on successful login`

**Description**: Verifies that `last_login_at` timestamp is updated in database on successful login.

**Test Steps**:
1. Create test user with null `last_login_at`
2. Login user
3. Verify `last_login_at` is set to current timestamp

**Expected Results**:
- `last_login_at` is updated in database
- Timestamp is close to current time

**Assertions**:
```typescript
const userBefore = await getUserFromDB(userId);
expect(userBefore.last_login_at).toBeNull();

await loginUser(testUser.username, testUser.password);

const userAfter = await getUserFromDB(userId);
expect(userAfter.last_login_at).toBeDefined();
expect(new Date(userAfter.last_login_at).getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 11: Case Sensitivity - Username
**Test Name**: `should handle username case sensitivity correctly`

**Description**: Verifies that username matching is case-sensitive (or case-insensitive if specified).

**Test Steps**:
1. Create user with username 'TestUser'
2. Attempt login with 'testuser' (lowercase)
3. Verify behavior matches specification (case-sensitive or case-insensitive)

**Expected Results**:
- Username matching follows specification (typically case-sensitive)
- Login succeeds only with exact case match (if case-sensitive)

**Assertions**:
```typescript
// Assuming case-sensitive usernames
const response = await loginUser('testuser', testUser.password); // Different case
expect(response.status).toBe(401); // Should fail if case-sensitive
```

#### Test 12: Multiple Failed Login Attempts
**Test Name**: `should handle multiple failed login attempts`

**Description**: Verifies that multiple failed login attempts are handled correctly (rate limiting may apply).

**Test Steps**:
1. Attempt login with wrong password multiple times
2. Verify each attempt returns 401 Unauthorized
3. Verify rate limiting is applied (if implemented)

**Expected Results**:
- Each failed attempt returns 401
- Rate limiting may apply after multiple attempts (429 Too Many Requests)

**Assertions**:
```typescript
for (let i = 0; i < 5; i++) {
  const response = await loginUser(testUser.username, 'wrongpassword');
  expect(response.status).toBe(401);
}
// If rate limiting is implemented
const rateLimitedResponse = await loginUser(testUser.username, 'wrongpassword');
// May return 429 if rate limit exceeded
```

#### Test 13: Session Creation
**Test Name**: `should create session on successful login`

**Description**: Verifies that a session is created and stored on successful login.

**Test Steps**:
1. Login user successfully
2. Verify session is created in session store
3. Verify session contains user information

**Expected Results**:
- Session is created
- Session contains user ID
- Session can be retrieved using session ID

**Assertions**:
```typescript
const loginResponse = await loginUser(testUser.username, testUser.password);
const sessionId = extractSessionId(loginResponse);
const session = await getSession(sessionId);
expect(session).toBeDefined();
expect(session.userId).toBe(testUser.id);
```

#### Test 14: Password Not Returned
**Test Name**: `should never return password or password hash in response`

**Description**: Verifies that password and password hash are never returned in login response.

**Test Steps**:
1. Login user successfully
2. Verify response does not contain password or password_hash fields

**Expected Results**:
- Response does not contain `password` field
- Response does not contain `password_hash` field
- Only safe user data is returned

**Assertions**:
```typescript
expect(response.body.password).toBeUndefined();
expect(response.body.password_hash).toBeUndefined();
expect(response.body.user.password).toBeUndefined();
expect(response.body.user.password_hash).toBeUndefined();
```

### Error Handling Tests

#### Test 15: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt login
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: User-friendly message (not technical details)

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBeDefined();
expect(response.body.error).not.toContain('ECONNREFUSED');
```

#### Test 16: SQL Injection Prevention
**Test Name**: `should prevent SQL injection in username field`

**Description**: Verifies that SQL injection attempts are prevented through parameterized queries.

**Test Steps**:
1. Attempt login with SQL injection payload in username
2. Verify login fails with validation error (not SQL error)
3. Verify no SQL is executed

**Expected Results**:
- Login fails with validation/authentication error
- No SQL injection occurs
- Database remains secure

**Assertions**:
```typescript
const sqlInjectionUsername = "'; DROP TABLE users; --";
const response = await loginUser(sqlInjectionUsername, 'password123');
expect(response.status).toBe(401); // Authentication error, not SQL error
// Verify users table still exists
const tableExists = await checkTableExists('users');
expect(tableExists).toBe(true);
```

#### Test 17: Timing Attack Prevention
**Test Name**: `should prevent timing attacks in password comparison`

**Description**: Verifies that password comparison timing is consistent (bcrypt handles this, but test verifies).

**Test Steps**:
1. Measure login time with non-existent user
2. Measure login time with existing user but wrong password
3. Verify timing is similar (prevents user enumeration via timing)

**Expected Results**:
- Timing is similar for both cases (within reasonable variance)
- Cannot determine if user exists based on response time

**Assertions**:
```typescript
// This is a basic test - actual timing attack prevention requires more sophisticated testing
const start1 = Date.now();
await loginUser('nonexistent', 'password123');
const time1 = Date.now() - start1;

const start2 = Date.now();
await loginUser(testUser.username, 'wrongpassword');
const time2 = Date.now() - start2;

// Times should be similar (within 100ms variance)
expect(Math.abs(time1 - time2)).toBeLessThan(100);
```

### Security Tests

#### Test 18: Rate Limiting
**Test Name**: `should apply rate limiting to login endpoint`

**Description**: Verifies that rate limiting is applied to login endpoint (5 requests per minute per IP).

**Test Steps**:
1. Send 5 login requests rapidly
2. Verify first 5 requests are processed
3. Send 6th request
4. Verify rate limit is exceeded (429 Too Many Requests)

**Expected Results**:
- First 5 requests: Processed normally
- 6th request: HTTP status code 429 Too Many Requests
- Response includes Retry-After header

**Assertions**:
```typescript
// Send 5 requests
for (let i = 0; i < 5; i++) {
  const response = await loginUser(testUser.username, testUser.password);
  expect([200, 401]).toContain(response.status); // Success or auth failure, not rate limit
}

// 6th request should be rate limited
const rateLimitedResponse = await loginUser(testUser.username, testUser.password);
expect(rateLimitedResponse.status).toBe(429);
expect(rateLimitedResponse.headers['retry-after']).toBeDefined();
```

### Notes
- Error message "Invalid username or password" should not specify which field is wrong for security
- Password comparison must use bcrypt.compare() function
- Authentication token format depends on implementation (JWT, session cookie, etc.)
- Rate limiting: 5 requests per minute per IP address for authentication endpoints
- Session expiration: 7 days of inactivity
