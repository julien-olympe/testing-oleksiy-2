# Join Ring Test Specification

## Test File: `join-ring.test.ts`

### Purpose
Tests for Join Ring use case (3.12) covering successful ring joining, duplicate membership prevention, authorization, and automatic access granting.

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
```

**Test Rings**:
```typescript
const ring1 = { id: uuid(), name: 'Test Ring', creator_id: user1.id };
const ring2 = { id: uuid(), name: 'Another Ring', creator_id: user2.id };
```

**Test Memberships**:
```typescript
// user1 is creator/member of ring1
// user2 is creator/member of ring2
// user1 is NOT a member of ring2
```

### Test Cases

#### Test 1: Successful Ring Join - Happy Path
**Test Name**: `should successfully join ring for non-member user`

**Description**: Verifies that authenticated user can join a ring they are not a member of.

**Test Steps**:
1. Create ring with user1 as creator
2. Authenticate as user2 (not a member)
3. Send POST request to `/api/rings/:ringId/join`
4. Verify response status code is 201 Created
5. Verify membership is created in database
6. Verify success message is returned
7. Verify user2 gains access to ring

**Expected Results**:
- HTTP status code: 201 Created
- Response body contains success message: "You have joined '[Ring name]'."
- Membership record exists in database
- User2 is now a member of ring1
- User2 can access ring chat
- User2 sees posts from ring in news feed

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.message).toBe(`You have joined '${ring1.name}'.`);
expect(response.body.ring).toBeDefined();
expect(response.body.ring.isMember).toBe(true);

// Verify membership in database
const membership = await getMembership(user2.id, ring1.id);
expect(membership).toBeDefined();
expect(membership.user_id).toBe(user2.id);
expect(membership.ring_id).toBe(ring1.id);
expect(membership.joined_at).toBeDefined();
```

#### Test 2: Joined User Gains Access
**Test Name**: `should grant joined user access to ring chat`

**Description**: Verifies that joined user can immediately access ring chat.

**Test Steps**:
1. Create ring with posts
2. Join ring as user2
3. Authenticate as user2
4. Retrieve ring chat
5. Verify access is granted

**Expected Results**:
- User2 can access ring chat
- User2 can view posts in ring

**Assertions**:
```typescript
await joinRing(user2Token, ring1.id);
const chatResponse = await getRingChat(user2Token, ring1.id);
expect(chatResponse.status).toBe(200);
expect(chatResponse.body.ring.id).toBe(ring1.id);
```

#### Test 3: Joined User Sees Posts in News Feed
**Test Name**: `should make ring posts visible to joined user in news feed`

**Description**: Verifies that joined user sees posts from the ring in their news feed.

**Test Steps**:
1. Create posts in ring1
2. Join ring1 as user2
3. Retrieve news feed for user2
4. Verify posts from ring1 appear in news feed

**Expected Results**:
- Posts from ring1 appear in user2's news feed
- News feed includes posts created before user joined

**Assertions**:
```typescript
const post = await createPost(user1Token, ring1.id, { message_text: 'Test post' });
await joinRing(user2Token, ring1.id);
const feedResponse = await getNewsFeed(user2Token);

expect(feedResponse.body.newsFeed.some(tile => tile.ringId === ring1.id)).toBe(true);
```

#### Test 4: Duplicate Membership Prevention
**Test Name**: `should reject join request for user who is already a member`

**Description**: Verifies that joining a ring when already a member is rejected.

**Test Steps**:
1. Add user2 to ring1 (or user2 is already creator)
2. Attempt to join ring1 again as user2
3. Verify join fails

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "You are already a member of this Ring."

**Assertions**:
```typescript
// First join (or user is already member)
await joinRing(user2Token, ring1.id);

// Second join (duplicate)
const response = await joinRing(user2Token, ring1.id);
expect(response.status).toBe(400);
expect(response.body.error).toBe('You are already a member of this Ring.');
```

#### Test 5: Join Button Disappears
**Test Name**: `should update ring membership status after joining`

**Description**: Verifies that ring membership status is updated after joining (isMember becomes true).

**Test Steps**:
1. Search for ring (isMember: false)
2. Join ring
3. Search for ring again
4. Verify isMember is now true

**Expected Results**:
- Before join: isMember is false
- After join: isMember is true
- Join button should not be shown (in UI)

**Assertions**:
```typescript
// Before join
const beforeResponse = await findRing(user2Token, ring1.name);
const beforeRing = beforeResponse.body.rings.find(r => r.id === ring1.id);
expect(beforeRing.isMember).toBe(false);

// Join ring
await joinRing(user2Token, ring1.id);

// After join
const afterResponse = await findRing(user2Token, ring1.name);
const afterRing = afterResponse.body.rings.find(r => r.id === ring1.id);
expect(afterRing.isMember).toBe(true);
```

#### Test 6: Authentication Required
**Test Name**: `should require authentication to join ring`

**Description**: Verifies that unauthenticated join requests are rejected.

**Test Steps**:
1. Send POST request to `/api/rings/:ringId/join` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 7: Invalid Ring ID
**Test Name**: `should return error for non-existent ring`

**Description**: Verifies that joining non-existent ring returns appropriate error.

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
const response = await joinRing(userToken, nonExistentRingId);
expect(response.status).toBe(404);
expect(response.body.error).toBeDefined();
```

#### Test 8: Joined At Timestamp
**Test Name**: `should set joined_at timestamp on membership creation`

**Description**: Verifies that membership joined_at timestamp is set upon joining.

**Test Steps**:
1. Join ring
2. Verify joined_at timestamp is set
3. Verify timestamp is close to current time

**Expected Results**:
- joined_at timestamp is set
- Timestamp is close to current time

**Assertions**:
```typescript
await joinRing(user2Token, ring1.id);
const membership = await getMembership(user2.id, ring1.id);
expect(membership.joined_at).toBeDefined();
const joinedAt = new Date(membership.joined_at);
expect(joinedAt.getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 9: Multiple Rings Join
**Test Name**: `should allow user to join multiple rings`

**Description**: Verifies that user can join multiple rings.

**Test Steps**:
1. Join ring1
2. Join ring2
3. Verify both memberships are created

**Expected Results**:
- Both rings are joined successfully
- Both memberships exist in database

**Assertions**:
```typescript
const response1 = await joinRing(user2Token, ring1.id);
const response2 = await joinRing(user2Token, ring2.id);

expect(response1.status).toBe(201);
expect(response2.status).toBe(201);

const membership1 = await getMembership(user2.id, ring1.id);
const membership2 = await getMembership(user2.id, ring2.id);
expect(membership1).toBeDefined();
expect(membership2).toBeDefined();
```

#### Test 10: Member Count Update
**Test Name**: `should update member count after joining`

**Description**: Verifies that ring member count is updated after user joins.

**Test Steps**:
1. Get initial member count
2. Join ring
3. Get updated member count
4. Verify count increased by 1

**Expected Results**:
- Member count increases by 1 after joining

**Assertions**:
```typescript
const beforeCount = await getMemberCount(ring1.id);
await joinRing(user2Token, ring1.id);
const afterCount = await getMemberCount(ring1.id);
expect(afterCount).toBe(beforeCount + 1);
```

#### Test 11: Join Confirmation Message
**Test Name**: `should return confirmation message with ring name`

**Description**: Verifies that join response includes confirmation message with ring name.

**Test Steps**:
1. Join ring
2. Verify response includes confirmation message
3. Verify message contains ring name

**Expected Results**:
- Response includes message field
- Message contains ring name

**Assertions**:
```typescript
expect(response.body.message).toBeDefined();
expect(response.body.message).toContain(ring1.name);
expect(response.body.message).toBe(`You have joined '${ring1.name}'.`);
```

### Error Handling Tests

#### Test 12: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to join ring
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: "Unable to join Ring. Please try again."

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBe('Unable to join Ring. Please try again.');
```

#### Test 13: Unique Constraint - Duplicate Membership
**Test Name**: `should prevent duplicate memberships at database level`

**Description**: Verifies that database unique constraint prevents duplicate memberships.

**Test Steps**:
1. Join ring
2. Attempt to create duplicate membership directly in database
3. Verify constraint violation is handled

**Expected Results**:
- Duplicate membership creation fails
- Database constraint is enforced

**Assertions**:
```typescript
await joinRing(user2Token, ring1.id);
// Attempt to create duplicate membership
await expect(createMembershipDirectly(user2.id, ring1.id)).rejects.toThrow();
```

#### Test 14: Foreign Key Constraint - Invalid Ring
**Test Name**: `should handle invalid ring_id gracefully`

**Description**: Verifies that membership creation with invalid ring_id is prevented.

**Test Steps**:
1. Attempt to join non-existent ring
2. Verify join fails

**Expected Results**:
- HTTP status code: 404 Not Found
- Error message indicates ring not found

**Assertions**:
```typescript
const nonExistentRingId = uuid();
const response = await joinRing(userToken, nonExistentRingId);
expect(response.status).toBe(404);
expect(response.body.error).toBeDefined();
```

### Notes
- User must not already be a member to join
- Joining a ring immediately grants access to ring chat and news feed
- Membership status (isMember) is updated after joining
- Member count is updated after joining
- Confirmation message: "You have joined '[Ring name]'."
- Error message for duplicate: "You are already a member of this Ring."
- Error message for failure: "Unable to join Ring. Please try again."
