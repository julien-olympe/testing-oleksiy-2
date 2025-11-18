# Create Ring Test Specification

## Test File: `create-ring.test.ts`

### Purpose
Tests for Create Ring use case (3.5) covering successful ring creation, validation failures, duplicate ring names, boundary conditions, and automatic membership.

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

**Valid Ring Names**:
```typescript
const validRingNames = {
  minLength: 'A', // 1 character
  maxLength: 'A'.repeat(100), // 100 characters
  normal: 'My Awesome Ring',
  withNumbers: 'Ring123',
  withUnderscores: 'My_Ring_Name',
  withSpaces: 'Ring With Spaces'
};
```

**Invalid Ring Names**:
```typescript
const invalidRingNames = {
  empty: '',
  tooLong: 'A'.repeat(101), // 101 characters
  missing: undefined,
  null: null
};
```

### Test Cases

#### Test 1: Successful Ring Creation - Happy Path
**Test Name**: `should successfully create ring with valid name`

**Description**: Verifies that authenticated user can create a new Ring with valid name.

**Test Steps**:
1. Authenticate as user
2. Send POST request to `/api/rings` with valid ring name
3. Verify response status code is 201 Created
4. Verify ring is created in database
5. Verify user is automatically added as member
6. Verify ring data is returned

**Expected Results**:
- HTTP status code: 201 Created
- Response body contains ring data (id, name, creator_id, created_at)
- Ring record exists in database
- Membership record exists linking user to ring
- User is automatically a member of the created ring

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.ring).toBeDefined();
expect(response.body.ring.id).toBeDefined();
expect(response.body.ring.name).toBe(validRingNames.normal);
expect(response.body.ring.creator_id).toBe(user.id);
expect(response.body.ring.created_at).toBeDefined();

// Verify ring in database
const dbRing = await getRingFromDB(response.body.ring.id);
expect(dbRing).toBeDefined();
expect(dbRing.name).toBe(validRingNames.normal);
expect(dbRing.creator_id).toBe(user.id);

// Verify automatic membership
const membership = await getMembership(user.id, response.body.ring.id);
expect(membership).toBeDefined();
expect(membership.user_id).toBe(user.id);
expect(membership.ring_id).toBe(response.body.ring.id);
```

#### Test 2: Ring Name Validation - Minimum Length
**Test Name**: `should create ring with minimum length name (1 character)`

**Description**: Verifies that ring name with exactly 1 character is accepted.

**Test Steps**:
1. Send POST request with ring name of exactly 1 character
2. Verify ring is created successfully

**Expected Results**:
- HTTP status code: 201 Created
- Ring is created with 1-character name

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.ring.name).toBe('A');
expect(response.body.ring.name.length).toBe(1);
```

#### Test 3: Ring Name Validation - Maximum Length
**Test Name**: `should create ring with maximum length name (100 characters)`

**Description**: Verifies that ring name with exactly 100 characters is accepted.

**Test Steps**:
1. Send POST request with ring name of exactly 100 characters
2. Verify ring is created successfully

**Expected Results**:
- HTTP status code: 201 Created
- Ring is created with 100-character name

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.ring.name.length).toBe(100);
expect(response.body.ring.name).toBe('A'.repeat(100));
```

#### Test 4: Ring Name Validation - Too Short
**Test Name**: `should reject ring creation with empty name`

**Description**: Verifies that ring creation with empty name is rejected.

**Test Steps**:
1. Send POST request with empty ring name
2. Verify creation fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Ring name must be between 1 and 100 characters."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('between 1 and 100 characters');
```

#### Test 5: Ring Name Validation - Too Long
**Test Name**: `should reject ring creation with name longer than 100 characters`

**Description**: Verifies that ring creation with name longer than 100 characters is rejected.

**Test Steps**:
1. Send POST request with ring name of 101 characters
2. Verify creation fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Ring name must be between 1 and 100 characters."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toContain('between 1 and 100 characters');
```

#### Test 6: Duplicate Ring Name
**Test Name**: `should reject ring creation with duplicate name`

**Description**: Verifies that ring creation with existing ring name is rejected.

**Test Steps**:
1. Create first ring with name 'MyRing'
2. Attempt to create second ring with same name 'MyRing'
3. Verify second creation fails

**Expected Results**:
- First creation: HTTP status code 201 Created
- Second creation: HTTP status code 400 Bad Request
- Error message: "Ring name already exists. Please choose a different name."

**Assertions**:
```typescript
// First creation
expect(firstResponse.status).toBe(201);

// Second creation
expect(secondResponse.status).toBe(400);
expect(secondResponse.body.error).toBe('Ring name already exists. Please choose a different name.');
```

#### Test 7: Duplicate Ring Name - Case Sensitivity
**Test Name**: `should handle ring name case sensitivity for duplicates`

**Description**: Verifies that ring name uniqueness is case-sensitive (or case-insensitive if specified).

**Test Steps**:
1. Create ring with name 'MyRing'
2. Attempt to create ring with name 'myring' (lowercase)
3. Verify behavior matches specification

**Expected Results**:
- If case-sensitive: Second creation fails (duplicate)
- If case-insensitive: Second creation fails (duplicate)

**Assertions**:
```typescript
// Assuming case-sensitive uniqueness
const firstResponse = await createRing(userToken, 'MyRing');
expect(firstResponse.status).toBe(201);

const secondResponse = await createRing(userToken, 'myring');
// Should fail if case-sensitive, or succeed if case-insensitive
// Based on specification
```

#### Test 8: Automatic Membership Creation
**Test Name**: `should automatically add creator as member of created ring`

**Description**: Verifies that ring creator is automatically added as member upon ring creation.

**Test Steps**:
1. Create ring
2. Verify membership record exists
3. Verify membership joined_at timestamp is set

**Expected Results**:
- Membership record exists in database
- Membership user_id matches creator
- Membership ring_id matches created ring
- joined_at timestamp is set

**Assertions**:
```typescript
const membership = await getMembership(user.id, ring.id);
expect(membership).toBeDefined();
expect(membership.user_id).toBe(user.id);
expect(membership.ring_id).toBe(ring.id);
expect(membership.joined_at).toBeDefined();
expect(new Date(membership.joined_at).getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 9: Creator ID Assignment
**Test Name**: `should set creator_id to authenticated user's id`

**Description**: Verifies that ring creator_id is set to the authenticated user who created it.

**Test Steps**:
1. Authenticate as user1
2. Create ring
3. Verify creator_id is user1.id

**Expected Results**:
- Ring creator_id matches authenticated user's id

**Assertions**:
```typescript
expect(response.body.ring.creator_id).toBe(user1.id);
const dbRing = await getRingFromDB(response.body.ring.id);
expect(dbRing.creator_id).toBe(user1.id);
```

#### Test 10: Created At Timestamp
**Test Name**: `should set created_at timestamp on ring creation`

**Description**: Verifies that ring created_at timestamp is set upon creation.

**Test Steps**:
1. Create ring
2. Verify created_at timestamp is set
3. Verify timestamp is close to current time

**Expected Results**:
- created_at timestamp is set
- Timestamp is close to current time

**Assertions**:
```typescript
expect(response.body.ring.created_at).toBeDefined();
const createdAt = new Date(response.body.ring.created_at);
expect(createdAt.getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 11: Missing Ring Name Field
**Test Name**: `should reject ring creation with missing name field`

**Description**: Verifies that ring creation without name field is rejected.

**Test Steps**:
1. Send POST request without name field
2. Verify creation fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates missing required field

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 12: Authentication Required
**Test Name**: `should require authentication to create ring`

**Description**: Verifies that unauthenticated ring creation requests are rejected.

**Test Steps**:
1. Send POST request to `/api/rings` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 13: Database Transaction - Atomicity
**Test Name**: `should create ring and membership in single transaction`

**Description**: Verifies that ring creation and membership creation are atomic (both succeed or both fail).

**Test Steps**:
1. Simulate failure after ring creation but before membership creation
2. Verify transaction is rolled back
3. Verify no partial data is created

**Expected Results**:
- If membership creation fails, ring creation is rolled back
- No orphaned ring records exist
- Database state remains consistent

**Assertions**:
```typescript
// Simulate failure scenario
// Verify no ring or membership is created
const ringCount = await getRingCount(ringName);
const membershipCount = await getMembershipCount(user.id, ringId);
expect(ringCount).toBe(0);
expect(membershipCount).toBe(0);
```

#### Test 14: Ring Name With Special Characters
**Test Name**: `should handle special characters in ring name safely`

**Description**: Verifies that ring names with special characters are handled safely (prevents SQL injection).

**Test Steps**:
1. Attempt to create ring with SQL injection payload in name
2. Verify creation fails with validation error (not SQL error)
3. Verify no SQL injection occurs

**Expected Results**:
- Creation fails with validation error
- No SQL injection occurs
- Database remains secure

**Assertions**:
```typescript
const sqlInjectionName = "'; DROP TABLE rings; --";
const response = await createRing(userToken, sqlInjectionName);
expect(response.status).toBe(400); // Validation error, not SQL error
// Verify rings table still exists
const tableExists = await checkTableExists('rings');
expect(tableExists).toBe(true);
```

#### Test 15: Multiple Rings Creation
**Test Name**: `should allow user to create multiple rings`

**Description**: Verifies that user can create multiple rings with different names.

**Test Steps**:
1. Create first ring
2. Create second ring with different name
3. Verify both rings are created
4. Verify user is member of both rings

**Expected Results**:
- Both rings are created successfully
- User is member of both rings
- Rings have different names

**Assertions**:
```typescript
const ring1 = await createRing(userToken, 'Ring1');
const ring2 = await createRing(userToken, 'Ring2');

expect(ring1.status).toBe(201);
expect(ring2.status).toBe(201);
expect(ring1.body.ring.name).not.toBe(ring2.body.ring.name);

const memberships = await getUserMemberships(user.id);
expect(memberships.length).toBe(2);
```

### Error Handling Tests

#### Test 16: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to create ring
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

#### Test 17: Foreign Key Constraint - Invalid Creator
**Test Name**: `should handle invalid creator_id gracefully`

**Description**: Verifies that ring creation with invalid creator_id is prevented (should not happen with proper authentication, but test for robustness).

**Test Steps**:
1. Attempt to create ring with non-existent creator_id
2. Verify creation fails

**Expected Results**:
- HTTP status code: 400 Bad Request or 500 Internal Server Error
- Error message indicates invalid creator

**Assertions**:
```typescript
// This should not happen with proper authentication, but test for robustness
expect(response.status).toBeGreaterThanOrEqual(400);
expect(response.body.error).toBeDefined();
```

### Notes
- Ring name must be unique across all rings
- Ring name must be between 1 and 100 characters
- Creator is automatically added as member upon ring creation
- Ring creation and membership creation must be atomic (single transaction)
- Performance requirement: Ring creation should complete quickly (< 1 second)
