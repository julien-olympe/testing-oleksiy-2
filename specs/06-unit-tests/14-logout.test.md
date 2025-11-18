# Unit Test Specification: Logout (Use Case 3.14)

## Overview
This document specifies unit tests for the Logout use case, covering session invalidation, token clearing, and error handling.

## Function/API Being Tested
- **API Endpoint**: `POST /api/auth/logout`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `invalidateSession(sessionId: string): Promise<void>`
  - `clearSessionCookie(reply: FastifyReply): void`
  - `logoutUser(userId: string, sessionId: string): Promise<void>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock session storage/invalidation
- Mock cookie clearing

## Test Cases

### TC-LOGOUT-001: Successful Logout (Happy Path)
**Description**: Test successful user logout.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock session invalidation to succeed
3. Arrange: Mock cookie clearing
4. Act: Call `logoutUser(userId, sessionId)`
5. Assert: Verify authentication was validated
6. Assert: Verify session was invalidated
7. Assert: Verify session cookie was cleared
8. Assert: Verify function returns success response

**Expected Output**:
- Status: 200 OK
- Response: `{ message: "Logged out successfully" }`
- Session invalidated on server
- Session cookie cleared on client

**Mock Verification**:
- `validateAuthToken` called once
- `invalidateSession` called once with sessionId
- `clearSessionCookie` called once

---

### TC-LOGOUT-002: Logout - Authentication Failure
**Description**: Test logout with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `logoutUser(userId, sessionId)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-LOGOUT-003: Logout - Session Invalidation Error
**Description**: Test logout when session invalidation fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock session invalidation to throw error
3. Act: Call `logoutUser(userId, sessionId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error
6. Assert: Verify cookie is still cleared (client-side logout)

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to logout. Please try again."
- Cookie cleared on client (user logged out on client side)

---

### TC-LOGOUT-004: Logout - Database Connection Error
**Description**: Test logout when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `logoutUser(userId, sessionId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error
6. Assert: Verify cookie is still cleared

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to logout. Please try again."
- Cookie cleared on client

---

### TC-LOGOUT-005: Logout - Session Cookie Cleared
**Description**: Test that session cookie is cleared on logout.

**Test Steps**:
1. Arrange: Mock authentication and session invalidation
2. Arrange: Mock Fastify reply.clearCookie
3. Act: Call `logoutUser(userId, sessionId)`
4. Assert: Verify clearCookie was called with session cookie name
5. Assert: Verify cookie options are correct

**Mock Verification**:
- `reply.clearCookie` called once with session cookie name
- Cookie cleared with correct options

---

### TC-LOGOUT-006: Logout - Session Invalidated on Server
**Description**: Test that session is invalidated on server side.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock session storage invalidation
3. Act: Call `logoutUser(userId, sessionId)`
4. Assert: Verify session is removed from storage
5. Assert: Verify session cannot be used after logout

**Expected Output**:
- Session removed from server storage
- Session token no longer valid

---

### TC-LOGOUT-007: Logout - Client-Side Token Cleared
**Description**: Test that client-side token is cleared (frontend responsibility, but verify API supports it).

**Test Steps**:
1. Arrange: Mock authentication and session invalidation
2. Act: Call `logoutUser(userId, sessionId)`
3. Assert: Verify response indicates successful logout
4. Assert: Verify frontend can clear local storage token

**Expected Output**:
- Status: 200 OK
- Frontend clears authentication token from local storage

---

### TC-LOGOUT-008: Logout - Graceful Error Handling
**Description**: Test that logout errors are handled gracefully.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock session invalidation to fail
3. Act: Call `logoutUser(userId, sessionId)`
4. Assert: Verify error is caught
5. Assert: Verify user-friendly error message is returned
6. Assert: Verify no sensitive information is exposed

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to logout. Please try again." (user-friendly)
- No stack traces or technical details exposed

---

### TC-LOGOUT-009: Logout - Performance
**Description**: Test logout performance.

**Test Steps**:
1. Arrange: Mock authentication and session invalidation
2. Act: Call `logoutUser(userId, sessionId)`
3. Assert: Verify logout completes within 500ms
4. Assert: Verify response is returned quickly

**Expected Output**:
- Status: 200 OK
- Response time: < 500ms

---

### TC-LOGOUT-010: Logout - Concurrent Logout Attempts
**Description**: Test handling of concurrent logout attempts.

**Test Steps**:
1. Arrange: Mock authentication and session invalidation
2. Act: Simulate 10 concurrent logout calls with same session
3. Assert: Verify all logouts complete successfully
4. Assert: Verify session is invalidated
5. Assert: Verify no race conditions

**Expected Output**:
- All logout requests: 200 OK or 401 Unauthorized (after first logout)
- Session invalidated

---

### TC-LOGOUT-011: Logout - Already Logged Out Session
**Description**: Test logout with already invalidated session.

**Test Steps**:
1. Arrange: Mock authentication to return null (session already invalid)
2. Act: Call `logoutUser(userId, sessionId)`
3. Assert: Verify function handles gracefully
4. Assert: Verify appropriate response is returned

**Expected Output**:
- Status: 401 Unauthorized or 200 OK (idempotent)
- No error thrown

---

### TC-LOGOUT-012: Logout - Response Format
**Description**: Test that logout response format matches specification.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Act: Call `logoutUser(userId, sessionId)`
3. Assert: Verify response is valid JSON
4. Assert: Verify response structure matches specification

**Expected Output**:
- Status: 200 OK
- Response: Valid JSON object
