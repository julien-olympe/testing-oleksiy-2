# Post Message in Ring Test Specification

## Test File: `post-message-in-ring.test.ts`

### Purpose
Tests for Post Message in Ring use case (3.9) covering successful post creation, validation failures, image uploads, authorization, and boundary conditions.

### Test Setup

**Before All Tests**:
```typescript
beforeAll(async () => {
  // Initialize test database connection
  // Set up test database schema
  // Set up test file storage
});
```

**Before Each Test**:
```typescript
beforeEach(async () => {
  // Clear all tables
  // Clear test file storage
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
  // Clean up uploaded files
  // Reset database state
});
```

### Test Data

**Valid Test Posts**:
```typescript
const validPost1 = {
  ring_id: ring1.id,
  message_text: 'Hello, this is a test message',
  image: null
};

const validPost2 = {
  ring_id: ring1.id,
  message_text: 'A'.repeat(1), // Minimum length
  image: null
};

const validPost3 = {
  ring_id: ring1.id,
  message_text: 'A'.repeat(5000), // Maximum length
  image: null
};
```

**Invalid Test Posts**:
```typescript
const invalidPosts = {
  emptyMessage: { ring_id: ring1.id, message_text: '', image: null },
  tooLongMessage: { ring_id: ring1.id, message_text: 'A'.repeat(5001), image: null },
  missingMessage: { ring_id: ring1.id, image: null },
  invalidRingId: { ring_id: uuid(), message_text: 'Test', image: null },
  missingRingId: { message_text: 'Test', image: null }
};
```

**Test Images**:
```typescript
const validImageJPEG = { buffer: Buffer.from('...'), mimetype: 'image/jpeg', size: 1024 * 1024 }; // 1MB
const validImagePNG = { buffer: Buffer.from('...'), mimetype: 'image/png', size: 2 * 1024 * 1024 }; // 2MB
const validImageGIF = { buffer: Buffer.from('...'), mimetype: 'image/gif', size: 5 * 1024 * 1024 }; // 5MB
const tooLargeImage = { buffer: Buffer.from('...'), mimetype: 'image/jpeg', size: 11 * 1024 * 1024 }; // 11MB
const invalidFormatImage = { buffer: Buffer.from('...'), mimetype: 'image/bmp', size: 1024 * 1024 };
```

### Test Cases

#### Test 1: Successful Post Creation - Text Only - Happy Path
**Test Name**: `should successfully create post with text message`

**Description**: Verifies that authenticated member can create a post with text message in a ring.

**Test Steps**:
1. Create ring and add user as member
2. Authenticate as user
3. Send POST request to `/api/rings/:ringId/posts` with message text
4. Verify response status code is 201 Created
5. Verify post is created in database
6. Verify post data is returned

**Expected Results**:
- HTTP status code: 201 Created
- Response body contains post data (id, ring_id, user_id, message_text, created_at)
- Post record exists in database
- Post appears in ring chat
- Post appears in news feed for all ring members

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post).toBeDefined();
expect(response.body.post.id).toBeDefined();
expect(response.body.post.ring_id).toBe(ring1.id);
expect(response.body.post.user_id).toBe(user.id);
expect(response.body.post.message_text).toBe(validPost1.message_text);
expect(response.body.post.created_at).toBeDefined();

// Verify post in database
const dbPost = await getPostFromDB(response.body.post.id);
expect(dbPost).toBeDefined();
expect(dbPost.message_text).toBe(validPost1.message_text);
```

#### Test 2: Successful Post Creation - With Image
**Test Name**: `should successfully create post with text and image`

**Description**: Verifies that authenticated member can create a post with both text and image.

**Test Steps**:
1. Create ring and add user as member
2. Authenticate as user
3. Send POST request with message text and image file
4. Verify post is created
5. Verify image is uploaded and stored
6. Verify image URL is stored in database

**Expected Results**:
- HTTP status code: 201 Created
- Post is created with image_url
- Image file is stored in filesystem
- Image URL is valid

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.image_url).toBeDefined();
expect(response.body.post.image_url).not.toBeNull();
// Verify image file exists
const imageExists = await checkFileExists(response.body.post.image_url);
expect(imageExists).toBe(true);
```

#### Test 3: Message Text Validation - Minimum Length
**Test Name**: `should create post with minimum length message (1 character)`

**Description**: Verifies that message text with exactly 1 character is accepted.

**Test Steps**:
1. Send POST request with message text of exactly 1 character
2. Verify post is created successfully

**Expected Results**:
- HTTP status code: 201 Created
- Post is created with 1-character message

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.message_text.length).toBe(1);
```

#### Test 4: Message Text Validation - Maximum Length
**Test Name**: `should create post with maximum length message (5000 characters)`

**Description**: Verifies that message text with exactly 5000 characters is accepted.

**Test Steps**:
1. Send POST request with message text of exactly 5000 characters
2. Verify post is created successfully

**Expected Results**:
- HTTP status code: 201 Created
- Post is created with 5000-character message

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.message_text.length).toBe(5000);
```

#### Test 5: Message Text Validation - Empty Message
**Test Name**: `should reject post creation with empty message`

**Description**: Verifies that post creation with empty message is rejected.

**Test Steps**:
1. Send POST request with empty message text
2. Verify creation fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Message cannot be empty."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Message cannot be empty.');
```

#### Test 6: Message Text Validation - Too Long
**Test Name**: `should reject post creation with message longer than 5000 characters`

**Description**: Verifies that post creation with message longer than 5000 characters is rejected.

**Test Steps**:
1. Send POST request with message text of 5001 characters
2. Verify creation fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Message must be 5000 characters or less."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Message must be 5000 characters or less.');
```

#### Test 7: Image Upload - Valid JPEG
**Test Name**: `should accept JPEG image upload`

**Description**: Verifies that JPEG image files are accepted.

**Test Steps**:
1. Send POST request with valid JPEG image
2. Verify post is created with image

**Expected Results**:
- HTTP status code: 201 Created
- Image is uploaded and stored
- Image URL is returned

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.image_url).toBeDefined();
expect(response.body.post.image_url).toMatch(/\.(jpg|jpeg)$/i);
```

#### Test 8: Image Upload - Valid PNG
**Test Name**: `should accept PNG image upload`

**Description**: Verifies that PNG image files are accepted.

**Test Steps**:
1. Send POST request with valid PNG image
2. Verify post is created with image

**Expected Results**:
- HTTP status code: 201 Created
- Image is uploaded and stored
- Image URL is returned

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.image_url).toBeDefined();
expect(response.body.post.image_url).toMatch(/\.png$/i);
```

#### Test 9: Image Upload - Valid GIF
**Test Name**: `should accept GIF image upload`

**Description**: Verifies that GIF image files are accepted.

**Test Steps**:
1. Send POST request with valid GIF image
2. Verify post is created with image

**Expected Results**:
- HTTP status code: 201 Created
- Image is uploaded and stored
- Image URL is returned

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.image_url).toBeDefined();
expect(response.body.post.image_url).toMatch(/\.gif$/i);
```

#### Test 10: Image Upload - Invalid Format
**Test Name**: `should reject image upload with unsupported format`

**Description**: Verifies that image files with unsupported formats are rejected.

**Test Steps**:
1. Send POST request with BMP or other unsupported image format
2. Verify creation fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Unsupported image format. Please use JPEG, PNG, or GIF."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Unsupported image format. Please use JPEG, PNG, or GIF.');
```

#### Test 11: Image Upload - File Size - Maximum (10MB)
**Test Name**: `should accept image upload up to 10MB`

**Description**: Verifies that image files up to 10MB are accepted.

**Test Steps**:
1. Send POST request with image file of exactly 10MB
2. Verify post is created successfully

**Expected Results**:
- HTTP status code: 201 Created
- Image is uploaded and stored

**Assertions**:
```typescript
expect(response.status).toBe(201);
expect(response.body.post.image_url).toBeDefined();
```

#### Test 12: Image Upload - File Size - Too Large
**Test Name**: `should reject image upload larger than 10MB`

**Description**: Verifies that image files larger than 10MB are rejected.

**Test Steps**:
1. Send POST request with image file larger than 10MB
2. Verify creation fails with validation error

**Expected Results**:
- HTTP status code: 400 Bad Request
- Error message: "Image file is too large. Maximum size is 10MB."

**Assertions**:
```typescript
expect(response.status).toBe(400);
expect(response.body.error).toBe('Image file is too large. Maximum size is 10MB.');
```

#### Test 13: Authorization - Non-Member Posting Denied
**Test Name**: `should deny post creation for non-members`

**Description**: Verifies that users who are not members of a ring cannot create posts.

**Test Steps**:
1. Create ring
2. Do not add user as member
3. Authenticate as user
4. Attempt to create post in ring
5. Verify creation is denied

**Expected Results**:
- HTTP status code: 403 Forbidden
- Error message: "You are not a member of this Ring."

**Assertions**:
```typescript
expect(response.status).toBe(403);
expect(response.body.error).toBe('You are not a member of this Ring.');
```

#### Test 14: Authentication Required
**Test Name**: `should require authentication to create post`

**Description**: Verifies that unauthenticated post creation requests are rejected.

**Test Steps**:
1. Send POST request to `/api/rings/:ringId/posts` without authentication token
2. Verify request is rejected

**Expected Results**:
- HTTP status code: 401 Unauthorized
- Error message indicates authentication required

**Assertions**:
```typescript
expect(response.status).toBe(401);
expect(response.body.error).toBeDefined();
```

#### Test 15: Invalid Ring ID
**Test Name**: `should return error for non-existent ring`

**Description**: Verifies that post creation in non-existent ring returns appropriate error.

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
const response = await createPost(userToken, nonExistentRingId, { message_text: 'Test' });
expect(response.status).toBe(404);
expect(response.body.error).toBeDefined();
```

#### Test 16: Post Appears in Ring Chat
**Test Name**: `should make post immediately visible in ring chat`

**Description**: Verifies that created post appears in ring chat immediately.

**Test Steps**:
1. Create post in ring
2. Retrieve ring chat
3. Verify post is included in chat

**Expected Results**:
- Post appears in ring chat
- Post data matches created post

**Assertions**:
```typescript
const createResponse = await createPost(userToken, ring.id, { message_text: 'Test message' });
const chatResponse = await getRingChat(userToken, ring.id);

const postInChat = chatResponse.body.posts.find(p => p.id === createResponse.body.post.id);
expect(postInChat).toBeDefined();
expect(postInChat.messageText).toBe('Test message');
```

#### Test 17: Post Appears in News Feed
**Test Name**: `should make post appear in news feed for all ring members`

**Description**: Verifies that created post appears in news feed for all ring members.

**Test Steps**:
1. Create ring with multiple members
2. Create post in ring
3. Retrieve news feed for each member
4. Verify post appears in all members' news feeds

**Expected Results**:
- Post appears in news feed for all ring members
- Post appears in news feed for post creator

**Assertions**:
```typescript
const post = await createPost(user1Token, ring.id, { message_text: 'Test message' });

// Check news feed for all members
const feed1 = await getNewsFeed(user1Token);
const feed2 = await getNewsFeed(user2Token);
const feed3 = await getNewsFeed(user3Token);

expect(feed1.body.newsFeed.some(tile => tile.postId === post.body.post.id)).toBe(true);
expect(feed2.body.newsFeed.some(tile => tile.postId === post.body.post.id)).toBe(true);
expect(feed3.body.newsFeed.some(tile => tile.postId === post.body.post.id)).toBe(true);
```

#### Test 18: Created At Timestamp
**Test Name**: `should set created_at timestamp on post creation`

**Description**: Verifies that post created_at timestamp is set upon creation.

**Test Steps**:
1. Create post
2. Verify created_at timestamp is set
3. Verify timestamp is close to current time

**Expected Results**:
- created_at timestamp is set
- Timestamp is close to current time

**Assertions**:
```typescript
expect(response.body.post.created_at).toBeDefined();
const createdAt = new Date(response.body.post.created_at);
expect(createdAt.getTime()).toBeCloseTo(Date.now(), -3);
```

#### Test 19: User ID Assignment
**Test Name**: `should set user_id to authenticated user's id`

**Description**: Verifies that post user_id is set to the authenticated user who created it.

**Test Steps**:
1. Authenticate as user1
2. Create post
3. Verify user_id is user1.id

**Expected Results**:
- Post user_id matches authenticated user's id

**Assertions**:
```typescript
expect(response.body.post.user_id).toBe(user1.id);
const dbPost = await getPostFromDB(response.body.post.id);
expect(dbPost.user_id).toBe(user1.id);
```

#### Test 20: Database Transaction - Atomicity
**Test Name**: `should create post and store image in single transaction`

**Description**: Verifies that post creation and image storage are atomic (both succeed or both fail).

**Test Steps**:
1. Simulate failure after post creation but before image storage
2. Verify transaction is rolled back
3. Verify no partial data is created

**Expected Results**:
- If image storage fails, post creation is rolled back
- No orphaned post records exist
- Database state remains consistent

**Assertions**:
```typescript
// Simulate failure scenario
// Verify no post or image is created
const postCount = await getPostCount(ring.id);
expect(postCount).toBe(0);
```

### Error Handling Tests

#### Test 21: File Upload Error
**Test Name**: `should handle file upload errors gracefully`

**Description**: Verifies that file upload errors (disk full, permission denied) are handled.

**Test Steps**:
1. Simulate file system error (disk full, permission denied)
2. Attempt to create post with image
3. Verify error response

**Expected Results**:
- HTTP status code: 500 Internal Server Error
- Error message: User-friendly message (not technical details)

**Assertions**:
```typescript
expect(response.status).toBe(500);
expect(response.body.error).toBeDefined();
expect(response.body.error).not.toContain('ENOSPC'); // No technical details
```

#### Test 22: Database Connection Error
**Test Name**: `should handle database connection error gracefully`

**Description**: Verifies that database connection errors are handled and return appropriate error response.

**Test Steps**:
1. Simulate database connection failure
2. Attempt to create post
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
- Message text must be between 1 and 5000 characters
- Image uploads: Maximum 10MB, formats: JPEG, PNG, GIF
- Only members of the ring can create posts
- Post appears immediately in ring chat and news feed for all ring members
- Post creation and image storage must be atomic (single transaction)
- Performance: Post creation should complete quickly (< 1 second)
