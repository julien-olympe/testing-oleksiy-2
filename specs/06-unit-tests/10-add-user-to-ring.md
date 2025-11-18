# Add User to Ring Test Specification

## Test File: `add-user-to-ring.test.ts`

### Purpose
Tests for Add User to Ring use case (3.10) covering successful user addition, validation failures, authorization, duplicate memberships, and non-existent users.

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
  // Create test users
  // Create test rings
  // Create test memberships
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

**Test Users**:
```typescript
const user1 = { id: uuid(), username: 'user1', passwordHash: 'hash1' };
const user2 = { id: uuid(), username: 'user2', passwordHash: 'hash2' };
const user3 = { id: uuid(), username: 'user3', passwordHash: 'hash3' };
const nonExistentUser = { username: 'nonexistent' };
```

**Test Rings**:
```typescript
const ring1 = { id: uuid(), name: 'Test Ring', creator_id: user1.id };
```

**Test Memberships**:
```typescript
// user1 is member of ring1
const initialMembership = { user_id: user1.id, ring_id: ring1.id };
```

### Test Cases

#### Test 1: Successful User Addition - Happy Path
**Test Name**: `should successfully add user to ring`

**Description**: Verifies that authenticated member can add another user to a ring they are a member of.

**Test Steps**:
1. Create ring with user1 as member
2. Create user2 (not a member)
3. Authenticate as user1
4. Send POST request to `/api/rings/:id/members` with user2's username
5. Verify response status code is 201 Created
6. Verify membership is created in database
7. Verify success message is returned

**Expected Results**:
- HTTP status code: 201 Created
- Response body contains success message: "User '[username]' has been added to the Ring."
- Membership record exists in database
- User2 is now a member of ring1

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.message).toBe(`User '${user2.username}' has been added to the Ring.`);

// Verify membership in database
const membership = await getMembership(user2.id, ring1.id);
expect(membership).toBeDefined();
expect(membership.user_id).toBe(user2.id);
expect(membership.ring_id).toBe(ring1.id);
expect(membership.joined_at).toBeDefined();
```

#### Test 2: Added User Gains Access
**Test Name**: `should grant added user access to ring chat`

**Description**: Verifies that added user can immediately access ring chat.

**Test Steps**:
1. Add user2 to ring1
2. Authenticate as user2
3. Retrieve ring chat
4. Verify access is granted

**Expected Results**:
- User2 can access ring chat
- User2 can view posts in ring

**Assertions**:
```typescript
await addUserToRing(user1Token, ring1.id, user2.username);
const chatResponse = await getRingChat(user2Token, ring1.id);
expect(chatResponse.status).toBe(200);
expect(chatResponse.body.ring.id).toBe(ring1.id);
```

#### Test 3: Added User Sees Posts in News Feed
**Test Name**: `should make ring posts visible to added user in news feed`

**Description**: Verifies that added user sees posts from the ring in their news feed.

**Test Steps**:
1. Create posts in ring1
2. Add user2 to ring1
3. Retrieve news feed for user2
4. Verify posts from ring1 appear in news feed

**Expected Results**:
- Posts from ring1 appear in user2's news feed
- News feed includes posts created before user was added

**Assertions**:
```typescript
const post = await createPost(user1Token, ring1.id, { message_text: 'Test post' });
await addUserToRing(user1Token, ring1.id, user2.username);
const feedResponse = await getNewsFeed(user2Token);

expect(feedResponse.body.newsFeed.some(tile => tile.ringId === ring1.id)).toBe(true);
```

#### Test 4: Authorization - Non-Member Cannot Add Users
**Test Name**: `should deny user addition for non-members`

**Description**: Verifies that users who are not members of a ring cannot add other users.

**Test Steps**:
1. Create ring
2. Do not add user1 as member
3. Authenticate as user1
4. Attempt to add user2 to ring
5. Verify addition is denied

**Expected Results**:
- HTTP status code: 403 Forbidden
- Error message: "You are not a member of this Ring."

**Assertions**:
```typescript
expect(response.status).toBe(403);
expect(response.body.error).toBe('You are not a member of this Ring.');
```

#### Test 5: Non-Existent User
**Test Name**: `should reject addition of non-existent user`

**Description**: Verifies that adding a non-existent user is rejected.

**Test Steps**:
1. Authenticate as member
2. Attempt to add non-existent username
3. Verify addition fails

**Expected Results**:
- HTTP status code: 404 Not Found
- Error message: "User '[username]' not found."

**Assertions**:
```typescript
expect(response.status).toBe(404);
expect(response.body.error).toBe(`User '${nonExistentUser.username}' not found.`);
```

#### Test 6: Duplicate Membership
**Test Name**: `should reject addition of user who is already a member`

**Description**: Verifies that adding a user who is already a member is rejected.

**Test Steps**:
1. Add user2 to ring1
2. Attempt to add user2 to ring1 again
3. Verify addition fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "User '[username]' is already a member of this Ring."

**Assertions**:
```typescript
// First addition
const firstResponse = await addUserToRing(user1Token, ring1.id, user2.username);
expect(firstResponse.status).toBe(201);

// Second addition (duplicate)
const secondResponse = await addUserToRing(user1Token, ring1.id, user2.username);
expect(secondResponse.status).toBe(400);
expect(secondResponse.body.error).toBe(`User '${user2.username}' is already a member of this Ring.`);
```

#### Test 7: Adding Self
**Test Name**: `should reject addition of self to ring`

**Description**: Verifies that user cannot add themselves to a ring (if already a member, should fail with duplicate error).

**Test Steps**:
1. Authenticate as user1 (member of ring1)
2. Attempt to add user1 to ring1
3. Verify addition fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "User '[username]' is already a member of this Ring."

**Assertions**:
```typescript
const response = await addUserToRing(user1Token, ring1.id, user1.username);
expect(response.status).toBe(400);
expect(response.body.error).toContain('already a member');
```

#### Test 8: Empty Username
**Test Name**: `should reject addition with empty username`

**Description**: Verifies that adding user with empty username is rejected.

**Test Steps**:
1. Authenticate as member
2. Attempt to add user with empty username
3. Verify addition fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates validation failure

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 9: Missing Username Field
**Test Name**: `should reject addition with missing username field`

**Description**: Verifies that adding user without username field is rejected.

**Test Steps**:
1. Authenticate as member
2. Send POST request without username field
3. Verify addition fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message indicates missing required field

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBeDefined();
```

#### Test 10: Authentication Required
**Test Name**: `should require authentication to add user to ring`

**Description**: Verifies that unauthenticated requests are rejected.

**Test Steps**:
1. Send POST request to `/api/rings/:id/members` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 11: Invalid Ring ID
**Test Name**: `should return error for non-existent ring`

**Description**: Verifies that adding user to non-existent ring returns appropriate error.

**Test Steps**:
1. Authenticate as user
2. Send POST request with non-existent ring ID
3. Verify error response

**Expected Results**:
- HTTP status code: 404 Not Found
- Error message indicates ring not found

**Assertions**:
```typescript
const nonExistentRingId = uuid();
const response = await addUserToRing(userToken, nonExistentRingId, user2.username);
expect(response.status).toBe(404);
expect(response.body.error).toBeDefined();
```

#### Test 12: Joined At Timestamp
**Test Name**: `should set joined_at timestamp on membership creation`

**Description**: Verifies that membership joined_at timestamp is set upon creation.

**Test Steps**:
1. Add user to ring
2. Verify joined_at timestamp is set
3. Verify timestamp is close to current time

**Expected Results**:
- joined_at timestamp is set
- Timestamp is close to current time

**Assertions**:
```typescript
const membership = await getMembership(user2.id, ring1.id);
expect(membership.joined_at).toBeDefined();
const joinedAt = new Date(membership.joined_at);
expect(joinedAt.getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 13: Multiple Users Addition
**Test Name**: `should allow adding multiple users to ring`

**Description**: Verifies that multiple users can be added to a ring.

**Test Steps**:
1. Add user2 to ring1
2. Add user3 to ring1
3. Verify both memberships are created

**Expected Results**:
- Both users are added successfully
- Both memberships exist in database

**Assertions**:
```typescript
const response1 = await addUserToRing(user1Token, ring1.id, user2.username);
const response2 = await addUserToRing(user1Token, ring1.id, user3.username);

expect(response1.status).toBe(201);
expect(response2.status).toBe(201);

const membership2 = await getMembership(user2.id, ring1.id);
const membership3 = await getMembership(user3.id, ring1.id);
expect(membership2).toBeDefined();
expect(membership3).toBeDefined();
```

#### Test 14: Case Sensitivity - Username
**Test Name**: `should handle username case sensitivity correctly`

**Description**: Verifies that username matching is case-sensitive (or case-insensitive if specified).

**Test Steps**:
1. Create user with username 'TestUser'
2. Attempt to add user with 'testuser' (lowercase)
3. Verify behavior matches specification

**Expected Results**:
- Username matching follows specification (typically case-sensitive)
- Addition succeeds only with exact case match (if case-sensitive)

**Assertions**:
```typescript
// Assuming case-sensitive usernames
const response = await addUserToRing(user1Token, ring1.id, 'testuser'); // Different case
expect(response.status).toBe(404); // Should fail if case-sensitive
```

### Error Handling Tests

#### Test 15: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to add user to ring
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

#### Test 16: Foreign Key Constraint - Invalid User
**Test Name**: `should handle invalid user_id gracefully`

**Description**: Verifies that membership creation with invalid user_id is prevented (should not happen with proper validation, but test for robustness).

**Test Steps**:
1. Attempt to create membership with non-existent user_id
2. Verify creation fails

**Expected Results**:
- HTTP status code: 404 Not Found or 400 Bad Request
- Error message indicates user not found

**Assertions**:
```typescript
// This should not happen with proper validation, but test for robustness
expect(response.status).toBeGreaterThanOrEqual(400);
expect(response.body.error).toBeDefined();
```

#### Test 17: Unique Constraint - Duplicate Membership
**Test Name**: `should prevent duplicate memberships at database level`

**Description**: Verifies that database unique constraint prevents duplicate memberships.

**Test Steps**:
1. Add user to ring
2. Attempt to create duplicate membership directly in database
3. Verify constraint violation is handled

**Expected Results**:
- Duplicate membership creation fails
- Database constraint is enforced

**Assertions**:
```typescript
await addUserToRing(user1Token, ring1.id, user2.username);
// Attempt to create duplicate membership
await expect(createMembershipDirectly(user2.id, ring1.id)).rejects.toThrow();
```

### Notes
- Only members of the ring can add other users
- User must exist in database to be added
- User cannot be added if already a member (duplicate prevention)
- Added user immediately gains access to ring chat and sees posts in news feed
- Membership creation must be atomic (single transaction)
- Username matching is case-sensitive (typically)
