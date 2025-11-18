# Logout Test Specification

## Test File: `logout.test.ts`

### Purpose
Tests for Logout use case (3.14) covering successful logout, session invalidation, token clearing, and error handling.

### Test Setup

**Before All Tests**:
```typescript
beforeAll(async () => {
  // Initialize test database connection
  // Set up test database schema
  // Set up session store
});
```

**Before Each Test**:
```typescript
beforeEach(async () => {
  // Clear all tables
  // Clear session store
  // Create test user
  // Reset mocks
});
```

**After Each Test**:
```typescript
afterEach(async () => {
  // Clean up test data
  // Clear sessions
  // Reset database state
});
```

### Test Data

**Test User**:
```typescript
const user1 = {
  id: uuid(),
  username: 'testuser',
  passwordHash: await bcrypt.hash('password123', 10)
};
```

### Test Cases

#### Test 1: Successful Logout - Happy Path
**Test Name**: `should successfully logout authenticated user`

**Description**: Verifies that authenticated user can logout successfully.

**Test Steps**:
1. Authenticate as user (create session)
2. Send POST request to `/api/auth/logout`
3. Verify response status code is 200 OK
4. Verify session is invalidated
5. Verify authentication token is cleared (client-side)
6. Verify user is redirected to login screen (client-side)

**Expected Results**:
- HTTP status code: 200 OK
- Response indicates successful logout
- Session is invalidated on server
- Authentication token is cleared (client-side)
- User cannot access protected endpoints after logout

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.message).toBeDefined();

// Verify session is invalidated
const session = await getSession(sessionId);
expect(session).toBeNull(); // or undefined

// Verify token is invalid
const protectedResponse = await fetch('/api/user/settings', {
  headers: { 'Authorization': `Bearer ${token}` }
});
expect(protectedResponse.status).toBe(401);
```

#### Test 2: Session Invalidation
**Test Name**: `should invalidate user session on logout`

**Description**: Verifies that user session is invalidated and cannot be used after logout.

**Test Steps**:
1. Authenticate as user
2. Save session ID
3. Logout
4. Attempt to use session ID for authenticated request
5. Verify request is rejected

**Expected Results**:
- Session is invalidated
- Session ID cannot be used for authenticated requests
- Requests with invalidated session return 401 Unauthorized

**Assertions**:
```typescript
// Before logout
const beforeResponse = await getSettings(userToken);
expect(beforeResponse.status).toBe(200);

// Logout
await logout(userToken);

// After logout
const afterResponse = await getSettings(userToken);
expect(afterResponse.status).toBe(401);
```

#### Test 3: Token Clearing - Client Side
**Test Name**: `should clear authentication token on client side`

**Description**: Verifies that authentication token is cleared from client storage (cookie/localStorage).

**Test Steps**:
1. Authenticate as user
2. Verify token exists in client storage
3. Logout
4. Verify token is cleared from client storage

**Expected Results**:
- Token is cleared from client storage
- Token cannot be retrieved after logout

**Assertions**:
```typescript
// This test may require client-side testing or mocking
// Verify token is cleared from cookie/localStorage
const tokenBefore = getTokenFromStorage();
expect(tokenBefore).toBeDefined();

await logout(userToken);

const tokenAfter = getTokenFromStorage();
expect(tokenAfter).toBeNull(); // or undefined
```

#### Test 4: Multiple Logout Attempts
**Test Name**: `should handle multiple logout requests gracefully`

**Description**: Verifies that multiple logout requests are handled gracefully.

**Test Steps**:
1. Logout first time
2. Attempt to logout again
3. Verify second logout request is handled

**Expected Results**:
- First logout: Success (200 OK)
- Second logout: May return success or error, but should not crash

**Assertions**:
```typescript
const firstResponse = await logout(userToken);
expect(firstResponse.status).toBe(200);

const secondResponse = await logout(userToken);
// Should either return success or error, but not crash
expect([200, 401, 400]).toContain(secondResponse.status);
```

#### Test 5: Logout Without Authentication
**Test Name**: `should handle logout request without authentication token`

**Description**: Verifies that logout request without authentication token is handled.

**Test Steps**:
1. Send POST request to `/api/auth/logout` without authentication token
2. Verify request is handled (may succeed or fail)

**Expected Results**:
- Request is handled gracefully
- May return 200 OK (logout succeeds even without token) or 401 Unauthorized

**Assertions**:
```typescript
const response = await fetch('/api/auth/logout', {
  method: 'POST'
  // No authentication header
});
// Logout may succeed even without token (clearing any client-side state)
expect([200, 401]).toContain(response.status);
```

#### Test 6: Logout With Invalid Token
**Test Name**: `should handle logout request with invalid token`

**Description**: Verifies that logout request with invalid token is handled.

**Test Steps**:
1. Send POST request with invalid authentication token
2. Verify request is handled

**Expected Results**:
- Request is handled gracefully
- May return 200 OK (logout succeeds) or 401 Unauthorized

**Assertions**:
```typescript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer invalid_token' }
});
// Logout may succeed even with invalid token
expect([200, 401]).toContain(response.status);
```

#### Test 7: Protected Endpoint Access After Logout
**Test Name**: `should deny access to protected endpoints after logout`

**Description**: Verifies that user cannot access protected endpoints after logout.

**Test Steps**:
1. Authenticate as user
2. Access protected endpoint (verify success)
3. Logout
4. Attempt to access protected endpoint again
5. Verify access is denied

**Expected Results**:
- Before logout: Protected endpoint access granted (200 OK)
- After logout: Protected endpoint access denied (401 Unauthorized)

**Assertions**:
```typescript
// Before logout
const beforeResponse = await getSettings(userToken);
expect(beforeResponse.status).toBe(200);

// Logout
await logout(userToken);

// After logout
const afterResponse = await getSettings(userToken);
expect(afterResponse.status).toBe(401);
```

#### Test 8: Session Data Clearing
**Test Name**: `should clear all session data on logout`

**Description**: Verifies that all session data is cleared on logout.

**Test Steps**:
1. Authenticate as user (session contains user data)
2. Logout
3. Verify session data is cleared
4. Verify session cannot be retrieved

**Expected Results**:
- Session data is cleared
- Session cannot be retrieved after logout

**Assertions**:
```typescript
// Before logout
const sessionBefore = await getSession(sessionId);
expect(sessionBefore).toBeDefined();
expect(sessionBefore.userId).toBe(user1.id);

// Logout
await logout(userToken);

// After logout
const sessionAfter = await getSession(sessionId);
expect(sessionAfter).toBeNull(); // or undefined
```

#### Test 9: Cookie Clearing
**Test Name**: `should clear session cookie on logout`

**Description**: Verifies that session cookie is cleared on logout (if using cookies).

**Test Steps**:
1. Authenticate as user (cookie is set)
2. Logout
3. Verify cookie is cleared

**Expected Results**:
- Session cookie is cleared
- Cookie cannot be used for authentication

**Assertions**:
```typescript
// This test may require checking Set-Cookie header or cookie store
const logoutResponse = await logout(userToken);
const setCookieHeader = logoutResponse.headers['set-cookie'];
// Verify cookie is cleared (expires in past or max-age=0)
expect(setCookieHeader).toBeDefined();
// Cookie should be cleared
```

#### Test 10: Logout Response Message
**Test Name**: `should return success message on logout`

**Description**: Verifies that logout response includes success message.

**Test Steps**:
1. Logout
2. Verify response includes success message

**Expected Results**:
- Response includes message field
- Message indicates successful logout

**Assertions**:
```typescript
expect(response.body.message).toBeDefined();
expect(typeof response.body.message).toBe('string');
```

### Error Handling Tests

#### Test 11: Database Connection Error
**Test Name**: `should handle database connection error gracefully during logout`

**Description**: Verifies that database connection errors during logout are handled.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to logout
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: "Unable to logout. Please try again."
- User is still logged out on client side (token cleared)

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBe('Unable to logout. Please try again.');
// Client-side token should still be cleared even if server error occurs
```

#### Test 12: Session Store Error
**Test Name**: `should handle session store errors gracefully`

**Description**: Verifies that session store errors during logout are handled.

**Test Steps**:
1. Simulate session store failure
2. Attempt to logout
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: "Unable to logout. Please try again."
- User is still logged out on client side

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBe('Unable to logout. Please try again.');
```

### Notes
- Logout invalidates session on server
- Logout clears authentication token on client side
- User is redirected to login screen after logout (client-side)
- Error message: "Unable to logout. Please try again."
- Even if server error occurs, client-side token should be cleared
- Logout endpoint: POST `/api/auth/logout`
- After logout, user cannot access protected endpoints
