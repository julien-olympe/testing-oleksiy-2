# Use Case 3.8: View Ring Chat - End-to-End Tests

## Test Name: View Ring Chat - Positive Cases

### Test 3.8.1: View Ring Chat with Multiple Messages

**Test Description**: Validates that authenticated user can view Ring Chat displaying all posts in chronological order (oldest first).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_chat_001` is registered and logged in
3. User is a member of Ring `ChatRing_001`
4. Ring has 5 posts from different users:
   - Post 1: "First message" (created 5 hours ago, text only)
   - Post 2: "Second message" (created 4 hours ago, with image)
   - Post 3: "Third message" (created 3 hours ago, text only)
   - Post 4: "Fourth message" (created 2 hours ago, with image)
   - Post 5: "Fifth message" (created 1 hour ago, text only)

**Test Data**:
- User: `testuser_chat_001`
- Ring: `ChatRing_001`
- Posts: 5 posts with various content and timestamps

**Test Steps**:
1. Ensure user is logged in as `testuser_chat_001`
2. Navigate to My Rings screen
3. Click on Ring `ChatRing_001`
4. Observe Ring Chat display

**Expected Results**:
- Ring Chat screen displays:
  - Ring name header: `ChatRing_001`
  - Member count (e.g., "5 members")
  - "Add User" button in header
  - Chat messages area showing all 5 posts in chronological order (oldest first):
    1. "First message" (5 hours ago)
    2. "Second message" (4 hours ago) with image
    3. "Third message" (3 hours ago)
    4. "Fourth message" (2 hours ago) with image
    5. "Fifth message" (1 hour ago)
  - Each message displays:
    - Author username
    - Full message text (not truncated)
    - Picture (if message includes one, displayed as image, clickable to view full size)
    - Timestamp (formatted as time or relative time)
  - Message input area at the bottom
  - Footer navigation is visible

**Assertions**:
- HTTP status code: 200
- All posts are displayed in chronological order (oldest first)
- Full message text is shown (not truncated to 100 chars like News Feed)
- Images are displayed correctly
- Author usernames are displayed
- Timestamps are displayed correctly

---

### Test 3.8.2: View Ring Chat with Text-Only Messages

**Test Description**: Validates that Ring Chat correctly displays text-only messages (no images).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_textonly_001` is registered and logged in
3. User is a member of Ring `TextOnlyChatRing_001`
4. Ring has 3 text-only posts (no images)

**Test Data**:
- User: `testuser_textonly_001`
- Ring: `TextOnlyChatRing_001`
- Posts: 3 text-only posts

**Test Steps**:
1. Ensure user is logged in as `testuser_textonly_001`
2. Navigate to My Rings screen
3. Click on Ring `TextOnlyChatRing_001`
4. Observe Ring Chat display

**Expected Results**:
- Ring Chat displays all 3 text-only posts
- Messages show:
  - Author username
  - Full message text
  - Timestamp
  - No image placeholder or image area
- Messages are in chronological order

**Assertions**:
- HTTP status code: 200
- Text-only messages display correctly
- No image-related errors occur
- Full message text is visible

---

### Test 3.8.3: View Ring Chat with Long Message Text

**Test Description**: Validates that Ring Chat displays full message text even for long messages (not truncated like News Feed).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_longtext_001` is registered and logged in
3. User is a member of Ring `LongTextChatRing_001`
4. Ring has a post with message text of 5000 characters (maximum length)

**Test Data**:
- User: `testuser_longtext_001`
- Ring: `LongTextChatRing_001`
- Post: Message text of 5000 characters

**Test Steps**:
1. Ensure user is logged in as `testuser_longtext_001`
2. Navigate to My Rings screen
3. Click on Ring `LongTextChatRing_001`
4. Observe Ring Chat display
5. Verify full message text is visible

**Expected Results**:
- Ring Chat displays the post with full 5000-character message text
- Message text is NOT truncated (unlike News Feed which shows only first 100 chars)
- Full message is scrollable if it exceeds viewport
- Author, timestamp are displayed correctly

**Assertions**:
- HTTP status code: 200
- Full message text is displayed (not truncated)
- Message is readable and scrollable
- No truncation occurs in Ring Chat

---

### Test 3.8.4: View Ring Chat - Navigate from News Feed

**Test Description**: Validates that clicking a News Tile in News Feed navigates to the corresponding Ring Chat.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_navigate_001` is registered and logged in
3. User is a member of Ring `NavigateRing_001`
4. Ring has at least 1 post

**Test Data**:
- User: `testuser_navigate_001`
- Ring: `NavigateRing_001`
- Post: At least 1 post in the Ring

**Test Steps**:
1. Ensure user is logged in as `testuser_navigate_001`
2. Navigate to Home screen (News Feed)
3. Observe News Feed showing post from `NavigateRing_001`
4. Click on the News Tile for `NavigateRing_001`

**Expected Results**:
- User is navigated to Ring Chat screen for `NavigateRing_001`
- Ring Chat displays:
  - Ring name: `NavigateRing_001`
  - All posts in the Ring
  - Message input area
- Navigation is successful

**Assertions**:
- HTTP status code: 200
- Navigation from News Feed to Ring Chat works correctly
- Correct Ring is displayed
- All posts are visible

---

### Test 3.8.5: View Ring Chat - Navigate from My Rings

**Test Description**: Validates that clicking a Ring item in My Rings list navigates to that Ring's Chat screen.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_myrings_nav_001` is registered and logged in
3. User is a member of Ring `MyRingsNavRing_001`
4. Ring has at least 1 post

**Test Data**:
- User: `testuser_myrings_nav_001`
- Ring: `MyRingsNavRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_myrings_nav_001`
2. Navigate to My Rings screen
3. Click on Ring `MyRingsNavRing_001`

**Expected Results**:
- User is navigated to Ring Chat screen for `MyRingsNavRing_001`
- Ring Chat displays correctly with all posts
- Navigation is successful

**Assertions**:
- HTTP status code: 200
- Navigation from My Rings to Ring Chat works correctly
- Correct Ring is displayed

---

### Test 3.8.6: View Ring Chat - Polling Updates

**Test Description**: Validates that Ring Chat automatically polls for new messages and updates the display.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_polling_001` is registered and logged in
3. User is a member of Ring `PollingChatRing_001`
4. Ring initially has 2 posts
5. Another user will create a new post in the Ring during the test

**Test Data**:
- User: `testuser_polling_001`
- Ring: `PollingChatRing_001`
- Initial posts: 2 posts (created before test)
- New post: "New message after polling" (created by another user during test)

**Test Steps**:
1. Ensure user is logged in as `testuser_polling_001`
2. Navigate to Ring Chat for `PollingChatRing_001`
3. Observe initial chat (should show 2 posts)
4. Wait for polling interval (up to 30 seconds)
5. Observe chat after polling

**Expected Results**:
- Initial chat shows 2 posts
- After polling interval (within 30 seconds), chat updates
- New post appears at the bottom of the chat (newest messages at bottom)
- Chat now shows 3 posts
- Polling continues while user is on Ring Chat screen
- Auto-scroll to bottom when new messages arrive

**Assertions**:
- Polling occurs automatically every 30 seconds (maximum)
- New messages appear in chat after polling
- Chat updates without requiring manual refresh
- Messages remain correctly ordered (oldest first, newest at bottom)
- Auto-scroll works when new messages arrive

---

## Test Name: View Ring Chat - Empty States

### Test 3.8.7: View Ring Chat with No Messages

**Test Description**: Validates that Ring Chat displays appropriate empty state when Ring has no posts.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_empty_001` is registered and logged in
3. User is a member of Ring `EmptyChatRing_001`
4. Ring has no posts

**Test Data**:
- User: `testuser_empty_001`
- Ring: `EmptyChatRing_001` (no posts)

**Test Steps**:
1. Ensure user is logged in as `testuser_empty_001`
2. Navigate to My Rings screen
3. Click on Ring `EmptyChatRing_001`
4. Observe Ring Chat display

**Expected Results**:
- Ring Chat screen displays:
  - Ring name header: `EmptyChatRing_001`
  - Member count
  - "Add User" button in header
  - Empty state message: "No messages yet. Be the first to post!"
  - Message input area at the bottom (user can post)
  - Footer navigation is visible

**Assertions**:
- HTTP status code: 200
- Empty state message text matches exactly: "No messages yet. Be the first to post!"
- No message items are displayed
- User can still post messages (input area is available)

---

## Test Name: View Ring Chat - Access Denied Cases

### Test 3.8.8: View Ring Chat - Access Denied (Not a Member)

**Test Description**: Validates that user cannot access Ring Chat for a Ring they are not a member of.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_notmember_001` is registered and logged in
3. Ring `AccessDeniedRing_001` exists but user is NOT a member
4. Attempt to access Ring via direct URL or invalid navigation

**Test Data**:
- User: `testuser_notmember_001`
- Ring: `AccessDeniedRing_001` (user is not a member)

**Test Steps**:
1. Ensure user is logged in as `testuser_notmember_001`
2. Attempt to access Ring Chat for `AccessDeniedRing_001` (via direct URL or API call)

**Expected Results**:
- Access is denied
- Error message is displayed: "You are not a member of this Ring."
- User is redirected to an appropriate screen (Home or My Rings)
- OR error message is shown in Ring Chat screen

**Assertions**:
- HTTP status code: 403 (Forbidden)
- Error message text matches exactly: "You are not a member of this Ring."
- User cannot view Ring Chat content
- Note: This should not happen through normal navigation (users can only see Rings they're members of), but should be tested for security

---

## Cleanup
- Test users and Rings created for Ring Chat tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
