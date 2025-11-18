# Use Case 3.3: View News Feed - End-to-End Tests

## Test Name: View News Feed - Positive Cases

### Test 3.3.1: View News Feed with Multiple Posts from Multiple Rings

**Test Description**: Validates that authenticated user can view News Feed displaying posts from all Rings they are members of, ordered newest first.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_newsfeed_001` is registered and logged in
3. User is a member of at least 2 Rings: `RingA_001` and `RingB_001`
4. RingA_001 has 2 posts (created at different times)
5. RingB_001 has 1 post
6. Posts are from different users and include both text-only and text-with-image posts

**Test Data**:
- User: `testuser_newsfeed_001`
- Ring 1: `RingA_001` with posts:
  - Post 1: "First post in RingA" (created 2 hours ago, with image)
  - Post 2: "Second post in RingA" (created 1 hour ago, text only)
- Ring 2: `RingB_001` with post:
  - Post 1: "Post in RingB" (created 30 minutes ago, with image)

**Test Steps**:
1. Ensure user is logged in as `testuser_newsfeed_001`
2. Navigate to Home screen (click "Home" in footer if not already there)
3. Observe News Feed display

**Expected Results**:
- News Feed is displayed
- News Feed shows 3 News Tiles (one for each post)
- News Tiles are ordered newest first:
  1. "Post in RingB" (30 minutes ago) - from RingB_001
  2. "Second post in RingA" (1 hour ago) - from RingA_001
  3. "First post in RingA" (2 hours ago) - from RingA_001
- Each News Tile displays:
  - Ring name (clickable, e.g., "RingA_001" or "RingB_001")
  - Post picture thumbnail (if post has an image)
  - First 100 characters of message text (truncated with ellipsis if longer)
  - Post timestamp (relative time, e.g., "30 minutes ago", "1 hour ago", "2 hours ago")
  - Author username
- News Feed is scrollable if content exceeds viewport

**Assertions**:
- HTTP status code: 200
- News Feed API returns posts from all user's Rings
- Posts are ordered by creation timestamp descending (newest first)
- All News Tiles display correct Ring name, message text (first 100 chars), image (if present), author, and timestamp
- News Tiles are clickable and navigate to correct Ring Chat

---

### Test 3.3.2: View News Feed with Text-Only Posts

**Test Description**: Validates that News Feed correctly displays posts without images (text-only posts).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_textonly_001` is registered and logged in
3. User is a member of Ring `TextOnlyRing_001`
4. Ring has 2 text-only posts (no images)

**Test Data**:
- User: `testuser_textonly_001`
- Ring: `TextOnlyRing_001`
- Post 1: "This is a text-only post without any image." (created 1 hour ago)
- Post 2: "Another text-only message here." (created 30 minutes ago)

**Test Steps**:
1. Ensure user is logged in as `testuser_textonly_001`
2. Navigate to Home screen
3. Observe News Feed display

**Expected Results**:
- News Feed displays 2 News Tiles
- News Tiles show:
  - Ring name: `TextOnlyRing_001`
  - No image thumbnail (or placeholder indicating no image)
  - Full message text (since both are under 100 characters)
  - Post timestamp
  - Author username
- Posts are ordered newest first

**Assertions**:
- HTTP status code: 200
- News Tiles correctly handle posts without images
- Message text is displayed correctly
- No image-related errors occur

---

### Test 3.3.3: View News Feed with Long Message Text (Truncation)

**Test Description**: Validates that News Feed correctly truncates long message text to first 100 characters with ellipsis.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_longtext_001` is registered and logged in
3. User is a member of Ring `LongTextRing_001`
4. Ring has a post with message text longer than 100 characters

**Test Data**:
- User: `testuser_longtext_001`
- Ring: `LongTextRing_001`
- Post: Message text of 150 characters: "This is a very long message that exceeds one hundred characters and should be truncated in the News Feed display. The full text should only be visible in the Ring Chat screen."

**Test Steps**:
1. Ensure user is logged in as `testuser_longtext_001`
2. Navigate to Home screen
3. Observe News Feed display

**Expected Results**:
- News Feed displays 1 News Tile
- News Tile shows:
  - First 100 characters of message text: "This is a very long message that exceeds one hundred characters and should be truncated in the News Feed display. The full text..."
  - Ellipsis (...) indicates text is truncated
  - Ring name, timestamp, and author are displayed
- Clicking News Tile navigates to Ring Chat where full message text is visible

**Assertions**:
- HTTP status code: 200
- Message text is truncated to exactly 100 characters (or first 100 chars)
- Ellipsis is displayed to indicate truncation
- Full message text is available in Ring Chat

---

### Test 3.3.4: View News Feed with Posts from Many Rings

**Test Description**: Validates that News Feed correctly aggregates and displays posts from many Rings (up to 50 Rings as per performance requirements).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_manyrings_001` is registered and logged in
3. User is a member of 10 Rings (Ring1 through Ring10)
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_manyrings_001`
- Rings: Ring1, Ring2, ..., Ring10 (each with 1-2 posts)

**Test Steps**:
1. Ensure user is logged in as `testuser_manyrings_001`
2. Navigate to Home screen
3. Observe News Feed display
4. Verify loading time

**Expected Results**:
- News Feed loads within 2 seconds (performance requirement)
- All posts from all 10 Rings are displayed
- Posts are ordered newest first across all Rings
- News Feed is scrollable
- All News Tiles display correctly with Ring names, messages, images (if any), timestamps, and authors

**Assertions**:
- HTTP status code: 200
- News Feed loads within 2 seconds
- All posts from user's Rings are included
- Posts are correctly ordered by timestamp descending
- Performance is acceptable with multiple Rings

---

### Test 3.3.5: View News Feed - Polling Updates

**Test Description**: Validates that News Feed automatically polls for new posts and updates the display.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_polling_001` is registered and logged in
3. User is a member of Ring `PollingRing_001`
4. Ring initially has 1 post
5. Another user will create a new post in the Ring during the test

**Test Data**:
- User: `testuser_polling_001`
- Ring: `PollingRing_001`
- Initial post: "Initial post" (created before test)
- New post: "New post after polling" (created by another user during test)

**Test Steps**:
1. Ensure user is logged in as `testuser_polling_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show 1 post)
4. Wait for polling interval (up to 30 seconds)
5. Observe News Feed after polling

**Expected Results**:
- Initial News Feed shows 1 post
- After polling interval (within 30 seconds), News Feed updates
- New post appears in News Feed (ordered first, newest first)
- News Feed now shows 2 posts
- Polling continues while user is on Home screen

**Assertions**:
- Polling occurs automatically every 30 seconds (maximum)
- New posts appear in News Feed after polling
- News Feed updates without requiring manual refresh
- Posts remain correctly ordered (newest first)

---

## Test Name: View News Feed - Empty States

### Test 3.3.6: View News Feed with No Rings

**Test Description**: Validates that News Feed displays appropriate empty state when user has not joined any Rings.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_norings_001` is registered and logged in
3. User is not a member of any Rings

**Test Data**:
- User: `testuser_norings_001`
- Rings: None

**Test Steps**:
1. Ensure user is logged in as `testuser_norings_001`
2. Navigate to Home screen
3. Observe News Feed display

**Expected Results**:
- News Feed is displayed
- Empty state message is shown: "No posts yet. Join or create a Ring to see posts here."
- Search bar is visible at the top
- Footer navigation is visible

**Assertions**:
- HTTP status code: 200
- Empty state message text matches exactly: "No posts yet. Join or create a Ring to see posts here."
- No News Tiles are displayed
- User can still navigate to other screens

---

### Test 3.3.7: View News Feed with Rings but No Posts

**Test Description**: Validates that News Feed displays appropriate empty state when user is a member of Rings but those Rings have no posts.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_emptyrings_001` is registered and logged in
3. User is a member of Ring `EmptyRing_001` (Ring exists but has no posts)

**Test Data**:
- User: `testuser_emptyrings_001`
- Ring: `EmptyRing_001` (no posts)

**Test Steps**:
1. Ensure user is logged in as `testuser_emptyrings_001`
2. Navigate to Home screen
3. Observe News Feed display

**Expected Results**:
- News Feed is displayed
- Empty state message is shown: "No posts yet. Join or create a Ring to see posts here."
- Search bar is visible at the top
- Footer navigation is visible

**Assertions**:
- HTTP status code: 200
- Empty state message text matches exactly: "No posts yet. Join or create a Ring to see posts here."
- No News Tiles are displayed
- User can navigate to My Rings and see the Ring exists there

---

## Test Name: View News Feed - Error Cases

### Test 3.3.8: View News Feed - API Error Handling

**Test Description**: Validates that News Feed handles API errors gracefully.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_error_001` is registered and logged in
3. Simulate API error (network failure, server error, etc.)

**Test Data**:
- User: `testuser_error_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_error_001`
2. Simulate API error condition
3. Navigate to Home screen or refresh News Feed

**Expected Results**:
- Error message is displayed: "Unable to load news feed. Please try again."
- User remains on Home screen
- Footer navigation is still accessible
- User can retry by refreshing or navigating away and back

**Assertions**:
- HTTP status code: 500 or network error
- Error message text matches exactly: "Unable to load news feed. Please try again."
- Application does not crash
- User can recover from error state

---

## Cleanup
- Test users and Rings created for News Feed tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
