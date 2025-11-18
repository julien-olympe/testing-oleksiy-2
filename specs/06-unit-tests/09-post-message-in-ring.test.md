# Unit Test Specification: Post Message in Ring (Use Case 3.9)

## Overview
This document specifies unit tests for the Post Message in Ring use case, covering message validation, image upload, membership verification, and error conditions.

## Function/API Being Tested
- **API Endpoint**: `POST /api/rings/:id/posts`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `verifyMembership(userId: string, ringId: string): Promise<boolean>`
  - `validateMessageText(text: string): ValidationResult`
  - `validateImageFile(file: File): ValidationResult`
  - `uploadImage(file: File): Promise<string>`
  - `createPost(ringId: string, userId: string, messageText: string, imageUrl: string | null): Promise<Post>`
  - `postMessageInRing(userId: string, ringId: string, messageText: string, imageFile: File | null): Promise<Post>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for membership verification
- Mock file system operations for image upload
- Mock multipart file parsing
- Mock database insert for post creation
- Mock transaction management

### Test Data Factories
```typescript
const createTestPost = (overrides = {}) => ({
  id: 'post-uuid',
  ring_id: 'ring-uuid',
  user_id: 'user-uuid',
  message_text: 'Test message',
  image_url: null,
  created_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});

const createTestFile = (overrides = {}) => ({
  filename: 'test.jpg',
  mimetype: 'image/jpeg',
  size: 1024 * 1024, // 1MB
  ...overrides
});
```

## Test Cases

### TC-POST-001: Successful Post Creation - Text Only (Happy Path)
**Description**: Test successful post creation with text message only.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock membership verification to return true
3. Arrange: Mock message validation to pass
4. Arrange: Mock post creation to return new post
5. Arrange: Mock transaction to succeed
6. Act: Call `postMessageInRing(userId, ringId, 'Hello world', null)`
7. Assert: Verify authentication was validated
8. Assert: Verify membership was verified
9. Assert: Verify message validation was called
10. Assert: Verify post was created with correct data
11. Assert: Verify image upload was NOT called
12. Assert: Verify function returns new post data

**Expected Output**:
- Status: 201 Created
- Response: `{ id, ringId, userId, messageText, imageUrl: null, createdAt }`
- Database: Post record created

**Mock Verification**:
- `validateAuthToken` called once
- `verifyMembership` called once
- `validateMessageText` called once with 'Hello world'
- `createPost` called once with messageText and imageUrl = null
- `uploadImage` not called

---

### TC-POST-002: Successful Post Creation - Text with Image
**Description**: Test successful post creation with text and image.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock image validation to pass
4. Arrange: Mock image upload to return image URL
5. Arrange: Mock post creation to return new post
6. Act: Call `postMessageInRing(userId, ringId, 'Hello world', imageFile)`
7. Assert: Verify image validation was called
8. Assert: Verify image upload was called
9. Assert: Verify post was created with image URL
10. Assert: Verify function returns new post with image URL

**Expected Output**:
- Status: 201 Created
- Response: `{ id, ringId, userId, messageText, imageUrl: 'path/to/image.jpg', createdAt }`
- Database: Post record created with image_url
- File system: Image file stored

**Mock Verification**:
- `validateImageFile` called once
- `uploadImage` called once with image file
- `createPost` called with imageUrl

---

### TC-POST-003: Post Creation Fails - Not a Member
**Description**: Test post creation failure when user is not a member.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock membership verification to return false
3. Act: Call `postMessageInRing(userId, ringId, 'Hello world', null)`
4. Assert: Verify membership verification fails
5. Assert: Verify function returns forbidden error
6. Assert: Verify no post creation is attempted

**Expected Output**:
- Status: 403 Forbidden
- Error: "You are not a member of this Ring."

**Mock Verification**:
- `verifyMembership` called once, returns false
- `createPost` not called

---

### TC-POST-004: Post Creation Fails - Empty Message
**Description**: Test post creation failure when message is empty.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Set message text to empty string
3. Act: Call `postMessageInRing(userId, ringId, '', null)`
4. Assert: Verify message validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Message cannot be empty."

---

### TC-POST-005: Post Creation Fails - Message Too Long (5001 characters)
**Description**: Test post creation failure when message exceeds maximum length.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Set message text to 5001 characters
3. Act: Call `postMessageInRing(userId, ringId, 'a'.repeat(5001), null)`
4. Assert: Verify message validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Message must be 5000 characters or less."

---

### TC-POST-006: Post Creation Succeeds - Message at Minimum Length (1 character)
**Description**: Test successful post creation with message at minimum valid length.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock post creation
4. Act: Call `postMessageInRing(userId, ringId, 'A', null)`
5. Assert: Verify message validation passes
6. Assert: Verify post creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Post created successfully

---

### TC-POST-007: Post Creation Succeeds - Message at Maximum Length (5000 characters)
**Description**: Test successful post creation with message at maximum valid length.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock post creation
4. Act: Call `postMessageInRing(userId, ringId, 'a'.repeat(5000), null)`
5. Assert: Verify message validation passes
6. Assert: Verify post creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Post created successfully

---

### TC-POST-008: Post Creation Fails - Null Message
**Description**: Test post creation failure when message is null.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Set message text to null
3. Act: Call `postMessageInRing(userId, ringId, null, null)`
4. Assert: Verify message validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Message is required"

---

### TC-POST-009: Post Creation Fails - Image Too Large (10.1MB)
**Description**: Test post creation failure when image exceeds size limit.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock image file with size 10.1MB
4. Act: Call `postMessageInRing(userId, ringId, 'Hello', largeImageFile)`
5. Assert: Verify image validation fails
6. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Image file is too large. Maximum size is 10MB."

---

### TC-POST-010: Post Creation Succeeds - Image at Maximum Size (10MB)
**Description**: Test successful post creation with image at maximum size.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock image file with size exactly 10MB
4. Arrange: Mock image validation to pass
5. Arrange: Mock image upload
6. Act: Call `postMessageInRing(userId, ringId, 'Hello', maxSizeImageFile)`
7. Assert: Verify image validation passes
8. Assert: Verify post creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Post created with image

---

### TC-POST-011: Post Creation Fails - Invalid Image Format
**Description**: Test post creation failure when image format is invalid.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock image file with invalid format (e.g., PDF, TXT)
4. Act: Call `postMessageInRing(userId, ringId, 'Hello', invalidImageFile)`
5. Assert: Verify image validation fails
6. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Unsupported image format. Please use JPEG, PNG, or GIF."

---

### TC-POST-012: Post Creation Succeeds - JPEG Image
**Description**: Test successful post creation with JPEG image.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message validation to pass
3. Arrange: Mock JPEG image file
4. Arrange: Mock image validation to pass
5. Arrange: Mock image upload
6. Act: Call `postMessageInRing(userId, ringId, 'Hello', jpegFile)`
7. Assert: Verify image validation passes for JPEG
8. Assert: Verify post creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Post created with JPEG image

---

### TC-POST-013: Post Creation Succeeds - PNG Image
**Description**: Test successful post creation with PNG image.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock PNG image file
3. Arrange: Mock image validation to pass
4. Arrange: Mock image upload
5. Act: Call `postMessageInRing(userId, ringId, 'Hello', pngFile)`
6. Assert: Verify image validation passes for PNG
7. Assert: Verify post creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Post created with PNG image

---

### TC-POST-014: Post Creation Succeeds - GIF Image
**Description**: Test successful post creation with GIF image.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock GIF image file
3. Arrange: Mock image validation to pass
4. Arrange: Mock image upload
5. Act: Call `postMessageInRing(userId, ringId, 'Hello', gifFile)`
6. Assert: Verify image validation passes for GIF
7. Assert: Verify post creation succeeds

**Expected Output**:
- Status: 201 Created
- Response: Post created with GIF image

---

### TC-POST-015: Post Creation - Authentication Failure
**Description**: Test post creation with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `postMessageInRing(userId, ringId, 'Hello', null)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-POST-016: Post Creation - Database Connection Error
**Description**: Test post creation when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `postMessageInRing(userId, ringId, 'Hello', null)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to create post. Please try again."

---

### TC-POST-017: Post Creation - Post Insert Error
**Description**: Test post creation when post insert fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock message validation to pass
3. Arrange: Mock post creation to throw error
4. Act: Call `postMessageInRing(userId, ringId, 'Hello', null)`
5. Assert: Verify error is caught and handled
6. Assert: Verify transaction rollback is called
7. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to create post. Please try again."

**Mock Verification**:
- Transaction rollback called
- No partial data saved

---

### TC-POST-018: Post Creation - Image Upload Error
**Description**: Test post creation when image upload fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock message and image validation to pass
3. Arrange: Mock image upload to throw error
4. Act: Call `postMessageInRing(userId, ringId, 'Hello', imageFile)`
5. Assert: Verify error is caught and handled
6. Assert: Verify transaction rollback is called
7. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to upload image. Please try again."

**Mock Verification**:
- Transaction rollback called
- No post created

---

### TC-POST-019: Post Creation - File System Error (Disk Full)
**Description**: Test post creation when file system is full.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock message and image validation to pass
3. Arrange: Mock file system write to throw "ENOSPC" error
4. Act: Call `postMessageInRing(userId, ringId, 'Hello', imageFile)`
5. Assert: Verify error is caught and handled
6. Assert: Verify user-friendly error message is returned

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to upload image. Please try again."

---

### TC-POST-020: Post Creation - Transaction Rollback on Error
**Description**: Test that transaction is rolled back if any step fails.

**Test Steps**:
1. Arrange: Mock transaction begin
2. Arrange: Mock membership verification to succeed
3. Arrange: Mock message validation to pass
4. Arrange: Mock image upload to succeed
5. Arrange: Mock post creation to fail
6. Act: Call `postMessageInRing(userId, ringId, 'Hello', imageFile)`
7. Assert: Verify transaction rollback is called
8. Assert: Verify no partial data is saved
9. Assert: Verify uploaded image is cleaned up (if applicable)

**Mock Verification**:
- Transaction begin called
- Transaction rollback called on error
- No post record created

---

### TC-POST-021: Post Creation - Created Timestamp
**Description**: Test that post creation timestamp is set correctly.

**Test Steps**:
1. Arrange: Mock all dependencies
2. Arrange: Mock current timestamp
3. Act: Call `postMessageInRing(userId, ringId, 'Hello', null)`
4. Assert: Verify created_at timestamp is set to current time
5. Assert: Verify timestamp is in correct format

**Expected Output**:
- Post created_at set to current timestamp
- Timestamp format is ISO 8601 or PostgreSQL TIMESTAMP

---

### TC-POST-022: Post Creation - Post ID Generation
**Description**: Test that post ID is generated correctly (UUID).

**Test Steps**:
1. Arrange: Mock all dependencies
2. Act: Call `postMessageInRing(userId, ringId, 'Hello', null)`
3. Assert: Verify post ID is generated (UUID format)
4. Assert: Verify ID is unique
5. Assert: Verify ID is included in response

**Expected Output**:
- Post id is valid UUID
- ID is unique for each post

---

### TC-POST-023: Post Creation - Rate Limiting
**Description**: Test that post creation endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 10 requests per minute per user
3. Act: Call post creation endpoint 11 times rapidly
4. Assert: Verify first 10 requests succeed
5. Assert: Verify 11th request returns 429 Too Many Requests

**Expected Output**:
- First 10 requests: 201 Created
- 11th request: 429 Too Many Requests

---

### TC-POST-024: Post Creation - Message with Special Characters
**Description**: Test post creation with special characters in message.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message with special characters (emojis, unicode, HTML)
3. Act: Call `postMessageInRing(userId, ringId, 'Hello <script>alert("xss")</script>', null)`
4. Assert: Verify message is stored correctly
5. Assert: Verify XSS attempts are sanitized or escaped

**Expected Output**:
- Status: 201 Created
- Message stored with special characters
- XSS attempts sanitized/escaped

---

### TC-POST-025: Post Creation - SQL Injection Prevention
**Description**: Test that message text prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock message with SQL injection attempt
3. Act: Call `postMessageInRing(userId, ringId, "'; DROP TABLE posts; --", null)`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as message text
6. Assert: Verify database is not compromised

**Expected Output**:
- Status: 201 Created
- SQL injection attempt treated as literal message text
- No database damage

---

### TC-POST-026: Post Creation - Concurrent Posts
**Description**: Test handling of concurrent post creation.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Act: Simulate 10 concurrent post creation calls
3. Assert: Verify all posts are created successfully
4. Assert: Verify each post has unique ID
5. Assert: Verify database handles concurrent inserts

**Expected Output**:
- All 10 posts: 201 Created
- Each post has unique ID
- No race conditions

---

### TC-POST-027: Post Creation - Image URL Storage
**Description**: Test that image URL is stored correctly in database.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock image upload to return URL
3. Act: Call `postMessageInRing(userId, ringId, 'Hello', imageFile)`
4. Assert: Verify image URL is stored in post.image_url
5. Assert: Verify URL is valid file path or URL

**Expected Output**:
- Post image_url contains uploaded image path/URL
- URL is valid and accessible

---

### TC-POST-028: Post Creation - Image File Validation (MIME Type)
**Description**: Test that image MIME type is validated.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock image file with incorrect MIME type
3. Act: Call `postMessageInRing(userId, ringId, 'Hello', invalidMimeFile)`
4. Assert: Verify MIME type validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Unsupported image format. Please use JPEG, PNG, or GIF."
