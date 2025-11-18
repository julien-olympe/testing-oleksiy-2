# View Ring Chat Test Specification

## Test File: `view-ring-chat.test.ts`

### Purpose
Tests for View Ring Chat use case (3.8) covering successful chat retrieval, post ordering, authorization, empty states, and post formatting.

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

**Test Ring**:
```typescript
const ring1 = { id: uuid(), name: 'Test Ring', creator_id: user1.id };
```

**Test Posts**:
```typescript
const post1 = {
  id: uuid(),
  ring_id: ring1.id,
  user_id: user1.id,
  message_text: 'First message',
  image_url: null,
  created_at: new Date('2024-01-01T10:00:00Z')
};

const post2 = {
  id: uuid(),
  ring_id: ring1.id,
  user_id: user2.id,
  message_text: 'Second message with image',
  image_url: '/images/post2.jpg',
  created_at: new Date('2024-01-01T11:00:00Z')
};

const post3 = {
  id: uuid(),
  ring_id: ring1.id,
  user_id: user3.id,
  message_text: 'Third message',
  image_url: null,
  created_at: new Date('2024-01-01T12:00:00Z')
};
```

### Test Cases

#### Test 1: Successful Ring Chat Retrieval - Happy Path
**Test Name**: `should return all posts in ring chat for authenticated member`

**Description**: Verifies that authenticated member can retrieve all posts in a Ring's chat.

**Test Steps**:
1. Create ring with multiple posts
2. Add user as member of ring
3. Authenticate as user
4. Send GET request to `/api/rings/:ringId/chat`
5. Verify response contains all posts
6. Verify posts are formatted correctly

**Expected Results**:
- HTTP status code: 200 OK
- Response contains array of posts
- Each post contains: message text (full text), picture URL (if present), author username, creation timestamp
- Posts are ordered by created_at ascending (oldest first)

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.ring).toBeDefined();
expect(response.body.ring.id).toBe(ring1.id);
expect(response.body.ring.name).toBe('Test Ring');
expect(response.body.posts).toBeDefined();
expect(Array.isArray(response.body.posts)).toBe(true);
expect(response.body.posts.length).toBeGreaterThan(0);

response.body.posts.forEach(post => {
  expect(post.id).toBeDefined();
  expect(post.messageText).toBeDefined();
  expect(post.authorUsername).toBeDefined();
  expect(post.createdAt).toBeDefined();
  // imageUrl may be null or undefined
});
```

#### Test 2: Post Ordering - Chronological (Oldest First)
**Test Name**: `should return posts in chronological order (oldest first)`

**Description**: Verifies that posts are ordered by created_at ascending (oldest first).

**Test Steps**:
1. Create multiple posts with different timestamps
2. Retrieve ring chat
3. Verify posts are ordered oldest first

**Expected Results**:
- Posts are ordered by created_at ascending
- Oldest post appears first
- Newest post appears last

**Assertions**:
```typescript
for (let i = 0; i < response.body.posts.length - 1; i++) {
  const current = new Date(response.body.posts[i].createdAt);
  const next = new Date(response.body.posts[i + 1].createdAt);
  expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
}
```

#### Test 3: Full Message Text
**Test Name**: `should return full message text (not truncated)`

**Description**: Verifies that message text in chat is not truncated (unlike News Feed).

**Test Steps**:
1. Create post with message text longer than 100 characters
2. Retrieve ring chat
3. Verify message text is not truncated

**Expected Results**:
- Message text is returned in full
- No truncation occurs

**Assertions**:
```typescript
const longMessage = 'a'.repeat(200);
const post = await createPost({ message_text: longMessage, ... });
const response = await getRingChat(userToken, ring.id);

const chatPost = response.body.posts.find(p => p.id === post.id);
expect(chatPost.messageText.length).toBe(200);
expect(chatPost.messageText).toBe(longMessage);
```

#### Test 4: Post With Image
**Test Name**: `should include image URL when post has image`

**Description**: Verifies that posts with images include image URL in chat.

**Test Steps**:
1. Create post with image_url
2. Retrieve ring chat
3. Verify post contains image_url

**Expected Results**:
- Post contains image_url field
- Image URL matches post's image_url

**Assertions**:
```typescript
const postWithImage = response.body.posts.find(p => p.imageUrl);
expect(postWithImage).toBeDefined();
expect(postWithImage.imageUrl).toBe(post2.image_url);
```

#### Test 5: Post Without Image
**Test Name**: `should not include image URL when post has no image`

**Description**: Verifies that posts without images do not include image URL (or is null).

**Test Steps**:
1. Create post without image_url
2. Retrieve ring chat
3. Verify post does not contain image_url (or is null)

**Expected Results**:
- Post image_url is null or undefined

**Assertions**:
```typescript
const postWithoutImage = response.body.posts.find(p => !p.imageUrl);
expect(postWithoutImage).toBeDefined();
expect(postWithoutImage.imageUrl).toBeNull();
```

#### Test 6: Author Username
**Test Name**: `should include author username for each post`

**Description**: Verifies that each post includes the username of the author.

**Test Steps**:
1. Create posts by different users
2. Retrieve ring chat
3. Verify each post includes author username

**Expected Results**:
- Each post contains authorUsername field
- Author username matches post creator's username

**Assertions**:
```typescript
response.body.posts.forEach(post => {
  expect(post.authorUsername).toBeDefined();
  expect(typeof post.authorUsername).toBe('string');
  expect(post.authorUsername.length).toBeGreaterThan(0);
});

// Verify specific author
const user1Post = response.body.posts.find(p => p.id === post1.id);
expect(user1Post.authorUsername).toBe(user1.username);
```

#### Test 7: Ring Details
**Test Name**: `should include ring details in response`

**Description**: Verifies that ring details (name, id) are included in response.

**Test Steps**:
1. Retrieve ring chat
2. Verify ring details are included

**Expected Results**:
- Response contains ring object
- Ring object contains id and name

**Assertions**:
```typescript
expect(response.body.ring).toBeDefined();
expect(response.body.ring.id).toBe(ring1.id);
expect(response.body.ring.name).toBe('Test Ring');
```

#### Test 8: Empty Chat - No Posts
**Test Name**: `should return empty chat when ring has no posts`

**Description**: Verifies that ring with no posts returns empty chat with appropriate message.

**Test Steps**:
1. Create ring with no posts
2. Add user as member
3. Retrieve ring chat
4. Verify empty state response

**Expected Results**:
- HTTP status code: 200 OK
- Posts array is empty
- Empty state message: "No messages yet. Be the first to post!"

**Assertions**:
```typescript
expect(response.status).toBe(200);
expect(response.body.posts).toBeDefined();
expect(Array.isArray(response.body.posts)).toBe(true);
expect(response.body.posts.length).toBe(0);
expect(response.body.emptyMessage).toBe('No messages yet. Be the first to post!');
```

#### Test 9: Authorization - Non-Member Access Denied
**Test Name**: `should deny access to ring chat for non-members`

**Description**: Verifies that users who are not members of a ring cannot access its chat.

**Test Steps**:
1. Create ring
2. Do not add user as member
3. Authenticate as user
4. Attempt to retrieve ring chat
5. Verify access is denied

**Expected Results**:
- HTTP status code: 403 Forbidden
- Error message: "You are not a member of this Ring."

**Assertions**:
```typescript
expect(response.status).toBe(403);
expect(response.body.error).toBe('You are not a member of this Ring.');
```

#### Test 10: Authentication Required
**Test Name**: `should require authentication to view ring chat`

**Description**: Verifies that unauthenticated requests are rejected.

**Test Steps**:
1. Send GET request to `/api/rings/:ringId/chat` without authentication token
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

**Description**: Verifies that request for non-existent ring returns appropriate error.

**Test Steps**:
1. Authenticate as user
2. Send GET request with non-existent ring ID
3. Verify error response

**Expected Results**:
- HTTP status code: 404 Not Found
- Error message indicates ring not found

**Assertions**:
```typescript
const nonExistentRingId = uuid();
const response = await getRingChat(userToken, nonExistentRingId);
expect(response.status).toBe(404);
expect(response.body.error).toBeDefined();
```

#### Test 12: Multiple Posts - All Returned
**Test Name**: `should return all posts in ring regardless of count`

**Description**: Verifies that all posts in ring are returned, regardless of count.

**Test Steps**:
1. Create ring with many posts (50+)
2. Retrieve ring chat
3. Verify all posts are returned

**Expected Results**:
- All posts are returned
- No pagination or limit is applied (or pagination is implemented if specified)

**Assertions**:
```typescript
const postCount = await getPostCount(ring.id);
expect(response.body.posts.length).toBe(postCount);
```

#### Test 13: Post Timestamp Format
**Test Name**: `should return post timestamps in correct format`

**Description**: Verifies that post timestamps are returned in ISO 8601 format.

**Test Steps**:
1. Retrieve ring chat
2. Verify timestamp format

**Expected Results**:
- Timestamps are in ISO 8601 format
- Timestamps can be parsed as dates

**Assertions**:
```typescript
response.body.posts.forEach(post => {
  expect(post.createdAt).toBeDefined();
  const timestamp = new Date(post.createdAt);
  expect(timestamp.getTime()).not.toBeNaN();
});
```

#### Test 14: Post ID Uniqueness
**Test Name**: `should return unique post IDs`

**Description**: Verifies that all posts have unique IDs.

**Test Steps**:
1. Retrieve ring chat with multiple posts
2. Verify all post IDs are unique

**Expected Results**:
- All post IDs are unique
- No duplicate post IDs

**Assertions**:
```typescript
const postIds = response.body.posts.map(p => p.id);
const uniquePostIds = [...new Set(postIds)];
expect(postIds.length).toBe(uniquePostIds.length);
```

### Error Handling Tests

#### Test 15: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to retrieve ring chat
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

#### Test 16: SQL Injection Prevention
**Test Name**: `should prevent SQL injection in ring ID parameter`

**Description**: Verifies that SQL injection attempts in ring ID are prevented.

**Test Steps**:
1. Attempt to retrieve chat with SQL injection payload in ring ID
2. Verify request fails safely
3. Verify no SQL injection occurs

**Expected Results**:
- Request fails with validation/not found error
- No SQL injection occurs
- Database remains secure

**Assertions**:
```typescript
const sqlInjectionRingId = "'; DROP TABLE rings; --";
const response = await getRingChat(userToken, sqlInjectionRingId);
// Should return 404 or 400, not SQL error
expect([400, 404]).toContain(response.status);
// Verify rings table still exists
const tableExists = await checkTableExists('rings');
expect(tableExists).toBe(true);
```

### Notes
- Posts are displayed in chronological order (oldest first) - opposite of News Feed
- Message text is returned in full (not truncated like News Feed)
- Only members of the ring can access the chat
- Empty state message: "No messages yet. Be the first to post!"
- Authorization check: Users must be members of the ring to view chat
- Performance: Chat should load efficiently even with many posts
