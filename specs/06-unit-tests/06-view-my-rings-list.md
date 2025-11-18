# View My Rings List Test Specification

## Test File: `view-my-rings-list.test.ts`

### Purpose
Tests for View My Rings List use case (3.6) covering successful list retrieval, empty states, member count calculation, and ring name truncation.

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

**Test Rings**:
```typescript
const ring1 = { id: uuid(), name: 'Short Name', creator_id: user1.id };
const ring2 = { id: uuid(), name: 'A'.repeat(20), creator_id: user2.id }; // Exactly 20 chars
const ring3 = { id: uuid(), name: 'A'.repeat(100), creator_id: user3.id }; // Long name
const ring4 = { id: uuid(), name: 'Another Ring', creator_id: user1.id };
```

**Test Memberships**:
```typescript
const memberships = [
  { user_id: user1.id, ring_id: ring1.id },
  { user_id: user1.id, ring_id: ring2.id },
  { user_id: user1.id, ring_id: ring3.id },
  { user_id: user2.id, ring_id: ring1.id }, // ring1 has 2 members
  { user_id: user3.id, ring_id: ring1.id } // ring1 has 3 members
];
```

### Test Cases

#### Test 1: Successful Rings List Retrieval - Happy Path
**Test Name**: `should return list of all rings user is a member of`

**Description**: Verifies that authenticated user receives list of all Rings they are a member of.

**Test Steps**:
1. Create user with memberships in multiple rings
2. Authenticate as user
3. Send GET request to `/api/my-rings`
4. Verify response contains all user's rings
5. Verify each ring item contains required fields

**Expected Results**:
- HTTP status code: 200 OK
- Response contains array of ring items
- Each ring item contains: ring id, ring name (ellipsized to 20 chars if longer), member count
- All user's rings are included

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.rings).toBeDefined();
expect(Array.isArray(response.body.rings)).toBe(true);
expect(response.body.rings.length).toBeGreaterThan(0);

response.body.rings.forEach(ring => {
  expect(ring.id).toBeDefined();
  expect(ring.name).toBeDefined();
  expect(ring.memberCount).toBeDefined();
  expect(typeof ring.memberCount).toBe('number');
});
```

#### Test 2: Ring Name Truncation - Longer Than 20 Characters
**Test Name**: `should truncate ring name to 20 characters with ellipsis if longer`

**Description**: Verifies that ring names longer than 20 characters are truncated to 20 characters with ellipsis.

**Test Steps**:
1. Create ring with name longer than 20 characters
2. Add user as member
3. Retrieve my rings list
4. Verify ring name is truncated to 20 characters

**Expected Results**:
- Ring name is truncated to 20 characters
- Ellipsis is added if name is longer than 20 characters

**Assertions**:
```typescript
const longNameRing = response.body.rings.find(r => r.id === ring3.id);
expect(longNameRing.name.length).toBeLessThanOrEqual(20);
if (ring3.name.length > 20) {
  expect(longNameRing.name.endsWith('...')).toBe(true);
  expect(longNameRing.name.length).toBe(20);
}
```

#### Test 3: Ring Name - Exactly 20 Characters
**Test Name**: `should include full ring name when exactly 20 characters`

**Description**: Verifies that ring name exactly 20 characters is included without truncation.

**Test Steps**:
1. Create ring with name exactly 20 characters
2. Add user as member
3. Retrieve my rings list
4. Verify ring name is exactly 20 characters (no truncation)

**Expected Results**:
- Ring name is exactly 20 characters
- No truncation occurs
- No ellipsis is added

**Assertions**:
```typescript
const exact20Ring = response.body.rings.find(r => r.id === ring2.id);
expect(exact20Ring.name.length).toBe(20);
expect(exact20Ring.name).toBe('A'.repeat(20));
expect(exact20Ring.name.endsWith('...')).toBe(false);
```

#### Test 4: Ring Name - Less Than 20 Characters
**Test Name**: `should include full ring name when less than 20 characters`

**Description**: Verifies that ring name less than 20 characters is included in full.

**Test Steps**:
1. Create ring with name less than 20 characters
2. Add user as member
3. Retrieve my rings list
4. Verify ring name matches original name

**Expected Results**:
- Ring name matches original name
- No truncation occurs
- No ellipsis is added

**Assertions**:
```typescript
const shortNameRing = response.body.rings.find(r => r.id === ring1.id);
expect(shortNameRing.name).toBe('Short Name');
expect(shortNameRing.name.length).toBeLessThan(20);
expect(shortNameRing.name.endsWith('...')).toBe(false);
```

#### Test 5: Member Count Calculation
**Test Name**: `should calculate correct member count for each ring`

**Description**: Verifies that member count is correctly calculated for each ring.

**Test Steps**:
1. Create rings with different numbers of members
2. Add user as member of multiple rings
3. Retrieve my rings list
4. Verify member count is correct for each ring

**Expected Results**:
- Member count matches actual number of members in each ring
- Member count is accurate

**Assertions**:
```typescript
const ring1Item = response.body.rings.find(r => r.id === ring1.id);
expect(ring1Item.memberCount).toBe(3); // ring1 has 3 members

const ring2Item = response.body.rings.find(r => r.id === ring2.id);
expect(ring2Item.memberCount).toBe(1); // ring2 has 1 member
```

#### Test 6: Member Count - Single Member
**Test Name**: `should show member count of 1 for ring with only creator`

**Description**: Verifies that ring with only creator shows member count of 1.

**Test Steps**:
1. Create ring (creator is automatically member)
2. Do not add any other members
3. Retrieve my rings list
4. Verify member count is 1

**Expected Results**:
- Member count is 1 (creator is counted)

**Assertions**:
```typescript
const singleMemberRing = response.body.rings.find(r => r.id === newRing.id);
expect(singleMemberRing.memberCount).toBe(1);
```

#### Test 7: Member Count - Multiple Members
**Test Name**: `should show correct member count for ring with multiple members`

**Description**: Verifies that ring with multiple members shows correct count.

**Test Steps**:
1. Create ring
2. Add multiple members to ring
3. Retrieve my rings list
4. Verify member count matches number of members

**Expected Results**:
- Member count matches actual number of members

**Assertions**:
```typescript
// Add 5 members to ring
await addMemberToRing(ring.id, user2.id);
await addMemberToRing(ring.id, user3.id);
await addMemberToRing(ring.id, user4.id);
await addMemberToRing(ring.id, user5.id);
await addMemberToRing(ring.id, user6.id);

const response = await getMyRings(user1Token);
const ringItem = response.body.rings.find(r => r.id === ring.id);
expect(ringItem.memberCount).toBe(6); // Creator + 5 added members
```

#### Test 8: Empty Rings List
**Test Name**: `should return empty list when user has no rings`

**Description**: Verifies that user with no Rings receives empty list with appropriate message.

**Test Steps**:
1. Create user with no Rings (no memberships)
2. Authenticate as user
3. Send GET request to `/api/my-rings`
4. Verify empty state response

**Expected Results**:
- HTTP status code: 200 OK
- Rings array is empty
- Empty state message: "You haven't joined any Rings yet. Create or find a Ring to get started."

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.rings).toBeDefined();
expect(Array.isArray(response.body.rings)).toBe(true);
expect(response.body.rings.length).toBe(0);
expect(response.body.emptyMessage).toBe("You haven't joined any Rings yet. Create or find a Ring to get started.");
```

#### Test 9: Only User's Rings
**Test Name**: `should return only rings user is a member of`

**Description**: Verifies that list only includes rings where user has membership.

**Test Steps**:
1. Create multiple rings
2. Add user as member of some rings only
3. Retrieve my rings list
4. Verify only rings with membership are included

**Expected Results**:
- List contains only rings user is a member of
- Rings without membership are excluded

**Assertions**:
```typescript
const ringIds = response.body.rings.map(r => r.id);
const userMemberships = await getUserMemberships(user.id);
const membershipRingIds = userMemberships.map(m => m.ring_id);

expect(ringIds.length).toBe(membershipRingIds.length);
ringIds.forEach(ringId => {
  expect(membershipRingIds).toContain(ringId);
});
```

#### Test 10: Ring Ordering
**Test Name**: `should return rings in consistent order`

**Description**: Verifies that rings are returned in consistent order (may be alphabetical, by creation date, or by join date).

**Test Steps**:
1. Create multiple rings
2. Add user as member
3. Retrieve my rings list multiple times
4. Verify order is consistent

**Expected Results**:
- Rings are returned in consistent order
- Order does not change between requests

**Assertions**:
```typescript
const response1 = await getMyRings(userToken);
const response2 = await getMyRings(userToken);

const ringIds1 = response1.body.rings.map(r => r.id);
const ringIds2 = response2.body.rings.map(r => r.id);

expect(ringIds1).toEqual(ringIds2);
```

#### Test 11: Authentication Required
**Test Name**: `should require authentication to view my rings list`

**Description**: Verifies that unauthenticated requests are rejected.

**Test Steps**:
1. Send GET request to `/api/my-rings` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 12: Invalid Authentication Token
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
const response = await fetch('/api/my-rings', {
  headers: { 'Authorization': 'Bearer invalid_token' }
});
expect(response.status).toBe(401);
```

### Error Handling Tests

#### Test 13: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to retrieve my rings list
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

#### Test 14: Performance - Many Rings
**Test Name**: `should handle user with many rings efficiently`

**Description**: Verifies that list retrieval is efficient for users with many rings.

**Test Steps**:
1. Create user with 50+ rings
2. Retrieve my rings list
3. Measure response time
4. Verify response time is reasonable

**Expected Results**:
- Response time is reasonable (< 2 seconds)
- List is returned successfully

**Assertions**:
```typescript
const startTime = Date.now();
const response = await getMyRings(userToken);
const responseTime = Date.now() - startTime;

expect(response.status).toBe(200);
expect(responseTime).toBeLessThan(2000); // 2 seconds
```

### Notes
- Ring names are truncated to 20 characters with ellipsis if longer
- Member count includes all members of the ring (creator + added members)
- Empty state message: "You haven't joined any Rings yet. Create or find a Ring to get started."
- Only rings where user has membership are included
- Performance should be efficient even for users with many rings
