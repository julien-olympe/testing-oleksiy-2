# Search My Rings Test Specification

## Test File: `search-my-rings.test.ts`

### Purpose
Tests for Search My Rings use case (3.7) covering search functionality, filtering, empty queries, case-insensitive matching, and real-time search.

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
const ring2 = { id: uuid(), name: 'Python Programmers', creator_id: user1.id };
const ring3 = { id: uuid(), name: 'React Enthusiasts', creator_id: user2.id };
const ring4 = { id: uuid(), name: 'Node.js Community', creator_id: user2.id };
const ring5 = { id: uuid(), name: 'TypeScript Users', creator_id: user3.id };
```

**Test Memberships**:
```typescript
// user1 is member of ring1, ring2, ring3
const memberships = [
  { user_id: user1.id, ring_id: ring1.id },
  { user_id: user1.id, ring_id: ring2.id },
  { user_id: user1.id, ring_id: ring3.id }
];
```

### Test Cases

#### Test 1: Successful Search - Partial Match
**Test Name**: `should filter my rings list by ring name using partial match`

**Description**: Verifies that My Rings list can be filtered by Ring name using partial matching.

**Test Steps**:
1. Create user with memberships in multiple rings
2. Authenticate as user
3. Send GET request to `/api/my-rings?search=JavaScript`
4. Verify only matching rings are returned

**Expected Results**:
- HTTP status code: 200 OK
- Rings list contains only rings matching search query
- Rings from non-matching names are excluded

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.rings).toBeDefined();
expect(Array.isArray(response.body.rings)).toBe(true);
response.body.rings.forEach(ring => {
  expect(ring.name.toLowerCase()).toContain('javascript');
});
// Verify non-matching rings are excluded
const ringNames = response.body.rings.map(r => r.name);
expect(ringNames).not.toContain('Python Programmers');
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
const lowerResponse = await getMyRings(user1Token, 'javascript');
const upperResponse = await getMyRings(user1Token, 'JAVASCRIPT');
const mixedResponse = await getMyRings(user1Token, 'JavaScript');

expect(lowerResponse.body.rings.length).toBe(upperResponse.body.rings.length);
expect(lowerResponse.body.rings.length).toBe(mixedResponse.body.rings.length);
```

#### Test 3: Empty Search Query
**Test Name**: `should return full my rings list when search query is empty`

**Description**: Verifies that empty search query returns full My Rings list (same as View My Rings List).

**Test Steps**:
1. Create user with memberships in multiple rings
2. Send GET request to `/api/my-rings?search=`
3. Verify all rings are returned

**Expected Results**:
- HTTP status code: 200 OK
- Rings list contains all user's rings
- No filtering is applied

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.rings.length).toBeGreaterThan(0);
// Verify all rings are included
const fullList = await getMyRings(user1Token); // Without search
expect(response.body.rings.length).toBe(fullList.body.rings.length);
```

#### Test 4: Search Query Cleared
**Test Name**: `should restore full my rings list when search is cleared`

**Description**: Verifies that clearing search query restores full My Rings list.

**Test Steps**:
1. Search with query 'JavaScript'
2. Clear search (empty query)
3. Verify full list is restored

**Expected Results**:
- Full My Rings list is returned when search is cleared
- All user's rings are included

**Assertions**:
```typescript
const searchResponse = await getMyRings(user1Token, 'JavaScript');
const clearedResponse = await getMyRings(user1Token, '');

expect(clearedResponse.body.rings.length).toBeGreaterThanOrEqual(searchResponse.body.rings.length);
```

#### Test 5: No Matching Rings
**Test Name**: `should return empty list when no rings match search query`

**Description**: Verifies that search with no matching rings returns empty list.

**Test Steps**:
1. Create user with memberships in specific rings
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

#### Test 6: Multiple Matching Rings
**Test Name**: `should return all matching rings`

**Description**: Verifies that search returns all rings that match the query.

**Test Steps**:
1. Create rings: 'JavaScript Developers', 'JavaScript Beginners'
2. Add user as member of both rings
3. Search with query 'JavaScript'
4. Verify both rings are returned

**Expected Results**:
- Rings list contains all matching rings
- Member count is included for each ring

**Assertions**:
```typescript
const ringNames = response.body.rings.map(r => r.name);
expect(ringNames).toContain('JavaScript Developers');
expect(ringNames).toContain('JavaScript Beginners');
```

#### Test 7: Partial Match - Beginning of Name
**Test Name**: `should match ring names from beginning`

**Description**: Verifies that search matches from beginning of ring name.

**Test Steps**:
1. Create ring 'JavaScript Developers'
2. Add user as member
3. Search with 'Java'
4. Verify ring is matched

**Expected Results**:
- Ring is matched when query matches beginning of name

**Assertions**:
```typescript
const response = await getMyRings(user1Token, 'Java');
expect(response.body.rings.some(r => r.name === 'JavaScript Developers')).toBe(true);
```

#### Test 8: Partial Match - Middle of Name
**Test Name**: `should match ring names from middle`

**Description**: Verifies that search matches from middle of ring name.

**Test Steps**:
1. Create ring 'JavaScript Developers'
2. Add user as member
3. Search with 'Script'
4. Verify ring is matched

**Expected Results**:
- Ring is matched when query matches middle of name

**Assertions**:
```typescript
const response = await getMyRings(user1Token, 'Script');
expect(response.body.rings.some(r => r.name === 'JavaScript Developers')).toBe(true);
```

#### Test 9: Partial Match - End of Name
**Test Name**: `should match ring names from end`

**Description**: Verifies that search matches from end of ring name.

**Test Steps**:
1. Create ring 'JavaScript Developers'
2. Add user as member
3. Search with 'Developers'
4. Verify ring is matched

**Expected Results**:
- Ring is matched when query matches end of name

**Assertions**:
```typescript
const response = await getMyRings(user1Token, 'Developers');
expect(response.body.rings.some(r => r.name === 'JavaScript Developers')).toBe(true);
```

#### Test 10: Real-Time Search
**Test Name**: `should perform search as user types`

**Description**: Verifies that search can be performed with partial queries (simulating real-time search).

**Test Steps**:
1. Search with 'J'
2. Search with 'Ja'
3. Search with 'Jav'
4. Verify results narrow as query becomes more specific

**Expected Results**:
- Search works with single character queries
- Results become more specific as query lengthens

**Assertions**:
```typescript
const response1 = await getMyRings(user1Token, 'J');
const response2 = await getMyRings(user1Token, 'Ja');
const response3 = await getMyRings(user1Token, 'Jav');

expect(response1.body.rings.length).toBeGreaterThanOrEqual(response2.body.rings.length);
expect(response2.body.rings.length).toBeGreaterThanOrEqual(response3.body.rings.length);
```

#### Test 11: Search Only User's Rings
**Test Name**: `should only search within user's rings`

**Description**: Verifies that search only returns results from rings user is a member of.

**Test Steps**:
1. Create ring that user is not a member of
2. Search with ring name
3. Verify ring is not included in results

**Expected Results**:
- Search does not return rings user is not a member of
- Only user's rings are searched

**Assertions**:
```typescript
const response = await getMyRings(user1Token, nonMemberRing.name);
expect(response.body.rings.length).toBe(0);
expect(response.body.rings.some(r => r.id === nonMemberRing.id)).toBe(false);
```

#### Test 12: Ring Name Truncation in Search Results
**Test Name**: `should truncate ring names to 20 characters in search results`

**Description**: Verifies that ring names in search results are truncated to 20 characters if longer.

**Test Steps**:
1. Create ring with name longer than 20 characters
2. Add user as member
3. Search for the ring
4. Verify name is truncated in results

**Expected Results**:
- Ring name is truncated to 20 characters with ellipsis if longer

**Assertions**:
```typescript
const longNameRing = response.body.rings.find(r => r.id === longRing.id);
expect(longNameRing.name.length).toBeLessThanOrEqual(20);
if (longRing.name.length > 20) {
  expect(longNameRing.name.endsWith('...')).toBe(true);
}
```

#### Test 13: Member Count in Search Results
**Test Name**: `should include member count in search results`

**Description**: Verifies that member count is included in search results.

**Test Steps**:
1. Create ring with multiple members
2. Add user as member
3. Search for the ring
4. Verify member count is included

**Expected Results**:
- Member count is included in search results
- Member count is accurate

**Assertions**:
```typescript
response.body.rings.forEach(ring => {
  expect(ring.memberCount).toBeDefined();
  expect(typeof ring.memberCount).toBe('number');
  expect(ring.memberCount).toBeGreaterThan(0);
});
```

#### Test 14: Search With Special Characters
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
const response = await getMyRings(user1Token, "'; DROP TABLE rings; --");
// Should either return empty results or validation error, not SQL error
expect([200, 400]).toContain(response.status);
// Verify rings table still exists
const tableExists = await checkTableExists('rings');
expect(tableExists).toBe(true);
```

#### Test 15: Search Performance
**Test Name**: `should return search results within 1 second`

**Description**: Verifies that search operations complete within performance requirements.

**Test Steps**:
1. Create user with many rings
2. Perform search
3. Measure response time
4. Verify response time < 1 second

**Expected Results**:
- Response time < 1 second
- Search results are returned successfully

**Assertions**:
```typescript
const startTime = Date.now();
const response = await getMyRings(user1Token, 'JavaScript');
const responseTime = Date.now() - startTime;

expect(response.status).toBe(200);
expect(responseTime).toBeLessThan(1000); // 1 second
```

#### Test 16: Authentication Required
**Test Name**: `should require authentication to search my rings`

**Description**: Verifies that unauthenticated search requests are rejected.

**Test Steps**:
1. Send GET request to `/api/my-rings?search=query` without authentication
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

### Error Handling Tests

#### Test 17: Database Connection Error
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
- Empty search query returns full My Rings list
- Search only includes rings user is a member of
- Ring names are truncated to 20 characters with ellipsis if longer
- Member count is included in search results
- Performance requirement: Search operations must return results within 1 second
- No results message: "No Rings found matching '[search query]'"
