# View Settings Test Specification

## Test File: `view-settings.test.ts`

### Purpose
Tests for View Settings use case (3.13) covering successful settings retrieval, user data display, authentication, and error handling.

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
  // Clear all tables
  // Create test user
  // Reset mocks
});
```

**After Each Test**:
```typescript
afterEach(async () => {
  // Clean up test data
  // Reset database state
});
```

### Test Data

**Test User**:
```typescript
const user1 = {
  id: uuid(),
  username: 'testuser',
  passwordHash: await bcrypt.hash('password123', 10),
  created_at: new Date('2024-01-01T10:00:00Z')
};
```

### Test Cases

#### Test 1: Successful Settings Retrieval - Happy Path
**Test Name**: `should return user settings for authenticated user`

**Description**: Verifies that authenticated user can retrieve their settings.

**Test Steps**:
1. Create user
2. Authenticate as user
3. Send GET request to `/api/user/settings`
4. Verify response status code is 200 OK
5. Verify response contains user data (username)
6. Verify logout button is available (in UI context)

**Expected Results**:
- HTTP status code: 200 OK
- Response body contains user data
- User data includes username
- Settings screen can be displayed with username and logout button

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.user).toBeDefined();
expect(response.body.user.username).toBe(user1.username);
expect(response.body.user.id).toBeDefined();
expect(response.body.user.password).toBeUndefined(); // Password never returned
expect(response.body.user.password_hash).toBeUndefined();
```

#### Test 2: Username Display
**Test Name**: `should return correct username in settings`

**Description**: Verifies that settings return the correct username for authenticated user.

**Test Steps**:
1. Create user with specific username
2. Authenticate as user
3. Retrieve settings
4. Verify username matches

**Expected Results**:
- Username in response matches user's actual username

**Assertions**:
```typescript
expect(response.body.user.username).toBe(user1.username);
```

#### Test 3: User ID Display
**Test Name**: `should return user ID in settings`

**Description**: Verifies that settings include user ID.

**Test Steps**:
1. Retrieve settings
2. Verify user ID is included

**Expected Results**:
- User ID is included in response

**Assertions**:
```typescript
expect(response.body.user.id).toBeDefined();
expect(response.body.user.id).toBe(user1.id);
```

#### Test 4: Password Not Returned
**Test Name**: `should never return password or password hash in settings`

**Description**: Verifies that password and password hash are never returned in settings response.

**Test Steps**:
1. Retrieve settings
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

#### Test 5: Authentication Required
**Test Name**: `should require authentication to view settings`

**Description**: Verifies that unauthenticated requests are rejected.

**Test Steps**:
1. Send GET request to `/api/user/settings` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 6: Invalid Authentication Token
**Test Name**: `should reject request with invalid authentication token`

**Description**: Verifies that requests with invalid authentication token are rejected.

**Test Steps**:
1. Send GET request with invalid authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates invalid authentication

**Assertions**:
```typescript
const response = await fetch('/api/user/settings', {
  headers: { 'Authorization': 'Bearer invalid_token' }
});
expect(response.status).toBe(401);
```

#### Test 7: Expired Authentication Token
**Test Name**: `should reject request with expired authentication token`

**Description**: Verifies that requests with expired authentication token are rejected.

**Test Steps**:
1. Create expired authentication token
2. Send GET request with expired token
3. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates expired authentication

**Assertions**:
```typescript
const expiredToken = createExpiredToken(user1.id);
const response = await fetch('/api/user/settings', {
  headers: { 'Authorization': `Bearer ${expiredToken}` }
});
expect(response.status).toBe(401);
```

#### Test 8: Settings Screen Data
**Test Name**: `should return data required for settings screen display`

**Description**: Verifies that settings response contains all data needed for settings screen.

**Test Steps**:
1. Retrieve settings
2. Verify response contains username
3. Verify response structure supports settings screen display

**Expected Results**:
- Response contains username (required for display)
- Response structure is suitable for settings screen

**Assertions**:
```typescript
expect(response.body.user).toBeDefined();
expect(response.body.user.username).toBeDefined();
expect(typeof response.body.user.username).toBe('string');
```

#### Test 9: User Data Consistency
**Test Name**: `should return consistent user data across requests`

**Description**: Verifies that settings return consistent user data across multiple requests.

**Test Steps**:
1. Retrieve settings multiple times
2. Verify user data is consistent

**Expected Results**:
- User data is consistent across requests
- Username does not change

**Assertions**:
```typescript
const response1 = await getSettings(userToken);
const response2 = await getSettings(userToken);

expect(response1.body.user.username).toBe(response2.body.user.username);
expect(response1.body.user.id).toBe(response2.body.user.id);
```

#### Test 10: Non-Existent User
**Test Name**: `should handle non-existent user gracefully`

**Description**: Verifies that settings request for non-existent user (invalid token) is handled.

**Test Steps**:
1. Create token for non-existent user ID
2. Attempt to retrieve settings
3. Verify error response

**Expected Results**:
- HTTP status code: 401 Unauthorized or 404 Not Found
- Error message indicates user not found or invalid authentication

**Assertions**:
```typescript
const nonExistentUserId = uuid();
const invalidToken = createToken(nonExistentUserId);
const response = await getSettings(invalidToken);
expect([401, 404]).toContain(response.status);
```

### Error Handling Tests

#### Test 11: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to retrieve settings
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: "Unable to load settings. Please try again."

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBe('Unable to load settings. Please try again.');
```

#### Test 12: SQL Injection Prevention
**Test Name**: `should prevent SQL injection in user ID from token`

**Description**: Verifies that SQL injection attempts in user ID (from token) are prevented.

**Test Steps**:
1. Attempt to create token with SQL injection payload in user ID
2. Attempt to retrieve settings
3. Verify request fails safely
4. Verify no SQL injection occurs

**Expected Results**:
- Request fails with authentication error
- No SQL injection occurs
- Database remains secure

**Assertions**:
```typescript
// This should be prevented at token validation level
// Verify token validation prevents SQL injection
const sqlInjectionUserId = "'; DROP TABLE users; --";
// Token creation should fail or token validation should prevent this
```

### Notes
- Settings screen displays username and logout button
- Only authenticated users can view settings
- Password and password hash are never returned
- Error message: "Unable to load settings. Please try again."
- Settings endpoint: GET `/api/user/settings`
- Response contains user data (username, id) for display
