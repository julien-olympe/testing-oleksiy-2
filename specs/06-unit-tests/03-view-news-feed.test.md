# Unit Test Specification: View News Feed (Use Case 3.3)

## Overview
This document specifies unit tests for the View News Feed use case, covering post aggregation, chronological ordering, News Tile formatting, and edge cases.

## Function/API Being Tested
- **API Endpoint**: `GET /api/news-feed`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `getUserMemberships(userId: string): Promise<Membership[]>`
  - `getPostsForRings(ringIds: string[]): Promise<Post[]>`
  - `formatPostAsNewsTile(post: Post, ringName: string): NewsTile`
  - `getNewsFeed(userId: string): Promise<NewsTile[]>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for memberships
- Mock database queries for posts
- Mock ring name lookups
- Mock post author lookups

### Test Data Factories
```typescript
const createTestMembership = (overrides = {}) => ({
  id: 'membership-uuid',
  user_id: 'user-uuid',
  ring_id: 'ring-uuid',
  joined_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});

const createTestPost = (overrides = {}) => ({
  id: 'post-uuid',
  ring_id: 'ring-uuid',
  user_id: 'user-uuid',
  message_text: 'Test message',
  image_url: null,
  created_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});

const createTestRing = (overrides = {}) => ({
  id: 'ring-uuid',
  name: 'Test Ring',
  creator_id: 'user-uuid',
  created_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});
```

## Test Cases

### TC-NEWS-001: Successful News Feed Retrieval (Happy Path)
**Description**: Test successful retrieval of news feed with multiple posts from multiple Rings.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return 3 Rings
3. Arrange: Mock posts to return 10 posts from those Rings
4. Arrange: Mock ring name lookups
5. Arrange: Mock post author lookups
6. Act: Call `getNewsFeed(userId)`
7. Assert: Verify authentication was validated
8. Assert: Verify memberships were retrieved
9. Assert: Verify posts were retrieved for all user's Rings
10. Assert: Verify posts are ordered by creation timestamp descending (newest first)
11. Assert: Verify each post is formatted as News Tile
12. Assert: Verify News Tiles contain ring name, picture (if any), first 100 chars of message

**Expected Output**:
- Status: 200 OK
- Response: Array of NewsTile objects ordered by timestamp descending
- Each NewsTile: `{ ringName, imageUrl, messagePreview, timestamp }`

**Mock Verification**:
- `validateAuthToken` called once
- `getUserMemberships` called once with user id
- `getPostsForRings` called once with array of ring ids
- Posts ordered by created_at DESC

---

### TC-NEWS-002: News Feed - Empty State (No Rings)
**Description**: Test news feed when user has no Rings.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return empty array
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify empty array is returned
5. Assert: Verify no post queries are executed

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "No posts yet. Join or create a Ring to see posts here."

---

### TC-NEWS-003: News Feed - Empty State (Rings with No Posts)
**Description**: Test news feed when user has Rings but no posts.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return 3 Rings
3. Arrange: Mock posts to return empty array
4. Act: Call `getNewsFeed(userId)`
5. Assert: Verify empty array is returned
6. Assert: Verify post query was executed for all Rings

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "No posts yet. Join or create a Ring to see posts here."

---

### TC-NEWS-004: News Feed - Posts Ordered Chronologically (Newest First)
**Description**: Test that posts are ordered by creation timestamp descending.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts with different timestamps:
   - Post 1: created_at = 2024-01-01 10:00:00
   - Post 2: created_at = 2024-01-01 11:00:00
   - Post 3: created_at = 2024-01-01 09:00:00
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify posts are ordered: Post 2, Post 1, Post 3 (newest first)

**Expected Output**:
- Posts in response ordered by created_at DESC
- First post in array is most recent

---

### TC-NEWS-005: News Feed - Message Text Truncation (Exactly 100 Characters)
**Description**: Test that message text is truncated to exactly 100 characters in News Tile.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock post with message_text exactly 100 characters
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify message preview is exactly 100 characters (no ellipsis)
5. Arrange: Mock post with message_text of 101 characters
6. Act: Call `getNewsFeed(userId)`
7. Assert: Verify message preview is 100 characters with ellipsis

**Expected Output**:
- 100 char message: Preview is 100 chars, no ellipsis
- 101+ char message: Preview is 100 chars + "..."

---

### TC-NEWS-006: News Feed - Message Text Truncation (5000 Characters)
**Description**: Test message truncation for maximum length message.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock post with message_text of 5000 characters (maximum)
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify message preview is truncated to 100 characters with ellipsis

**Expected Output**:
- Message preview: First 100 characters + "..."

---

### TC-NEWS-007: News Feed - Posts with Images
**Description**: Test News Tile formatting for posts with images.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock post with image_url set
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify News Tile includes imageUrl
5. Assert: Verify imageUrl matches post.image_url

**Expected Output**:
- NewsTile.imageUrl is set to post.image_url value

---

### TC-NEWS-008: News Feed - Posts without Images
**Description**: Test News Tile formatting for posts without images.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock post with image_url = null
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify News Tile has imageUrl = null or undefined

**Expected Output**:
- NewsTile.imageUrl is null or undefined

---

### TC-NEWS-009: News Feed - Multiple Rings with Posts
**Description**: Test news feed aggregation from multiple Rings.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock memberships for 3 Rings (Ring A, Ring B, Ring C)
3. Arrange: Mock posts:
   - Ring A: 5 posts
   - Ring B: 3 posts
   - Ring C: 2 posts
4. Act: Call `getNewsFeed(userId)`
5. Assert: Verify all 10 posts are included
6. Assert: Verify posts are ordered by timestamp across all Rings
7. Assert: Verify each post has correct ring name

**Expected Output**:
- Response contains 10 NewsTiles
- Posts from all Rings included
- Chronological order maintained across Rings

---

### TC-NEWS-010: News Feed - Authentication Failure
**Description**: Test news feed retrieval with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null (invalid token)
2. Act: Call `getNewsFeed(userId)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error
5. Assert: Verify no database queries are executed

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

**Mock Verification**:
- `validateAuthToken` called once, returns null
- `getUserMemberships` not called
- `getPostsForRings` not called

---

### TC-NEWS-011: News Feed - Database Connection Error
**Description**: Test news feed retrieval when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load news feed. Please try again."

---

### TC-NEWS-012: News Feed - Membership Query Error
**Description**: Test news feed retrieval when membership query fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock membership query to throw error
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load news feed. Please try again."

---

### TC-NEWS-013: News Feed - Post Query Error
**Description**: Test news feed retrieval when post query fails.

**Test Steps**:
1. Arrange: Mock authentication and memberships to succeed
2. Arrange: Mock post query to throw error
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load news feed. Please try again."

---

### TC-NEWS-014: News Feed - Performance with 50 Rings
**Description**: Test news feed performance with maximum number of Rings (50).

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock memberships to return 50 Rings
3. Arrange: Mock posts to return 1000 posts total
4. Act: Call `getNewsFeed(userId)`
5. Assert: Verify query completes within 1.5 seconds
6. Assert: Verify all posts are retrieved and formatted

**Expected Output**:
- Status: 200 OK
- Response time: < 2 seconds
- All posts included in response

---

### TC-NEWS-015: News Feed - Performance with 1000 Posts
**Description**: Test news feed performance with large number of posts.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts to return 1000 posts
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify query completes within 2 seconds
5. Assert: Verify all posts are formatted correctly

**Expected Output**:
- Status: 200 OK
- Response time: < 2 seconds
- All 1000 posts included

---

### TC-NEWS-016: News Feed - Ring Name Lookup
**Description**: Test that ring names are correctly retrieved and included in News Tiles.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts from multiple Rings
3. Arrange: Mock ring name lookups
4. Act: Call `getNewsFeed(userId)`
5. Assert: Verify ring names are retrieved for each post
6. Assert: Verify News Tiles contain correct ring names

**Expected Output**:
- Each NewsTile has correct ringName matching post's ring

---

### TC-NEWS-017: News Feed - Post Author Information
**Description**: Test that post author information is available (if needed for future features).

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts with user_id
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify user_id is available in post data (for potential future use)

**Note**: Author information may not be displayed in News Tile but should be available in data.

---

### TC-NEWS-018: News Feed - Timestamp Formatting
**Description**: Test that timestamps are correctly formatted in News Tiles.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts with various timestamps
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify timestamps are included in News Tiles
5. Assert: Verify timestamp format is consistent

**Expected Output**:
- Each NewsTile includes created_at timestamp
- Timestamp format is ISO 8601 or consistent format

---

### TC-NEWS-019: News Feed - Concurrent Requests
**Description**: Test handling of concurrent news feed requests.

**Test Steps**:
1. Arrange: Mock authentication and database
2. Act: Simulate 100 concurrent news feed requests
3. Assert: Verify all requests complete successfully
4. Assert: Verify database connection pool handles concurrent queries

**Expected Output**:
- All 100 requests: 200 OK
- No connection pool exhaustion
- Response times remain acceptable

---

### TC-NEWS-020: News Feed - Posts from Deleted Ring (Edge Case)
**Description**: Test handling of posts from Rings that no longer exist (if deletion is implemented).

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock posts with ring_id that doesn't exist in rings table
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify error handling or filtering of orphaned posts

**Note**: This may not be applicable if Ring deletion is not implemented, but test should handle gracefully.

---

### TC-NEWS-021: News Feed - Message with Special Characters
**Description**: Test News Tile formatting with special characters in message.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock post with message containing special characters (emojis, unicode, HTML)
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify special characters are handled correctly
5. Assert: Verify no XSS vulnerabilities

**Expected Output**:
- Special characters displayed correctly
- HTML/script tags escaped or stripped

---

### TC-NEWS-022: News Feed - Image URL Validation
**Description**: Test that image URLs in News Tiles are valid and safe.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock post with image_url
3. Act: Call `getNewsFeed(userId)`
4. Assert: Verify image URL is validated
5. Assert: Verify no javascript: or data: protocol URLs

**Expected Output**:
- Image URLs are valid file paths or HTTP/HTTPS URLs
- No dangerous protocols in image URLs
