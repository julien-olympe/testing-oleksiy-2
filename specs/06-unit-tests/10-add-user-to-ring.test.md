# Unit Test Specification: Add User to Ring (Use Case 3.10)

## Overview
This document specifies unit tests for the Add User to Ring use case, covering membership verification, user lookup, duplicate membership prevention, and error conditions.

## Function/API Being Tested
- **API Endpoint**: `POST /api/rings/:id/members`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `verifyMembership(userId: string, ringId: string): Promise<boolean>`
  - `findUserByUsername(username: string): Promise<User | null>`
  - `checkMembershipExists(userId: string, ringId: string): Promise<boolean>`
  - `createMembership(userId: string, ringId: string): Promise<Membership>`
  - `addUserToRing(addingUserId: string, ringId: string, usernameToAdd: string): Promise<Membership>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for membership verification
- Mock database queries for user lookup
- Mock database queries for membership existence check
- Mock database insert for membership creation
- Mock transaction management

### Test Data Factories
```typescript
const createTestUser = (overrides = {}) => ({
  id: 'user-uuid',
  username: 'testuser',
  password_hash: 'hashed',
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

### TC-ADD-USER-001: Successful User Addition (Happy Path)
**Description**: Test successful addition of user to ring.

**Test Steps**:
1. Arrange: Mock authentication to return valid user (adding user)
2. Arrange: Mock membership verification to return true (adding user is member)
3. Arrange: Mock user lookup to return user to be added
4. Arrange: Mock membership existence check to return false (user not already member)
5. Arrange: Mock membership creation to succeed
6. Arrange: Mock transaction to succeed
7. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
8. Assert: Verify authentication was validated
9. Assert: Verify adding user's membership was verified
10. Assert: Verify user lookup was called with correct username
11. Assert: Verify membership existence check was called
12. Assert: Verify membership was created with correct user_id and ring_id
13. Assert: Verify function returns success response

**Expected Output**:
- Status: 201 Created
- Response: `{ message: "User 'newuser' has been added to the Ring." }`
- Database: Membership record created

**Mock Verification**:
- `validateAuthToken` called once
- `verifyMembership` called once with adding user's id
- `findUserByUsername` called once with 'newuser'
- `checkMembershipExists` called once
- `createMembership` called once with user_id and ring_id

---

### TC-ADD-USER-002: Add User Fails - Adding User Not a Member
**Description**: Test user addition failure when adding user is not a member.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock membership verification to return false (adding user not member)
3. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
4. Assert: Verify membership verification fails
5. Assert: Verify function returns forbidden error
6. Assert: Verify no user lookup or membership creation is attempted

**Expected Output**:
- Status: 403 Forbidden
- Error: "You are not a member of this Ring."

**Mock Verification**:
- `verifyMembership` called once, returns false
- `findUserByUsername` not called
- `createMembership` not called

---

### TC-ADD-USER-003: Add User Fails - Username Not Found
**Description**: Test user addition failure when username does not exist.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock user lookup to return null (user not found)
3. Act: Call `addUserToRing(addingUserId, ringId, 'nonexistent')`
4. Assert: Verify user lookup was called
5. Assert: Verify function returns not found error
6. Assert: Verify membership creation was NOT called

**Expected Output**:
- Status: 404 Not Found
- Error: "User 'nonexistent' not found."

**Mock Verification**:
- `findUserByUsername` called once, returns null
- `createMembership` not called

---

### TC-ADD-USER-004: Add User Fails - User Already a Member
**Description**: Test user addition failure when user is already a member.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock user lookup to return user
3. Arrange: Mock membership existence check to return true (user already member)
4. Act: Call `addUserToRing(addingUserId, ringId, 'existingmember')`
5. Assert: Verify membership existence check was called
6. Assert: Verify function returns error
7. Assert: Verify membership creation was NOT called

**Expected Output**:
- Status: 400 Bad Request
- Error: "User 'existingmember' is already a member of this Ring."

**Mock Verification**:
- `checkMembershipExists` called once, returns true
- `createMembership` not called

---

### TC-ADD-USER-005: Add User Fails - Empty Username
**Description**: Test user addition failure when username is empty.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Set username to empty string
3. Act: Call `addUserToRing(addingUserId, ringId, '')`
4. Assert: Verify input validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username is required"

---

### TC-ADD-USER-006: Add User Fails - Null Username
**Description**: Test user addition failure when username is null.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Set username to null
3. Act: Call `addUserToRing(addingUserId, ringId, null)`
4. Assert: Verify input validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Username is required"

---

### TC-ADD-USER-007: Add User - Authentication Failure
**Description**: Test user addition with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-ADD-USER-008: Add User - Database Connection Error
**Description**: Test user addition when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to add user. Please try again."

---

### TC-ADD-USER-009: Add User - User Lookup Query Error
**Description**: Test user addition when user lookup query fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock user lookup to throw error
3. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to add user. Please try again."

---

### TC-ADD-USER-010: Add User - Membership Creation Error
**Description**: Test user addition when membership creation fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock user lookup to return user
3. Arrange: Mock membership existence check to return false
4. Arrange: Mock membership creation to throw error
5. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
6. Assert: Verify error is caught and handled
7. Assert: Verify transaction rollback is called
8. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to add user. Please try again."

**Mock Verification**:
- Transaction rollback called
- No membership record created

---

### TC-ADD-USER-011: Add User - Transaction Rollback on Error
**Description**: Test that transaction is rolled back if any step fails.

**Test Steps**:
1. Arrange: Mock transaction begin
2. Arrange: Mock membership verification to succeed
3. Arrange: Mock user lookup to succeed
4. Arrange: Mock membership existence check to return false
5. Arrange: Mock membership creation to fail
6. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
7. Assert: Verify transaction rollback is called
8. Assert: Verify no partial data is saved

**Mock Verification**:
- Transaction begin called
- Transaction rollback called on error
- No membership record created

---

### TC-ADD-USER-012: Add User - Concurrent Addition Attempts
**Description**: Test handling of concurrent addition attempts with same user.

**Test Steps**:
1. Arrange: Mock database to simulate race condition
2. Arrange: First addition check returns false (user not member)
3. Arrange: Second addition check returns false (user not member)
4. Arrange: First insert succeeds
5. Arrange: Second insert fails with unique constraint violation
6. Act: Simulate two concurrent addition calls with same user
7. Assert: Verify first addition succeeds
8. Assert: Verify second addition fails with "User is already a member"

**Expected Output**:
- First addition: 201 Created
- Second addition: 400 Bad Request - "User is already a member of this Ring"

**Mock Verification**:
- Database unique constraint prevents duplicate memberships
- Error handling converts constraint violation to user-friendly message

---

### TC-ADD-USER-013: Add User - SQL Injection Prevention
**Description**: Test that username prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock database with parameterized query verification
3. Act: Call `addUserToRing(addingUserId, ringId, "'; DROP TABLE users; --")`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as username
6. Assert: Verify database is not compromised

**Expected Output**:
- Status: 404 Not Found (username doesn't exist)
- SQL injection attempt treated as literal username
- No database damage

---

### TC-ADD-USER-014: Add User - Username Case Sensitivity
**Description**: Test username lookup with case variations.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock user with username "TestUser"
3. Arrange: Mock user lookup (case-sensitive or case-insensitive)
4. Act: Call `addUserToRing(addingUserId, ringId, 'testuser')` (lowercase)
5. Assert: Verify behavior matches specification

**Note**: Username lookup should be case-sensitive based on database collation.

---

### TC-ADD-USER-015: Add User - Joined Timestamp
**Description**: Test that membership joined_at timestamp is set correctly.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Arrange: Mock current timestamp
3. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
4. Assert: Verify joined_at timestamp is set to current time
5. Assert: Verify timestamp is in correct format

**Expected Output**:
- Membership joined_at set to current timestamp
- Timestamp format is ISO 8601 or PostgreSQL TIMESTAMP

---

### TC-ADD-USER-016: Add User - Membership ID Generation
**Description**: Test that membership ID is generated correctly (UUID).

**Test Steps**:
1. Arrange: Mock all dependencies
2. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
3. Assert: Verify membership ID is generated (UUID format)
4. Assert: Verify ID is unique
5. Assert: Verify ID is included in response

**Expected Output**:
- Membership id is valid UUID
- ID is unique for each membership

---

### TC-ADD-USER-017: Add User - Adding User Cannot Add Themselves
**Description**: Test that adding user cannot add themselves to ring (if applicable).

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock user lookup to return adding user
3. Act: Call `addUserToRing(addingUserId, ringId, addingUserUsername)`
4. Assert: Verify behavior matches specification (may allow or prevent)

**Note**: Specification doesn't explicitly prevent this, but test should verify behavior.

---

### TC-ADD-USER-018: Add User - Invalid Ring ID
**Description**: Test user addition with invalid ring ID format.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Set ringId to invalid UUID format
3. Act: Call `addUserToRing(addingUserId, 'invalid-id', 'newuser')`
4. Assert: Verify validation fails
5. Assert: Verify function returns bad request error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Invalid ring ID"

---

### TC-ADD-USER-019: Add User - Ring Not Found
**Description**: Test user addition when ring does not exist.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock ring lookup to return null
3. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
4. Assert: Verify function returns not found error

**Expected Output**:
- Status: 404 Not Found
- Error: "Ring not found"

---

### TC-ADD-USER-020: Add User - Success Response Format
**Description**: Test that success response includes correct message format.

**Test Steps**:
1. Arrange: Mock all dependencies for successful addition
2. Act: Call `addUserToRing(addingUserId, ringId, 'newuser')`
3. Assert: Verify response includes success message with username
4. Assert: Verify message format matches specification

**Expected Output**:
- Status: 201 Created
- Response: `{ message: "User 'newuser' has been added to the Ring." }`
