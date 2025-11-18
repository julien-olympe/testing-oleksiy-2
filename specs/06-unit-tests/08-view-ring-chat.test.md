# Unit Test Specification: View Ring Chat (Use Case 3.8)

## Overview
This document specifies unit tests for the View Ring Chat use case, covering membership verification, post retrieval, chronological ordering, and access control.

## Function/API Being Tested
- **API Endpoint**: `GET /api/rings/:id/chat`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `verifyMembership(userId: string, ringId: string): Promise<boolean>`
  - `getRingDetails(ringId: string): Promise<Ring>`
  - `getPostsForRing(ringId: string): Promise<Post[]>`
  - `getPostAuthor(postId: string): Promise<User>`
  - `formatPostForChat(post: Post, author: User): ChatPost`
  - `getRingChat(userId: string, ringId: string): Promise<RingChatData>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for membership verification
- Mock database queries for ring details
- Mock database queries for posts
- Mock database queries for post authors

## Test Cases

### TC-CHAT-001: Successful Ring Chat Retrieval (Happy Path)
**Description**: Test successful retrieval of Ring Chat with posts.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock membership verification to return true
3. Arrange: Mock ring details to return ring
4. Arrange: Mock posts to return 10 posts
5. Arrange: Mock post authors for each post
6. Act: Call `getRingChat(userId, ringId)`
7. Assert: Verify authentication was validated
8. Assert: Verify membership was verified
9. Assert: Verify ring details were retrieved
10. Assert: Verify posts were retrieved for ring
11. Assert: Verify posts are ordered by creation timestamp ascending (oldest first)
12. Assert: Verify each post includes author username
13. Assert: Verify response contains ring name and posts array

**Expected Output**:
- Status: 200 OK
- Response: `{ ringName, posts: [ChatPost...] }`
- Posts ordered by created_at ASC (oldest first)
- Each post: `{ id, messageText, imageUrl, authorUsername, createdAt }`

**Mock Verification**:
- `validateAuthToken` called once
- `verifyMembership` called once with user_id and ring_id
- `getPostsForRing` called once with ring_id
- Posts ordered by created_at ASC

---

### TC-CHAT-002: Ring Chat - Empty State (No Posts)
**Description**: Test Ring Chat when ring has no posts.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock ring details
3. Arrange: Mock posts to return empty array
4. Act: Call `getRingChat(userId, ringId)`
5. Assert: Verify empty posts array is returned
6. Assert: Verify ring name is included

**Expected Output**:
- Status: 200 OK
- Response: `{ ringName, posts: [] }`
- Frontend displays: "No messages yet. Be the first to post!"

---

### TC-CHAT-003: Ring Chat - Access Denied (Not a Member)
**Description**: Test Ring Chat access when user is not a member.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock membership verification to return false
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify membership verification fails
5. Assert: Verify function returns forbidden error
6. Assert: Verify no ring or post queries are executed

**Expected Output**:
- Status: 403 Forbidden
- Error: "You are not a member of this Ring."

**Mock Verification**:
- `verifyMembership` called once, returns false
- `getRingDetails` not called
- `getPostsForRing` not called

---

### TC-CHAT-004: Ring Chat - Authentication Failure
**Description**: Test Ring Chat retrieval with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `getRingChat(userId, ringId)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-CHAT-005: Ring Chat - Posts Ordered Chronologically (Oldest First)
**Description**: Test that posts are ordered by creation timestamp ascending.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock posts with different timestamps:
   - Post 1: created_at = 2024-01-01 10:00:00
   - Post 2: created_at = 2024-01-01 11:00:00
   - Post 3: created_at = 2024-01-01 09:00:00
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify posts are ordered: Post 3, Post 1, Post 2 (oldest first)

**Expected Output**:
- Posts in response ordered by created_at ASC
- First post in array is oldest

---

### TC-CHAT-006: Ring Chat - Full Message Text (Not Truncated)
**Description**: Test that message text is not truncated in Chat view.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock post with message_text of 5000 characters (maximum)
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify message text is full length (not truncated)
5. Assert: Verify no ellipsis is added

**Expected Output**:
- Post messageText is full 5000 characters
- No truncation in Chat view

---

### TC-CHAT-007: Ring Chat - Posts with Images
**Description**: Test Chat post formatting for posts with images.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock post with image_url set
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify Chat post includes imageUrl
5. Assert: Verify imageUrl matches post.image_url

**Expected Output**:
- ChatPost.imageUrl is set to post.image_url value

---

### TC-CHAT-008: Ring Chat - Posts without Images
**Description**: Test Chat post formatting for posts without images.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock post with image_url = null
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify Chat post has imageUrl = null or undefined

**Expected Output**:
- ChatPost.imageUrl is null or undefined

---

### TC-CHAT-009: Ring Chat - Author Username Included
**Description**: Test that post author username is included in Chat posts.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock posts with user_id
3. Arrange: Mock post authors
4. Act: Call `getRingChat(userId, ringId)`
5. Assert: Verify author username is retrieved for each post
6. Assert: Verify author username is included in Chat post

**Expected Output**:
- Each ChatPost includes authorUsername
- Username matches post author

---

### TC-CHAT-010: Ring Chat - Database Connection Error
**Description**: Test Ring Chat retrieval when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load chat. Please try again."

---

### TC-CHAT-011: Ring Chat - Membership Verification Error
**Description**: Test Ring Chat retrieval when membership verification fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock membership verification to throw error
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load chat. Please try again."

---

### TC-CHAT-012: Ring Chat - Post Query Error
**Description**: Test Ring Chat retrieval when post query fails.

**Test Steps**:
1. Arrange: Mock authentication and membership verification to succeed
2. Arrange: Mock post query to throw error
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load chat. Please try again."

---

### TC-CHAT-013: Ring Chat - Ring Not Found
**Description**: Test Ring Chat retrieval when ring does not exist.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock ring details query to return null
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify function returns not found error

**Expected Output**:
- Status: 404 Not Found
- Error: "Ring not found"

---

### TC-CHAT-014: Ring Chat - Performance with Many Posts
**Description**: Test Ring Chat performance with large number of posts.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock posts to return 1000 posts
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify query completes within 500ms
5. Assert: Verify all posts are retrieved and formatted

**Expected Output**:
- Status: 200 OK
- Response time: < 500ms
- All 1000 posts included

---

### TC-CHAT-015: Ring Chat - Concurrent Requests
**Description**: Test handling of concurrent Ring Chat requests.

**Test Steps**:
1. Arrange: Mock authentication and database
2. Act: Simulate 100 concurrent Ring Chat requests
3. Assert: Verify all requests complete successfully
4. Assert: Verify database connection pool handles concurrent queries

**Expected Output**:
- All 100 requests: 200 OK
- No connection pool exhaustion

---

### TC-CHAT-016: Ring Chat - Message with Special Characters
**Description**: Test Chat post formatting with special characters in message.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock post with message containing special characters (emojis, unicode, HTML)
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify special characters are handled correctly
5. Assert: Verify no XSS vulnerabilities

**Expected Output**:
- Special characters displayed correctly
- HTML/script tags escaped or stripped

---

### TC-CHAT-017: Ring Chat - Timestamp Formatting
**Description**: Test that timestamps are correctly formatted in Chat posts.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock posts with various timestamps
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify timestamps are included in Chat posts
5. Assert: Verify timestamp format is consistent

**Expected Output**:
- Each ChatPost includes createdAt timestamp
- Timestamp format is ISO 8601 or consistent format

---

### TC-CHAT-018: Ring Chat - Invalid Ring ID
**Description**: Test Ring Chat retrieval with invalid ring ID format.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Set ringId to invalid UUID format
3. Act: Call `getRingChat(userId, 'invalid-id')`
4. Assert: Verify validation fails
5. Assert: Verify function returns bad request error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Invalid ring ID"

---

### TC-CHAT-019: Ring Chat - Multiple Authors
**Description**: Test Ring Chat with posts from multiple authors.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock posts from 5 different authors
3. Arrange: Mock post authors
4. Act: Call `getRingChat(userId, ringId)`
5. Assert: Verify all author usernames are retrieved correctly
6. Assert: Verify each post has correct author

**Expected Output**:
- All posts include correct authorUsername
- Multiple authors handled correctly

---

### TC-CHAT-020: Ring Chat - Ring Name Included
**Description**: Test that ring name is included in response.

**Test Steps**:
1. Arrange: Mock authentication and membership verification
2. Arrange: Mock ring details with name
3. Act: Call `getRingChat(userId, ringId)`
4. Assert: Verify ring name is included in response
5. Assert: Verify ring name matches ring details

**Expected Output**:
- Response includes ringName field
- Ring name matches ring.name
