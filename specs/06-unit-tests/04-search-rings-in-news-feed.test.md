# Unit Test Specification: Search Rings in News Feed (Use Case 3.4)

## Overview
This document specifies unit tests for the Search Rings in News Feed use case, covering search filtering, case-insensitive matching, empty query handling, and edge cases.

## Function/API Being Tested
- **API Endpoint**: `GET /api/news-feed?q=searchQuery`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `getUserMemberships(userId: string): Promise<Membership[]>`
  - `filterRingsByName(ringIds: string[], searchQuery: string): Promise<Ring[]>`
  - `getPostsForRings(ringIds: string[]): Promise<Post[]>`
  - `formatPostAsNewsTile(post: Post, ringName: string): NewsTile`
  - `searchNewsFeed(userId: string, searchQuery: string): Promise<NewsTile[]>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for memberships
- Mock database queries for ring name filtering
- Mock database queries for posts
- Mock ring name lookups

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

### TC-SEARCH-NEWS-001: Successful News Feed Search (Happy Path)
**Description**: Test successful search filtering of news feed by Ring name.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return 5 Rings with names: "Tech", "Sports", "Tech News", "Music", "Tech Talk"
3. Arrange: Mock search query "Tech"
4. Arrange: Mock filtered Rings to return 3 matching Rings
5. Arrange: Mock posts from matching Rings
6. Act: Call `searchNewsFeed(userId, 'Tech')`
7. Assert: Verify authentication was validated
8. Assert: Verify memberships were retrieved
9. Assert: Verify ring name filtering was performed (case-insensitive)
10. Assert: Verify posts were retrieved only from matching Rings
11. Assert: Verify posts are formatted as News Tiles

**Expected Output**:
- Status: 200 OK
- Response: Array of NewsTiles from Rings matching "Tech"
- Only posts from "Tech", "Tech News", "Tech Talk" included

**Mock Verification**:
- `getUserMemberships` called once
- `filterRingsByName` called with ringIds and "Tech"
- `getPostsForRings` called with filtered ringIds only

---

### TC-SEARCH-NEWS-002: Search with Empty Query Returns Full Feed
**Description**: Test that empty search query returns full news feed.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts from all user's Rings
3. Act: Call `searchNewsFeed(userId, '')`
4. Assert: Verify search query is treated as empty
5. Assert: Verify full news feed is returned (same as View News Feed)
6. Assert: Verify no filtering is applied

**Expected Output**:
- Status: 200 OK
- Response: Full news feed (all posts from all user's Rings)
- Same result as View News Feed without search

---

### TC-SEARCH-NEWS-003: Search with Whitespace-Only Query
**Description**: Test that search query with only whitespace is treated as empty.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts from all user's Rings
3. Act: Call `searchNewsFeed(userId, '   ')`
4. Assert: Verify whitespace is trimmed
5. Assert: Verify full news feed is returned

**Expected Output**:
- Status: 200 OK
- Response: Full news feed (no filtering)

---

### TC-SEARCH-NEWS-004: Search - Case-Insensitive Matching
**Description**: Test that search is case-insensitive.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names: "Technology", "TECHNOLOGY", "technology"
3. Arrange: Mock search query "tech"
4. Act: Call `searchNewsFeed(userId, 'tech')`
5. Assert: Verify all three Rings match (case-insensitive)
6. Act: Call `searchNewsFeed(userId, 'TECH')`
7. Assert: Verify all three Rings match
8. Act: Call `searchNewsFeed(userId, 'Technology')`
9. Assert: Verify all three Rings match

**Expected Output**:
- All case variations match the same Rings
- Search is case-insensitive

---

### TC-SEARCH-NEWS-005: Search - Partial Matching
**Description**: Test that search performs partial matching on Ring names.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names: "JavaScript", "Java", "Python", "Java Script"
3. Arrange: Mock search query "Java"
4. Act: Call `searchNewsFeed(userId, 'Java')`
5. Assert: Verify "JavaScript", "Java", and "Java Script" match
6. Assert: Verify "Python" does not match

**Expected Output**:
- Rings containing "Java" in name are matched
- Partial matches work correctly

---

### TC-SEARCH-NEWS-006: Search - No Matching Rings
**Description**: Test search when no Rings match the query.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names: "Tech", "Sports", "Music"
3. Arrange: Mock search query "Science"
4. Act: Call `searchNewsFeed(userId, 'Science')`
5. Assert: Verify no Rings match
6. Assert: Verify empty array is returned

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "No posts found for 'Science'"

---

### TC-SEARCH-NEWS-007: Search - Matching Rings with No Posts
**Description**: Test search when Rings match but have no posts.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings matching search query
3. Arrange: Mock posts to return empty array
4. Act: Call `searchNewsFeed(userId, 'Tech')`
5. Assert: Verify empty array is returned

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "No posts found for 'Tech'"

---

### TC-SEARCH-NEWS-008: Search - Single Character Query
**Description**: Test search with single character query.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names containing "T"
3. Arrange: Mock search query "T"
4. Act: Call `searchNewsFeed(userId, 'T')`
5. Assert: Verify all Rings with "T" in name match
6. Assert: Verify partial matching works with single character

**Expected Output**:
- Status: 200 OK
- Response: Posts from Rings with "T" in name

---

### TC-SEARCH-NEWS-009: Search - Very Long Query
**Description**: Test search with very long query string.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock search query of 1000 characters
3. Act: Call `searchNewsFeed(userId, 'a'.repeat(1000))`
4. Assert: Verify search executes without error
5. Assert: Verify no Rings match (unless Ring name is extremely long)

**Expected Output**:
- Status: 200 OK
- Response: Empty array or filtered results

---

### TC-SEARCH-NEWS-010: Search - Special Characters in Query
**Description**: Test search with special characters in query.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock search query with special characters: "Tech@Ring", "Tech-Ring", "Tech_Ring"
3. Act: Call `searchNewsFeed(userId, 'Tech@Ring')`
4. Assert: Verify special characters are handled safely
5. Assert: Verify SQL injection attempts are prevented

**Expected Output**:
- Status: 200 OK
- Special characters treated as literal characters in search
- No SQL injection vulnerabilities

---

### TC-NEWS-011: Search - Authentication Failure
**Description**: Test search with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `searchNewsFeed(userId, 'Tech')`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-SEARCH-NEWS-012: Search - Database Connection Error
**Description**: Test search when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `searchNewsFeed(userId, 'Tech')`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load news feed. Please try again."

---

### TC-SEARCH-NEWS-013: Search - Posts Ordered Chronologically
**Description**: Test that filtered posts maintain chronological ordering.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock filtered Rings
3. Arrange: Mock posts with different timestamps
4. Act: Call `searchNewsFeed(userId, 'Tech')`
5. Assert: Verify posts are ordered by created_at DESC (newest first)

**Expected Output**:
- Posts in response ordered by timestamp descending

---

### TC-SEARCH-NEWS-014: Search - Multiple Matching Rings
**Description**: Test search with multiple Rings matching query.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock 10 Rings, 5 matching "Tech"
3. Arrange: Mock posts from all 5 matching Rings
4. Act: Call `searchNewsFeed(userId, 'Tech')`
5. Assert: Verify posts from all 5 matching Rings are included
6. Assert: Verify posts are aggregated and ordered chronologically

**Expected Output**:
- Response contains posts from all matching Rings
- Posts ordered by timestamp across all Rings

---

### TC-SEARCH-NEWS-015: Search - Real-Time Search (As User Types)
**Description**: Test that search can be called rapidly as user types.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Act: Call search with "T"
3. Act: Call search with "Te"
4. Act: Call search with "Tec"
5. Act: Call search with "Tech"
6. Assert: Verify all searches complete successfully
7. Assert: Verify results are correct for each query

**Expected Output**:
- Each search returns appropriate filtered results
- No errors from rapid successive calls

---

### TC-SEARCH-NEWS-016: Search - SQL Injection Prevention
**Description**: Test that search query prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock search query with SQL injection attempt: "'; DROP TABLE rings; --"
3. Act: Call `searchNewsFeed(userId, "'; DROP TABLE rings; --")`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as literal string
6. Assert: Verify database is not compromised

**Expected Output**:
- Status: 200 OK
- Search treats injection attempt as literal query string
- No database damage

---

### TC-SEARCH-NEWS-017: Search - Performance with Many Rings
**Description**: Test search performance with 50 Rings.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock memberships to return 50 Rings
3. Arrange: Mock search query matching 10 Rings
4. Act: Call `searchNewsFeed(userId, 'Tech')`
5. Assert: Verify search completes within 1 second
6. Assert: Verify only matching Rings are queried for posts

**Expected Output**:
- Status: 200 OK
- Response time: < 1 second
- Efficient query execution

---

### TC-SEARCH-NEWS-018: Search - Unicode and Emoji in Query
**Description**: Test search with Unicode characters and emojis.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock search query with Unicode: "Café", "北京", "🎵"
3. Act: Call `searchNewsFeed(userId, 'Café')`
4. Assert: Verify Unicode characters are handled correctly
5. Assert: Verify encoding is preserved

**Expected Output**:
- Status: 200 OK
- Unicode characters handled correctly
- Search works with international characters

---

### TC-SEARCH-NEWS-019: Search - Clear Search (Empty Query)
**Description**: Test that clearing search restores full feed.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Perform search with query "Tech"
3. Arrange: Mock full news feed
4. Act: Call `searchNewsFeed(userId, '')` (clear search)
5. Assert: Verify full news feed is returned
6. Assert: Verify no filtering is applied

**Expected Output**:
- Status: 200 OK
- Response: Full news feed (all posts)

---

### TC-SEARCH-NEWS-020: Search - Rate Limiting
**Description**: Test that search endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 20 requests per minute per user
3. Act: Call search endpoint 21 times rapidly
4. Assert: Verify first 20 requests succeed
5. Assert: Verify 21st request returns 429 Too Many Requests

**Expected Output**:
- First 20 requests: 200 OK
- 21st request: 429 Too Many Requests
