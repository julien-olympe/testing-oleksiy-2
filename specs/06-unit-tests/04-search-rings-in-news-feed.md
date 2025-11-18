# Search Rings in News Feed Test Specification

## Test File: `search-rings-in-news-feed.test.ts`

### Purpose
Tests for Search Rings in News Feed use case (3.4) covering search functionality, filtering, empty queries, and case-insensitive matching.

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
  // Create test posts
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

**Test Posts**:
```typescript
const posts = [
  { ring_id: ring1.id, message_text: 'Post in JavaScript Developers' },
  { ring_id: ring2.id, message_text: 'Post in Python Programmers' },
  { ring_id: ring3.id, message_text: 'Post in React Enthusiasts' },
  { ring_id: ring4.id, message_text: 'Post in Node.js Community' },
  { ring_id: ring5.id, message_text: 'Post in TypeScript Users' }
];
```

### Test Cases

#### Test 1: Successful Search - Partial Match
**Test Name**: `should filter news feed by ring name using partial match`

**Description**: Verifies that News Feed can be filtered by Ring name using partial matching.

**Test Steps**:
1. Create user with memberships in multiple rings
2. Create posts in each ring
3. Authenticate as user
4. Send GET request to `/api/news-feed?search=JavaScript`
5. Verify only posts from matching rings are returned

**Expected Results**:
- HTTP status code: 200 OK
- News Feed contains only posts from rings matching search query
- Posts from non-matching rings are excluded

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed).toBeDefined();
response.body.newsFeed.forEach(tile => {
  expect(tile.ringName.toLowerCase()).toContain('javascript');
});
// Verify non-matching rings are excluded
const ringNames = response.body.newsFeed.map(tile => tile.ringName);
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
const lowerResponse = await getNewsFeed(user1Token, 'javascript');
const upperResponse = await getNewsFeed(user1Token, 'JAVASCRIPT');
const mixedResponse = await getNewsFeed(user1Token, 'JavaScript');

expect(lowerResponse.body.newsFeed.length).toBe(upperResponse.body.newsFeed.length);
expect(lowerResponse.body.newsFeed.length).toBe(mixedResponse.body.newsFeed.length);
```

#### Test 3: Empty Search Query
**Test Name**: `should return full news feed when search query is empty`

**Description**: Verifies that empty search query returns full News Feed (same as View News Feed).

**Test Steps**:
1. Create user with memberships in multiple rings
2. Create posts in each ring
3. Send GET request to `/api/news-feed?search=`
4. Verify all posts are returned

**Expected Results**:
- HTTP status code: 200 OK
- News Feed contains posts from all user's rings
- No filtering is applied

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed.length).toBeGreaterThan(0);
// Verify posts from all rings are included
const fullFeed = await getNewsFeed(user1Token); // Without search
expect(response.body.newsFeed.length).toBe(fullFeed.body.newsFeed.length);
```

#### Test 4: Search Query Cleared
**Test Name**: `should restore full news feed when search is cleared`

**Description**: Verifies that clearing search query restores full News Feed.

**Test Steps**:
1. Search with query 'JavaScript'
2. Clear search (empty query)
3. Verify full News Feed is restored

**Expected Results**:
- Full News Feed is returned when search is cleared
- All posts from user's rings are included

**Assertions**:
```typescript
const searchResponse = await getNewsFeed(user1Token, 'JavaScript');
const clearedResponse = await getNewsFeed(user1Token, '');

expect(clearedResponse.body.newsFeed.length).toBeGreaterThanOrEqual(searchResponse.body.newsFeed.length);
```

#### Test 5: No Matching Rings
**Test Name**: `should return empty news feed when no rings match search query`

**Description**: Verifies that search with no matching rings returns empty News Feed.

**Test Steps**:
1. Create user with memberships in specific rings
2. Search with query that matches no rings
3. Verify empty News Feed is returned

**Expected Results**:
- HTTP status code: 200 OK
- News Feed array is empty
- No results message: "No posts found for '[search query]'"

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed.length).toBe(0);
expect(response.body.noResultsMessage).toBe(`No posts found for 'nonexistent'`);
```

#### Test 6: Multiple Matching Rings
**Test Name**: `should return posts from all matching rings`

**Description**: Verifies that search returns posts from all rings that match the query.

**Test Steps**:
1. Create rings: 'JavaScript Developers', 'JavaScript Beginners'
2. Create posts in both rings
3. Search with query 'JavaScript'
4. Verify posts from both rings are returned

**Expected Results**:
- News Feed contains posts from all matching rings
- Posts are ordered by created_at descending

**Assertions**:
```typescript
const ringNames = response.body.newsFeed.map(tile => tile.ringName);
expect(ringNames).toContain('JavaScript Developers');
expect(ringNames).toContain('JavaScript Beginners');
```

#### Test 7: Matching Rings With No Posts
**Test Name**: `should return empty news feed when matching rings have no posts`

**Description**: Verifies that search returns empty News Feed when matching rings exist but have no posts.

**Test Steps**:
1. Create ring matching search query
2. Do not create any posts in the ring
3. Search with matching query
4. Verify empty News Feed is returned

**Expected Results**:
- HTTP status code: 200 OK
- News Feed array is empty
- No results message is returned

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed.length).toBe(0);
expect(response.body.noResultsMessage).toBeDefined();
```

#### Test 8: Partial Match - Beginning of Name
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
const response = await getNewsFeed(user1Token, 'Java');
expect(response.body.newsFeed.some(tile => tile.ringName === 'JavaScript Developers')).toBe(true);
```

#### Test 9: Partial Match - Middle of Name
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
const response = await getNewsFeed(user1Token, 'Script');
expect(response.body.newsFeed.some(tile => tile.ringName === 'JavaScript Developers')).toBe(true);
```

#### Test 10: Partial Match - End of Name
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
const response = await getNewsFeed(user1Token, 'Developers');
expect(response.body.newsFeed.some(tile => tile.ringName === 'JavaScript Developers')).toBe(true);
```

#### Test 11: Real-Time Search
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
const response1 = await getNewsFeed(user1Token, 'J');
const response2 = await getNewsFeed(user1Token, 'Ja');
const response3 = await getNewsFeed(user1Token, 'Jav');

expect(response1.body.newsFeed.length).toBeGreaterThanOrEqual(response2.body.newsFeed.length);
expect(response2.body.newsFeed.length).toBeGreaterThanOrEqual(response3.body.newsFeed.length);
```

#### Test 12: Search Only User's Rings
**Test Name**: `should only search within user's rings`

**Description**: Verifies that search only returns results from rings user is a member of.

**Test Steps**:
1. Create ring that user is not a member of
2. Create post in that ring
3. Search with ring name
4. Verify ring is not included in results

**Expected Results**:
- Search does not return posts from rings user is not a member of
- Only user's rings are searched

**Assertions**:
```typescript
const response = await getNewsFeed(user1Token, nonMemberRing.name);
expect(response.body.newsFeed.length).toBe(0);
expect(response.body.newsFeed.some(tile => tile.ringId === nonMemberRing.id)).toBe(false);
```

#### Test 13: Search With Special Characters
**Test Name**: `should handle special characters in search query`

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
const response = await getNewsFeed(user1Token, "'; DROP TABLE rings; --");
// Should either return empty results or validation error, not SQL error
expect([200, 400]).toContain(response.status);
// Verify rings table still exists
const tableExists = await checkTableExists('rings');
expect(tableExists).toBe(true);
```

#### Test 14: Search Performance
**Test Name**: `should return search results within 1 second`

**Description**: Verifies that search operations complete within performance requirements.

**Test Steps**:
1. Create user with many rings and posts
2. Perform search
3. Measure response time
4. Verify response time < 1 second

**Expected Results**:
- Response time < 1 second
- Search results are returned successfully

**Assertions**:
```typescript
const startTime = Date.now();
const response = await getNewsFeed(user1Token, 'JavaScript');
const responseTime = Date.now() - startTime;

expect(response.status).toBe(200);
expect(responseTime).toBeLessThan(1000); // 1 second
```

#### Test 15: Authentication Required
**Test Name**: `should require authentication to search news feed`

**Description**: Verifies that unauthenticated search requests are rejected.

**Test Steps**:
1. Send GET request to `/api/news-feed?search=query` without authentication
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

#### Test 16: Database Connection Error
**Test Name**: `should handle database connection error gracefully during search`

**Description**: Verifies that database connection errors during search are handled.

**Test Steps**:
1. Simulate database connection failure
2. Attempt search
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: "Unable to load news feed. Please try again."

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBe('Unable to load news feed. Please try again.');
```

### Notes
- Search is case-insensitive
- Search uses partial matching (substring matching)
- Empty search query returns full News Feed
- Search only includes rings user is a member of
- Performance requirement: Search operations must return results within 1 second
- No results message: "No posts found for '[search query]'"
