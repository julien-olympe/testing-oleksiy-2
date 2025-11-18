# Unit Test Specification: Join Ring (Apply for Membership) (Use Case 3.12)

## Overview
This document specifies unit tests for the Join Ring use case, covering membership verification, duplicate membership prevention, and automatic membership creation.

## Function/API Being Tested
- **API Endpoint**: `POST /api/rings/:id/join`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `getRingDetails(ringId: string): Promise<Ring>`
  - `checkMembershipExists(userId: string, ringId: string): Promise<boolean>`
  - `createMembership(userId: string, ringId: string): Promise<Membership>`
  - `joinRing(userId: string, ringId: string): Promise<Membership>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for ring details
- Mock database queries for membership existence check
- Mock database insert for membership creation
- Mock transaction management

### Test Data Factories
```typescript
const createTestRing = (overrides = {}) => ({
  id: 'ring-uuid',
  name: 'Test Ring',
  creator_id: 'user-uuid',
  created_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});

const createTestMembership = (overrides = {}) => ({
  id: 'membership-uuid',
  user_id: 'user-uuid',
  ring_id: 'ring-uuid',
  joined_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});
```

## Test Cases

### TC-JOIN-001: Successful Ring Join (Happy Path)
**Description**: Test successful joining of a ring.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock ring details to return ring
3. Arrange: Mock membership existence check to return false (user not member)
4. Arrange: Mock membership creation to succeed
5. Arrange: Mock transaction to succeed
6. Act: Call `joinRing(userId, ringId)`
7. Assert: Verify authentication was validated
8. Assert: Verify ring details were retrieved
9. Assert: Verify membership existence check was called
10. Assert: Verify membership was created with correct user_id and ring_id
11. Assert: Verify function returns success response with updated ring data

**Expected Output**:
- Status: 201 Created
- Response: `{ message: "You have joined 'Ring Name'.", ring: { id, name, memberCount, isMember: true } }`
- Database: Membership record created

**Mock Verification**:
- `validateAuthToken` called once
- `getRingDetails` called once with ring_id
- `checkMembershipExists` called once
- `createMembership` called once with user_id and ring_id

---

### TC-JOIN-002: Join Ring Fails - Already a Member
**Description**: Test join failure when user is already a member.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock ring details to return ring
3. Arrange: Mock membership existence check to return true (user already member)
4. Act: Call `joinRing(userId, ringId)`
5. Assert: Verify membership existence check was called
6. Assert: Verify function returns error
7. Assert: Verify membership creation was NOT called

**Expected Output**:
- Status: 400 Bad Request
- Error: "You are already a member of this Ring."

**Mock Verification**:
- `checkMembershipExists` called once, returns true
- `createMembership` not called

---

### TC-JOIN-003: Join Ring - Authentication Failure
**Description**: Test ring join with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `joinRing(userId, ringId)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-JOIN-004: Join Ring - Ring Not Found
**Description**: Test ring join when ring does not exist.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock ring details query to return null
3. Act: Call `joinRing(userId, ringId)`
4. Assert: Verify function returns not found error

**Expected Output**:
- Status: 404 Not Found
- Error: "Ring not found"

---

### TC-JOIN-005: Join Ring - Database Connection Error
**Description**: Test ring join when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `joinRing(userId, ringId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to join Ring. Please try again."

---

### TC-JOIN-006: Join Ring - Membership Creation Error
**Description**: Test ring join when membership creation fails.

**Test Steps**:
1. Arrange: Mock authentication and ring details to succeed
2. Arrange: Mock membership existence check to return false
3. Arrange: Mock membership creation to throw error
4. Act: Call `joinRing(userId, ringId)`
5. Assert: Verify error is caught and handled
6. Assert: Verify transaction rollback is called
7. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to join Ring. Please try again."

**Mock Verification**:
- Transaction rollback called
- No membership record created

---

### TC-JOIN-007: Join Ring - Transaction Rollback on Error
**Description**: Test that transaction is rolled back if any step fails.

**Test Steps**:
1. Arrange: Mock transaction begin
2. Arrange: Mock ring details to succeed
3. Arrange: Mock membership existence check to return false
4. Arrange: Mock membership creation to fail
5. Act: Call `joinRing(userId, ringId)`
6. Assert: Verify transaction rollback is called
7. Assert: Verify no partial data is saved

**Mock Verification**:
- Transaction begin called
- Transaction rollback called on error
- No membership record created

---

### TC-JOIN-008: Join Ring - Concurrent Join Attempts
**Description**: Test handling of concurrent join attempts.

**Test Steps**:
1. Arrange: Mock database to simulate race condition
2. Arrange: First join check returns false (user not member)
3. Arrange: Second join check returns false (user not member)
4. Arrange: First insert succeeds
5. Arrange: Second insert fails with unique constraint violation
6. Act: Simulate two concurrent join calls
7. Assert: Verify first join succeeds
8. Assert: Verify second join fails with "You are already a member"

**Expected Output**:
- First join: 201 Created
- Second join: 400 Bad Request - "You are already a member of this Ring"

**Mock Verification**:
- Database unique constraint prevents duplicate memberships
- Error handling converts constraint violation to user-friendly message

---

### TC-JOIN-009: Join Ring - Joined Timestamp
**Description**: Test that membership joined_at timestamp is set correctly.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Arrange: Mock current timestamp
3. Act: Call `joinRing(userId, ringId)`
4. Assert: Verify joined_at timestamp is set to current time
5. Assert: Verify timestamp is in correct format

**Expected Output**:
- Membership joined_at set to current timestamp
- Timestamp format is ISO 8601 or PostgreSQL TIMESTAMP

---

### TC-JOIN-010: Join Ring - Membership ID Generation
**Description**: Test that membership ID is generated correctly (UUID).

**Test Steps**:
1. Arrange: Mock all dependencies
2. Act: Call `joinRing(userId, ringId)`
3. Assert: Verify membership ID is generated (UUID format)
4. Assert: Verify ID is unique
5. Assert: Verify ID is included in response

**Expected Output**:
- Membership id is valid UUID
- ID is unique for each membership

---

### TC-JOIN-011: Join Ring - Invalid Ring ID
**Description**: Test ring join with invalid ring ID format.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Set ringId to invalid UUID format
3. Act: Call `joinRing(userId, 'invalid-id')`
4. Assert: Verify validation fails
5. Assert: Verify function returns bad request error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Invalid ring ID"

---

### TC-JOIN-012: Join Ring - Success Response Format
**Description**: Test that success response includes correct message and ring data.

**Test Steps**:
1. Arrange: Mock all dependencies for successful join
2. Act: Call `joinRing(userId, ringId)`
3. Assert: Verify response includes success message with ring name
4. Assert: Verify response includes updated ring data with isMember: true
5. Assert: Verify message format matches specification

**Expected Output**:
- Status: 201 Created
- Response: `{ message: "You have joined '[Ring name]'.", ring: { id, name, memberCount, isMember: true } }`

---

### TC-JOIN-013: Join Ring - Member Count Updated
**Description**: Test that member count is updated after joining.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Arrange: Mock ring with initial member count
3. Act: Call `joinRing(userId, ringId)`
4. Assert: Verify member count is recalculated
5. Assert: Verify updated member count is included in response

**Expected Output**:
- Response includes updated memberCount
- Member count reflects new membership

---

### TC-JOIN-014: Join Ring - User Immediately Gains Access
**Description**: Test that user can immediately access ring after joining.

**Test Steps**:
1. Arrange: Mock all dependencies for successful join
2. Act: Call `joinRing(userId, ringId)`
3. Assert: Verify membership is created
4. Assert: Verify user can immediately view ring chat
5. Assert: Verify user can immediately post in ring

**Expected Output**:
- Membership created successfully
- User can access ring immediately

---

### TC-JOIN-015: Join Ring - SQL Injection Prevention
**Description**: Test that ring ID prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock database with parameterized query verification
3. Act: Call `joinRing(userId, "'; DROP TABLE rings; --")`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as ring ID
6. Assert: Verify database is not compromised

**Expected Output**:
- Status: 400 Bad Request (invalid ring ID) or 404 Not Found
- SQL injection attempt treated as literal ring ID
- No database damage

---

### TC-JOIN-016: Join Ring - Rate Limiting
**Description**: Test that join endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 100 requests per minute per user
3. Act: Call join endpoint 101 times rapidly
4. Assert: Verify first 100 requests succeed
5. Assert: Verify 101st request returns 429 Too Many Requests

**Expected Output**:
- First 100 requests: 201 Created
- 101st request: 429 Too Many Requests
