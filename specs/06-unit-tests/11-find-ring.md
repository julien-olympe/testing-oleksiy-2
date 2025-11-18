# Find Ring (Search) Test Specification

## Test File: `find-ring.test.ts`

### Purpose
Tests for Find Ring use case (3.11) covering search functionality, matching rings, membership status, case-insensitive search, and empty queries.

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
  // Create test rings with various names
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

**Test Rings with Various Names**:
```typescript
const ring1 = { id: uuid(), name: 'JavaScript Developers', creator_id: user1.id };
const ring2 = { id: uuid(), name: 'Python Programmers', creator_id: user2.id };
const ring3 = { id: uuid(), name: 'React Enthusiasts', creator_id: user3.id };
const ring4 = { id: uuid(), name: 'Node.js Community', creator_id: user1.id };
const ring5 = { id: uuid(), name: 'TypeScript Users', creator_id: user2.id };
```

**Test Memberships**:
```typescript
// user1 is member of ring1 only
const memberships = [
  { user_id: user1.id, ring_id: ring1.id }
];
```

### Test Cases

#### Test 1: Successful Ring Search - Partial Match
**Test Name**: `should return rings matching search query`

**Description**: Verifies that search returns rings whose names match the search query.

**Test Steps**:
1. Create multiple rings with various names
2. Authenticate as user
3. Send GET request to `/api/rings/search?q=JavaScript`
4. Verify response contains matching rings
5. Verify each ring includes required fields

**Expected Results**:
- HTTP status code: 200 OK
- Response contains array of matching rings
- Each ring contains: id, name, member count, membership status (is user a member: true/false)

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
  expect(ring.isMember).toBeDefined();
  expect(typeof ring.isMember).toBe('boolean');
});
```

#### Test 2: Case-Insensitive Search
**Test Name**: `should perform case-insensitive search on ring names`

**Description**: Verifies that search is case-insensitive.

**Test Steps**:
1. Create rings with mixed case names
2. Search with lowercase query
3. Search with uppercase query
4. Search with mixed case query
5. Verify all return same results

**Expected Results**:
- Search is case-insensitive
- 'javascript', 'JAVASCRIPT', 'JavaScript' all return same results

**Assertions**:
```typescript
const lowerResponse = await findRing(userToken, 'javascript');
const upperResponse = await findRing(userToken, 'JAVASCRIPT');
const mixedResponse = await findRing(userToken, 'JavaScript');

expect(lowerResponse.body.rings.length).toBe(upperResponse.body.rings.length);
expect(lowerResponse.body.rings.length).toBe(mixedResponse.body.rings.length);
```

#### Test 3: Membership Status - Member
**Test Name**: `should indicate when user is already a member of ring`

**Description**: Verifies that rings where user is a member have isMember: true.

**Test Steps**:
1. Create ring
2. Add user as member
3. Search for ring
4. Verify isMember is true

**Expected Results**:
- Ring has isMember: true
- Join button should not be shown (in UI)

**Assertions**:
```typescript
const ring = response.body.rings.find(r => r.id === ring1.id);
expect(ring.isMember).toBe(true);
```

#### Test 4: Membership Status - Non-Member
**Test Name**: `should indicate when user is not a member of ring`

**Description**: Verifies that rings where user is not a member have isMember: false.

**Test Steps**:
1. Create ring
2. Do not add user as member
3. Search for ring
4. Verify isMember is false

**Expected Results**:
- Ring has isMember: false
- Join button should be shown (in UI)

**Assertions**:
```typescript
const ring = response.body.rings.find(r => r.id === ring2.id);
expect(ring.isMember).toBe(false);
```

#### Test 5: Member Count
**Test Name**: `should include member count for each ring`

**Description**: Verifies that each ring includes member count.

**Test Steps**:
1. Create ring with multiple members
2. Search for ring
3. Verify member count is included and accurate

**Expected Results**:
- Member count is included
- Member count is accurate

**Assertions**:
```typescript
response.body.rings.forEach(ring => {
  expect(ring.memberCount).toBeDefined();
  expect(typeof ring.memberCount).toBe('number');
  expect(ring.memberCount).toBeGreaterThan(0);
});

// Verify specific ring
const ring = response.body.rings.find(r => r.id === ring1.id);
const actualMemberCount = await getMemberCount(ring1.id);
expect(ring.memberCount).toBe(actualMemberCount);
```

#### Test 6: Partial Match - Beginning of Name
**Test Name**: `should match ring names from beginning`

**Description**: Verifies that search matches from beginning of ring name.

**Test Steps**:
1. Create ring 'JavaScript Developers'
2. Search with 'Java'
3. Verify ring is matched

**Expected Results**:
- Ring is matched when query matches beginning of name

**Assertions**:
```typescript
const response = await findRing(userToken, 'Java');
expect(response.body.rings.some(r => r.name === 'JavaScript Developers')).toBe(true);
```

#### Test 7: Partial Match - Middle of Name
**Test Name**: `should match ring names from middle`

**Description**: Verifies that search matches from middle of ring name.

**Test Steps**:
1. Create ring 'JavaScript Developers'
2. Search with 'Script'
3. Verify ring is matched

**Expected Results**:
- Ring is matched when query matches middle of name

**Assertions**:
```typescript
const response = await findRing(userToken, 'Script');
expect(response.body.rings.some(r => r.name === 'JavaScript Developers')).toBe(true);
```

#### Test 8: Partial Match - End of Name
**Test Name**: `should match ring names from end`

**Description**: Verifies that search matches from end of ring name.

**Test Steps**:
1. Create ring 'JavaScript Developers'
2. Search with 'Developers'
3. Verify ring is matched

**Expected Results**:
- Ring is matched when query matches end of name

**Assertions**:
```typescript
const response = await findRing(userToken, 'Developers');
expect(response.body.rings.some(r => r.name === 'JavaScript Developers')).toBe(true);
```

#### Test 9: Multiple Matching Rings
**Test Name**: `should return all rings matching search query`

**Description**: Verifies that search returns all rings that match the query.

**Test Steps**:
1. Create rings: 'JavaScript Developers', 'JavaScript Beginners'
2. Search with 'JavaScript'
3. Verify both rings are returned

**Expected Results**:
- All matching rings are returned
- Each ring includes membership status

**Assertions**:
```typescript
const ringNames = response.body.rings.map(r => r.name);
expect(ringNames).toContain('JavaScript Developers');
expect(ringNames).toContain('JavaScript Beginners');
```

#### Test 10: No Matching Rings
**Test Name**: `should return empty list when no rings match search query`

**Description**: Verifies that search with no matching rings returns empty list.

**Test Steps**:
1. Create rings with specific names
2. Search with query that matches no rings
3. Verify empty list is returned

**Expected Results**:
- HTTP status code: 200 OK
- Rings array is empty
- No results message: "No Rings found matching '[search query]'"

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.rings.length).toBe(0);
expect(response.body.noResultsMessage).toBe(`No Rings found matching 'nonexistent'`);
```

#### Test 11: Empty Search Query
**Test Name**: `should reject empty search query`

**Description**: Verifies that search with empty query is rejected.

**Test Steps**:
1. Send GET request with empty search query
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Please enter a search query."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Please enter a search query.');
```

#### Test 12: Missing Search Query
**Test Name**: `should reject search without query parameter`

**Description**: Verifies that search without query parameter is rejected.

**Test Steps**:
1. Send GET request to `/api/rings/search` without query parameter
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Please enter a search query."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Please enter a search query.');
```

#### Test 13: Search Query Too Short
**Test Name**: `should require minimum 1 character for search query`

**Description**: Verifies that search query must be at least 1 character.

**Test Steps**:
1. Send GET request with empty string as query
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Please enter a search query."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Please enter a search query.');
```

#### Test 14: Authentication Required
**Test Name**: `should require authentication to search for rings`

**Description**: Verifies that unauthenticated search requests are rejected.

**Test Steps**:
1. Send GET request to `/api/rings/search?q=query` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 15: Search Performance
**Test Name**: `should return search results within 1 second`

**Description**: Verifies that search operations complete within performance requirements.

**Test Steps**:
1. Create many rings
2. Perform search
3. Measure response time
4. Verify response time < 1 second

**Expected Results**:
- Response time < 1 second
- Search results are returned successfully

**Assertions**:
```typescript
const startTime = Date.now();
const response = await findRing(userToken, 'JavaScript');
const responseTime = Date.now() - startTime;

expect(response.status).toBe(200);
expect(responseTime).toBeLessThan(1000); // 1 second
```

#### Test 16: All Rings Returned (No Filtering)
**Test Name**: `should return all rings matching query regardless of user membership`

**Description**: Verifies that search returns all matching rings, not just user's rings.

**Test Steps**:
1. Create rings (some user is member of, some not)
2. Search for rings
3. Verify all matching rings are returned

**Expected Results**:
- All matching rings are returned
- Membership status is indicated for each ring

**Assertions**:
```typescript
// user1 is member of ring1 only
const response = await findRing(user1Token, 'JavaScript');
const ring1Result = response.body.rings.find(r => r.id === ring1.id);
const ring2Result = response.body.rings.find(r => r.id === ring2.id);

expect(ring1Result).toBeDefined();
expect(ring1Result.isMember).toBe(true);
expect(ring2Result).toBeDefined();
expect(ring2Result.isMember).toBe(false);
```

#### Test 17: Search With Special Characters
**Test Name**: `should handle special characters in search query safely`

**Description**: Verifies that search handles special characters correctly (escapes SQL injection attempts).

**Test Steps**:
1. Search with special characters: `'; DROP TABLE rings; --`
2. Verify search fails gracefully or returns no results
3. Verify no SQL injection occurs

**Expected Results**:
- Search query with special characters is handled safely
- No SQL injection occurs
- Returns empty results or validation error

**Assertions**:
```typescript
const response = await findRing(userToken, "'; DROP TABLE rings; --");
// Should either return empty results or validation error, not SQL error
expect([200, 400]).toContain(response.status);
// Verify rings table still exists
const tableExists = await checkTableExists('rings');
expect(tableExists).toBe(true);
```

### Error Handling Tests

#### Test 18: Database Connection Error
**Test Name**: `should handle database connection error gracefully during search`

**Description**: Verifies that database connection errors during search are handled.

**Test Steps**:
1. Simulate database connection failure
2. Attempt search
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

### Notes
- Search is case-insensitive
- Search uses partial matching (substring matching)
- Search query must be at least 1 character
- Search returns all matching rings (not filtered by user membership)
- Membership status (isMember) is included for each ring
- Member count is included for each ring
- Performance requirement: Search operations must return results within 1 second
- No results message: "No Rings found matching '[search query]'"
- Empty query error: "Please enter a search query."
