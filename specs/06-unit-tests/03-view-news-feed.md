# View News Feed Test Specification

## Test File: `view-news-feed.test.ts`

### Purpose
Tests for View News Feed use case (3.3) covering successful feed retrieval, empty states, authentication, and data aggregation from multiple Rings.

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
  // Clear all tables (users, rings, posts, memberships)
  // Create test users
  // Create test rings
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

**After All Tests**:
```typescript
afterAll(async () => {
  // Close database connection
  // Clean up test resources
});
```

### Test Data

**Test Users**:
```typescript
const user1 = { id: uuid(), username: 'user1', passwordHash: 'hash1' };
const user2 = { id: uuid(), username: 'user2', passwordHash: 'hash2' };
const user3 = { id: uuid(), username: 'user3', passwordHash: 'hash3' };
```

**Test Rings**:
```typescript
const ring1 = { id: uuid(), name: 'Ring1', creator_id: user1.id };
const ring2 = { id: uuid(), name: 'Ring2', creator_id: user2.id };
const ring3 = { id: uuid(), name: 'Ring3', creator_id: user3.id };
```

**Test Posts**:
```typescript
const post1 = {
  id: uuid(),
  ring_id: ring1.id,
  user_id: user1.id,
  message_text: 'First post in Ring1',
  image_url: null,
  created_at: new Date('2024-01-01T10:00:00Z')
};

const post2 = {
  id: uuid(),
  ring_id: ring1.id,
  user_id: user2.id,
  message_text: 'Second post in Ring1',
  image_url: '/images/post2.jpg',
  created_at: new Date('2024-01-01T11:00:00Z')
};

const post3 = {
  id: uuid(),
  ring_id: ring2.id,
  user_id: user2.id,
  message_text: 'Post in Ring2',
  image_url: null,
  created_at: new Date('2024-01-01T12:00:00Z')
};
```

### Test Cases

#### Test 1: Successful News Feed Retrieval - Happy Path
**Test Name**: `should return news feed with posts from user's rings in reverse chronological order`

**Description**: Verifies that authenticated user receives News Feed with posts from all Rings they are members of, ordered newest first.

**Test Steps**:
1. Create user1, ring1, ring2
2. Create membership: user1 is member of ring1 and ring2
3. Create posts in ring1 and ring2 with different timestamps
4. Authenticate as user1
5. Send GET request to `/api/news-feed`
6. Verify response contains posts from both rings
7. Verify posts are ordered by created_at descending (newest first)
8. Verify each post is formatted as News Tile

**Expected Results**:
- HTTP status code: 200 OK
- Response contains array of News Tiles
- News Tiles contain: Ring name, post picture URL (if present), first 100 characters of message text, post creation timestamp
- Posts are ordered by created_at descending
- Posts from all user's Rings are included

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed).toBeDefined();
expect(Array.isArray(response.body.newsFeed)).toBe(true);
expect(response.body.newsFeed.length).toBeGreaterThan(0);

// Verify ordering (newest first)
for (let i = 0; i < response.body.newsFeed.length - 1; i++) {
  const current = new Date(response.body.newsFeed[i].created_at);
  const next = new Date(response.body.newsFeed[i + 1].created_at);
  expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
}

// Verify News Tile format
response.body.newsFeed.forEach(tile => {
  expect(tile.ringName).toBeDefined();
  expect(tile.messageText).toBeDefined();
  expect(tile.messageText.length).toBeLessThanOrEqual(100);
  expect(tile.createdAt).toBeDefined();
  // imageUrl may be null or undefined
});
```

#### Test 2: News Tile Format - With Image
**Test Name**: `should format news tile with image URL when post has image`

**Description**: Verifies that News Tiles include image URL when post has an image.

**Test Steps**:
1. Create post with image_url
2. Retrieve news feed
3. Verify News Tile contains image_url

**Expected Results**:
- News Tile contains image_url field
- Image URL matches post's image_url

**Assertions**:
```typescript
const tileWithImage = response.body.newsFeed.find(tile => tile.imageUrl);
expect(tileWithImage).toBeDefined();
expect(tileWithImage.imageUrl).toBe(post2.image_url);
```

#### Test 3: News Tile Format - Without Image
**Test Name**: `should format news tile without image URL when post has no image`

**Description**: Verifies that News Tiles do not include image URL when post has no image.

**Test Steps**:
1. Create post without image_url
2. Retrieve news feed
3. Verify News Tile does not contain image_url (or is null)

**Expected Results**:
- News Tile image_url is null or undefined

**Assertions**:
```typescript
const tileWithoutImage = response.body.newsFeed.find(tile => !tile.imageUrl);
expect(tileWithoutImage).toBeDefined();
expect(tileWithoutImage.imageUrl).toBeNull();
```

#### Test 4: Message Text Truncation
**Test Name**: `should truncate message text to first 100 characters in news tile`

**Description**: Verifies that message text longer than 100 characters is truncated to first 100 characters.

**Test Steps**:
1. Create post with message text longer than 100 characters
2. Retrieve news feed
3. Verify message text in News Tile is truncated to 100 characters

**Expected Results**:
- Message text in News Tile is maximum 100 characters
- If original message is longer, it is truncated

**Assertions**:
```typescript
const longMessage = 'a'.repeat(200);
const post = await createPost({ message_text: longMessage, ... });
const response = await getNewsFeed(user1Token);

const tile = response.body.newsFeed.find(t => t.postId === post.id);
expect(tile.messageText.length).toBe(100);
expect(tile.messageText).toBe(longMessage.substring(0, 100));
```

#### Test 5: Message Text - Exactly 100 Characters
**Test Name**: `should include full message text when exactly 100 characters`

**Description**: Verifies that message text exactly 100 characters is included without truncation.

**Test Steps**:
1. Create post with message text exactly 100 characters
2. Retrieve news feed
3. Verify message text in News Tile is exactly 100 characters (not truncated)

**Expected Results**:
- Message text in News Tile is exactly 100 characters
- No truncation occurs

**Assertions**:
```typescript
const exact100Chars = 'a'.repeat(100);
const post = await createPost({ message_text: exact100Chars, ... });
const response = await getNewsFeed(user1Token);

const tile = response.body.newsFeed.find(t => t.postId === post.id);
expect(tile.messageText.length).toBe(100);
expect(tile.messageText).toBe(exact100Chars);
```

#### Test 6: Message Text - Less Than 100 Characters
**Test Name**: `should include full message text when less than 100 characters`

**Description**: Verifies that message text less than 100 characters is included in full.

**Test Steps**:
1. Create post with message text less than 100 characters
2. Retrieve news feed
3. Verify message text in News Tile matches original message

**Expected Results**:
- Message text in News Tile matches original message
- No truncation occurs

**Assertions**:
```typescript
const shortMessage = 'Short message';
const post = await createPost({ message_text: shortMessage, ... });
const response = await getNewsFeed(user1Token);

const tile = response.body.newsFeed.find(t => t.postId === post.id);
expect(tile.messageText).toBe(shortMessage);
expect(tile.messageText.length).toBe(shortMessage.length);
```

#### Test 7: Empty News Feed - No Rings
**Test Name**: `should return empty news feed when user has no rings`

**Description**: Verifies that user with no Rings receives empty News Feed with appropriate message.

**Test Steps**:
1. Create user with no Rings (no memberships)
2. Authenticate as user
3. Send GET request to `/api/news-feed`
4. Verify empty state response

**Expected Results**:
- HTTP status code: 200 OK
- News Feed array is empty
- Empty state message: "No posts yet. Join or create a Ring to see posts here."

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed).toBeDefined();
expect(Array.isArray(response.body.newsFeed)).toBe(true);
expect(response.body.newsFeed.length).toBe(0);
expect(response.body.emptyMessage).toBe('No posts yet. Join or create a Ring to see posts here.');
```

#### Test 8: Empty News Feed - Rings With No Posts
**Test Name**: `should return empty news feed when user's rings have no posts`

**Description**: Verifies that user with Rings but no posts receives empty News Feed.

**Test Steps**:
1. Create user, ring
2. Create membership: user is member of ring
3. Do not create any posts
4. Authenticate as user
5. Send GET request to `/api/news-feed`
6. Verify empty state response

**Expected Results**:
- HTTP status code: 200 OK
- News Feed array is empty
- Empty state message is returned

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.newsFeed.length).toBe(0);
expect(response.body.emptyMessage).toBeDefined();
```

#### Test 9: Posts From Multiple Rings
**Test Name**: `should aggregate posts from all user's rings`

**Description**: Verifies that News Feed includes posts from all Rings user is a member of.

**Test Steps**:
1. Create user, ring1, ring2, ring3
2. Create memberships: user is member of ring1, ring2, ring3
3. Create posts in each ring
4. Authenticate as user
5. Send GET request to `/api/news-feed`
6. Verify posts from all three rings are included

**Expected Results**:
- News Feed contains posts from ring1, ring2, and ring3
- All posts are included regardless of which ring they belong to

**Assertions**:
```typescript
const ringIds = [ring1.id, ring2.id, ring3.id];
const postsInFeed = response.body.newsFeed.map(tile => tile.ringId);
const uniqueRingIds = [...new Set(postsInFeed)];

expect(uniqueRingIds.length).toBe(3);
ringIds.forEach(ringId => {
  expect(postsInFeed).toContain(ringId);
});
```

#### Test 10: Exclude Posts From Non-Member Rings
**Test Name**: `should exclude posts from rings user is not a member of`

**Description**: Verifies that News Feed does not include posts from Rings user is not a member of.

**Test Steps**:
1. Create user1, user2, ring1, ring2
2. Create membership: user1 is member of ring1 only
3. Create posts in ring1 and ring2
4. Authenticate as user1
5. Send GET request to `/api/news-feed`
6. Verify only posts from ring1 are included

**Expected Results**:
- News Feed contains only posts from ring1
- Posts from ring2 are excluded

**Assertions**:
```typescript
const ringIdsInFeed = response.body.newsFeed.map(tile => tile.ringId);
expect(ringIdsInFeed.every(id => id === ring1.id)).toBe(true);
expect(ringIdsInFeed).not.toContain(ring2.id);
```

#### Test 11: Chronological Ordering - Newest First
**Test Name**: `should return posts in reverse chronological order (newest first)`

**Description**: Verifies that posts are ordered by created_at descending (newest first).

**Test Steps**:
1. Create multiple posts with different timestamps
2. Retrieve news feed
3. Verify posts are ordered newest first

**Expected Results**:
- Posts are ordered by created_at descending
- Most recent post appears first

**Assertions**:
```typescript
for (let i = 0; i < response.body.newsFeed.length - 1; i++) {
  const current = new Date(response.body.newsFeed[i].created_at);
  const next = new Date(response.body.newsFeed[i + 1].created_at);
  expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
}
```

#### Test 12: Authentication Required
**Test Name**: `should require authentication to view news feed`

**Description**: Verifies that unauthenticated requests are rejected.

**Test Steps**:
1. Send GET request to `/api/news-feed` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 13: Invalid Authentication Token
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
const response = await fetch('/api/news-feed', {
  headers: { 'Authorization': 'Bearer invalid_token' }
});
expect(response.status).toBe(401);
```

#### Test 14: Expired Authentication Token
**Test Name**: `should reject request with expired authentication token`

**Description**: Verifies that requests with expired authentication token are rejected.

**Test Steps**:
1. Create expired authentication token
2. Send GET request with expired token
3. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates expired authentication

**Assertions**:
```typescript
const expiredToken = createExpiredToken(user1.id);
const response = await fetch('/api/news-feed', {
  headers: { 'Authorization': `Bearer ${expiredToken}` }
});
expect(response.status).toBe(401);
```

### Error Handling Tests

#### Test 15: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to retrieve news feed
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: "Unable to load news feed. Please try again."

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBe('Unable to load news feed. Please try again.');
```

#### Test 16: Large News Feed Performance
**Test Name**: `should handle large news feed efficiently`

**Description**: Verifies that News Feed with many posts (50+ Rings) loads within performance requirements.

**Test Steps**:
1. Create user with 50 Rings
2. Create multiple posts in each ring
3. Retrieve news feed
4. Measure response time
5. Verify response time is within 2 seconds

**Expected Results**:
- Response time < 2 seconds
- News Feed is returned successfully

**Assertions**:
```typescript
const startTime = Date.now();
const response = await getNewsFeed(user1Token);
const responseTime = Date.now() - startTime;

expect(response.status).toBe(200);
expect(responseTime).toBeLessThan(2000); // 2 seconds
```

### Notes
- News Feed aggregates posts from all Rings where user is a member
- Posts are displayed in reverse chronological order (newest first)
- Message text is truncated to first 100 characters in News Tiles
- Empty state message: "No posts yet. Join or create a Ring to see posts here."
- Performance requirement: News Feed must load within 2 seconds for users with up to 50 Rings
