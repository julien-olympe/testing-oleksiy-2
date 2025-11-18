# Unit Test Specification: Create Ring (Use Case 3.5)

## Overview
This document specifies unit tests for the Create Ring use case, covering ring name validation, uniqueness checks, automatic membership creation, and error conditions.

## Function/API Being Tested
- **API Endpoint**: `POST /api/rings`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `validateRingName(name: string): ValidationResult`
  - `checkRingNameExists(name: string): Promise<boolean>`
  - `createRing(name: string, creatorId: string): Promise<Ring>`
  - `createMembership(userId: string, ringId: string): Promise<Membership>`
  - `createRingWithMembership(name: string, userId: string): Promise<Ring>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for ring name existence
- Mock database insert for ring creation
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
```

## Test Cases

### TC-CREATE-RING-001: Successful Ring Creation (Happy Path)
**Description**: Test successful ring creation with valid name.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock ring name validation to pass
3. Arrange: Mock ring name existence check to return false (name available)
4. Arrange: Mock ring creation to return new ring
5. Arrange: Mock membership creation to succeed
6. Arrange: Mock transaction to succeed
7. Act: Call `createRingWithMembership('New Ring', userId)`
8. Assert: Verify authentication was validated
9. Assert: Verify ring name validation was called
10. Assert: Verify ring name existence check was called
11. Assert: Verify ring was created with correct name and creator_id
12. Assert: Verify membership was created linking user to new ring
13. Assert: Verify transaction was used (both operations in transaction)
14. Assert: Verify function returns new ring data

**Expected Output**:
- Status: 201 Created
- Response: `{ id, name: 'New Ring', creator_id, created_at }`
- Database: Ring record created, Membership record created

**Mock Verification**:
- `validateRingName` called once with 'New Ring'
- `checkRingNameExists` called once, returns false
- `createRing` called once with name and creator_id
- `createMembership` called once with user_id and ring_id

---

### TC-CREATE-RING-002: Ring Creation Fails - Name Already Exists
**Description**: Test ring creation failure when name is already taken.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock ring name validation to pass
3. Arrange: Mock ring name existence check to return true (name taken)
4. Act: Call `createRingWithMembership('Existing Ring', userId)`
5. Assert: Verify ring name existence check was called
6. Assert: Verify ring creation was NOT called
7. Assert: Verify membership creation was NOT called
8. Assert: Verify function returns error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Ring name already exists. Please choose a different name."

**Mock Verification**:
- `checkRingNameExists` called once, returns true
- `createRing` not called
- `createMembership` not called

---

### TC-CREATE-RING-003: Ring Creation Fails - Name Too Short (Empty)
**Description**: Test ring creation failure when name is empty.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Set ring name to empty string
3. Act: Call `createRingWithMembership('', userId)`
4. Assert: Verify ring name validation fails
5. Assert: Verify ring name existence check was NOT called
6. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Ring name must be between 1 and 100 characters."

---

### TC-CREATE-RING-004: Ring Creation Fails - Name Too Long (101 characters)
**Description**: Test ring creation failure when name exceeds maximum length.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Set ring name to 101 characters
3. Act: Call `createRingWithMembership('a'.repeat(101), userId)`
4. Assert: Verify ring name validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Ring name must be between 1 and 100 characters."

---

### TC-CREATE-RING-005: Ring Creation Succeeds - Name at Minimum Length (1 character)
**Description**: Test successful ring creation with name at minimum valid length.

**Test Steps**:
1. Arrange: Mock authentication and all dependencies
2. Arrange: Mock ring name existence check to return false
3. Act: Call `createRingWithMembership('A', userId)`
4. Assert: Verify ring name validation passes
5. Assert: Verify ring creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Ring created successfully

---

### TC-CREATE-RING-006: Ring Creation Succeeds - Name at Maximum Length (100 characters)
**Description**: Test successful ring creation with name at maximum valid length.

**Test Steps**:
1. Arrange: Mock authentication and all dependencies
2. Arrange: Mock ring name existence check to return false
3. Act: Call `createRingWithMembership('a'.repeat(100), userId)`
4. Assert: Verify ring name validation passes
5. Assert: Verify ring creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Ring created successfully

---

### TC-CREATE-RING-007: Ring Creation Fails - Null Name
**Description**: Test ring creation failure when name is null.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Set ring name to null
3. Act: Call `createRingWithMembership(null, userId)`
4. Assert: Verify ring name validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Ring name is required"

---

### TC-CREATE-RING-008: Ring Creation - Authentication Failure
**Description**: Test ring creation with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `createRingWithMembership('New Ring', userId)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error
5. Assert: Verify no database operations are executed

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-CREATE-RING-009: Ring Creation - Database Connection Error
**Description**: Test ring creation when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `createRingWithMembership('New Ring', userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to create Ring. Please try again."

---

### TC-CREATE-RING-010: Ring Creation - Ring Name Check Query Error
**Description**: Test ring creation when ring name existence check fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock ring name validation to pass
3. Arrange: Mock ring name existence check to throw error
4. Act: Call `createRingWithMembership('New Ring', userId)`
5. Assert: Verify error is caught and handled
6. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to create Ring. Please try again."

---

### TC-CREATE-RING-011: Ring Creation - Ring Insert Error
**Description**: Test ring creation when ring insert fails.

**Test Steps**:
1. Arrange: Mock authentication and validation to succeed
2. Arrange: Mock ring name existence check to return false
3. Arrange: Mock ring creation to throw error
4. Act: Call `createRingWithMembership('New Ring', userId)`
5. Assert: Verify error is caught and handled
6. Assert: Verify transaction rollback is called
7. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to create Ring. Please try again."

**Mock Verification**:
- Transaction rollback called
- No partial data saved

---

### TC-CREATE-RING-012: Ring Creation - Membership Creation Error
**Description**: Test ring creation when membership creation fails.

**Test Steps**:
1. Arrange: Mock authentication and validation to succeed
2. Arrange: Mock ring name existence check to return false
3. Arrange: Mock ring creation to succeed
4. Arrange: Mock membership creation to throw error
5. Act: Call `createRingWithMembership('New Ring', userId)`
6. Assert: Verify error is caught and handled
7. Assert: Verify transaction rollback is called
8. Assert: Verify ring is not created (transaction rollback)

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to create Ring. Please try again."

**Mock Verification**:
- Transaction rollback called
- Ring creation rolled back

---

### TC-CREATE-RING-013: Ring Creation - Transaction Rollback on Error
**Description**: Test that transaction is rolled back if any step fails.

**Test Steps**:
1. Arrange: Mock transaction begin
2. Arrange: Mock ring name check to succeed
3. Arrange: Mock ring creation to succeed
4. Arrange: Mock membership creation to fail
5. Act: Call `createRingWithMembership('New Ring', userId)`
6. Assert: Verify transaction rollback is called
7. Assert: Verify no partial data is saved

**Mock Verification**:
- Transaction begin called
- Transaction rollback called on error
- No ring or membership records created

---

### TC-CREATE-RING-014: Ring Creation - Creator Automatically Becomes Member
**Description**: Test that ring creator is automatically added as member.

**Test Steps**:
1. Arrange: Mock all dependencies for successful creation
2. Act: Call `createRingWithMembership('New Ring', userId)`
3. Assert: Verify membership is created with creator's user_id
4. Assert: Verify membership is created with new ring's ring_id
5. Assert: Verify creator can immediately access the ring

**Expected Output**:
- Membership record created linking creator to new ring
- Creator can view and post in ring immediately

---

### TC-CREATE-RING-015: Ring Creation - Ring Name Case Sensitivity
**Description**: Test ring name uniqueness with case variations.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock existing ring with name "Tech"
3. Arrange: Mock ring name existence check (case-sensitive)
4. Act: Call `createRingWithMembership('tech', userId)` (lowercase)
5. Assert: Verify behavior matches specification (case-sensitive or case-insensitive)

**Note**: Test both scenarios - database unique constraint may be case-sensitive or case-insensitive.

---

### TC-CREATE-RING-016: Ring Creation - SQL Injection Prevention
**Description**: Test that ring name prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock database with parameterized query verification
3. Act: Call `createRingWithMembership("'; DROP TABLE rings; --", userId)`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as ring name
6. Assert: Verify database is not compromised

**Expected Output**:
- Status: 201 Created or 400 Bad Request (depending on validation)
- SQL injection attempt treated as literal string
- No database damage

---

### TC-CREATE-RING-017: Ring Creation - Concurrent Creation with Same Name
**Description**: Test handling of concurrent ring creation with same name.

**Test Steps**:
1. Arrange: Mock database to simulate race condition
2. Arrange: First creation check returns false (name available)
3. Arrange: Second creation check returns false (name available)
4. Arrange: First insert succeeds
5. Arrange: Second insert fails with unique constraint violation
6. Act: Simulate two concurrent creation calls with same name
7. Assert: Verify first creation succeeds
8. Assert: Verify second creation fails with "Ring name already exists"

**Expected Output**:
- First creation: 201 Created
- Second creation: 400 Bad Request - "Ring name already exists"

**Mock Verification**:
- Database unique constraint prevents duplicate names
- Error handling converts constraint violation to user-friendly message

---

### TC-CREATE-RING-018: Ring Creation - Special Characters in Name
**Description**: Test ring creation with special characters in name.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock ring name with special characters: "Tech@Ring", "Tech-Ring", "Tech_Ring", "Tech Ring"
3. Act: Call `createRingWithMembership('Tech Ring', userId)`
4. Assert: Verify special characters are handled correctly
5. Assert: Verify name is stored as provided

**Expected Output**:
- Status: 201 Created
- Ring name stored with special characters preserved

---

### TC-CREATE-RING-019: Ring Creation - Unicode Characters in Name
**Description**: Test ring creation with Unicode characters.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock ring name with Unicode: "Café Ring", "北京 Ring", "🎵 Music"
3. Act: Call `createRingWithMembership('Café Ring', userId)`
4. Assert: Verify Unicode characters are handled correctly
5. Assert: Verify encoding is preserved

**Expected Output**:
- Status: 201 Created
- Unicode characters preserved in ring name

---

### TC-CREATE-RING-020: Ring Creation - Rate Limiting
**Description**: Test that ring creation endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 50 requests per minute per user
3. Act: Call ring creation endpoint 51 times rapidly
4. Assert: Verify first 50 requests succeed
5. Assert: Verify 51st request returns 429 Too Many Requests

**Expected Output**:
- First 50 requests: 201 Created
- 51st request: 429 Too Many Requests

---

### TC-CREATE-RING-021: Ring Creation - Created Timestamp
**Description**: Test that ring creation timestamp is set correctly.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Arrange: Mock current timestamp
3. Act: Call `createRingWithMembership('New Ring', userId)`
4. Assert: Verify created_at timestamp is set to current time
5. Assert: Verify timestamp is in correct format

**Expected Output**:
- Ring created_at set to current timestamp
- Timestamp format is ISO 8601 or PostgreSQL TIMESTAMP

---

### TC-CREATE-RING-022: Ring Creation - Ring ID Generation
**Description**: Test that ring ID is generated correctly (UUID).

**Test Steps**:
1. Arrange: Mock all dependencies
2. Act: Call `createRingWithMembership('New Ring', userId)`
3. Assert: Verify ring ID is generated (UUID format)
4. Assert: Verify ID is unique
5. Assert: Verify ID is included in response

**Expected Output**:
- Ring id is valid UUID
- ID is unique for each ring
