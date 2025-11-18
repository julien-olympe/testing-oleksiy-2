# Use Case 3.9: Post Message in Ring - End-to-End Tests

## Test Name: Post Message in Ring - Positive Cases

### Test 3.9.1: Post Text-Only Message in Ring

**Test Description**: Validates that authenticated user can successfully post a text-only message in a Ring they are a member of.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_post_text_001` is registered and logged in
3. User is a member of Ring `PostTextRing_001`

**Test Data**:
- User: `testuser_post_text_001`
- Ring: `PostTextRing_001`
- Message Text: `Hello! This is my first post in the Ring.`

**Test Steps**:
1. Ensure user is logged in as `testuser_post_text_001`
2. Navigate to Ring Chat for `PostTextRing_001`
3. Observe message input area
4. Enter message text: `Hello! This is my first post in the Ring.`
5. Observe character count indicator updates
6. Click "Post" button

**Expected Results**:
- Message input area displays:
  - Text input field (multiline, expands as needed)
  - Character count indicator showing remaining characters (e.g., "4970 characters remaining" out of 5000)
  - Post button (enabled when message text is entered)
- After entering message, character count updates
- After clicking Post, message is created successfully
- Post appears immediately in Ring Chat at the bottom of messages list
- Post displays:
  - Author username: `testuser_post_text_001`
  - Full message text: `Hello! This is my first post in the Ring.`
  - Timestamp (e.g., "just now")
  - No image (text-only post)
- Message input field is cleared
- Character count indicator resets

**Assertions**:
- HTTP status code: 200 or 201
- Post record is created in database with correct ring_id, user_id, and message_text
- Post appears immediately in Ring Chat
- Post will appear in News Feed for all Ring members (after polling)

---

### Test 3.9.2: Post Message with Image

**Test Description**: Validates that authenticated user can successfully post a message with an image in a Ring they are a member of.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_post_image_001` is registered and logged in
3. User is a member of Ring `PostImageRing_001`
4. Valid test image file is available: `test-image.jpg` (JPEG format, < 10MB)

**Test Data**:
- User: `testuser_post_image_001`
- Ring: `PostImageRing_001`
- Message Text: `Check out this image!`
- Image File: `test-image.jpg` (JPEG, < 10MB)

**Test Steps**:
1. Ensure user is logged in as `testuser_post_image_001`
2. Navigate to Ring Chat for `PostImageRing_001`
3. Enter message text: `Check out this image!`
4. Click picture upload button/icon
5. Select image file: `test-image.jpg`
6. Observe image preview thumbnail appears
7. Click "Post" button

**Expected Results**:
- Image file is selected successfully
- Image preview thumbnail is displayed with remove option
- After clicking Post, message is created successfully
- Post appears immediately in Ring Chat
- Post displays:
  - Author username: `testuser_post_image_001`
  - Full message text: `Check out this image!`
  - Image is displayed (thumbnail or full image, clickable to view full size)
  - Timestamp
- Message input field is cleared
- Image preview is removed

**Assertions**:
- HTTP status code: 200 or 201
- Post record is created with correct message_text and image_url
- Image file is uploaded and stored correctly
- Image is displayed in Ring Chat
- Image will appear in News Feed thumbnail for all Ring members

---

### Test 3.9.3: Post Message with Minimum Length Text

**Test Description**: Validates that posting works with minimum valid message length (1 character).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_mintext_001` is registered and logged in
3. User is a member of Ring `MinTextRing_001`

**Test Data**:
- User: `testuser_mintext_001`
- Ring: `MinTextRing_001`
- Message Text: `A` (exactly 1 character, minimum valid length)

**Test Steps**:
1. Ensure user is logged in as `testuser_mintext_001`
2. Navigate to Ring Chat for `MinTextRing_001`
3. Enter message text: `A`
4. Click "Post" button

**Expected Results**:
- Message is created successfully
- Post appears in Ring Chat with single character "A"
- Post is valid and functional

**Assertions**:
- HTTP status code: 200 or 201
- Post record is created with 1-character message text
- Post displays correctly

---

### Test 3.9.4: Post Message with Maximum Length Text

**Test Description**: Validates that posting works with maximum valid message length (5000 characters).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_maxtext_001` is registered and logged in
3. User is a member of Ring `MaxTextRing_001`

**Test Data**:
- User: `testuser_maxtext_001`
- Ring: `MaxTextRing_001`
- Message Text: 5000 characters (exactly maximum valid length)

**Test Steps**:
1. Ensure user is logged in as `testuser_maxtext_001`
2. Navigate to Ring Chat for `MaxTextRing_001`
3. Enter message text (5000 characters)
4. Observe character count indicator shows "0 characters remaining"
5. Click "Post" button

**Expected Results**:
- Character count indicator shows "0 characters remaining" when 5000 characters are entered
- Message is created successfully
- Post appears in Ring Chat with full 5000-character text
- Full message is scrollable if it exceeds viewport

**Assertions**:
- HTTP status code: 200 or 201
- Post record is created with 5000-character message text
- Full message text is displayed in Ring Chat
- Character count indicator is accurate

---

### Test 3.9.5: Post Message and Verify News Feed Update

**Test Description**: Validates that a new post appears in News Feed for all Ring members after posting.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_newsfeed_001` is registered and logged in
3. User is a member of Ring `NewsFeedRing_001`
4. Another user is also a member of the same Ring

**Test Data**:
- User: `testuser_newsfeed_001`
- Ring: `NewsFeedRing_001`
- Message Text: `This post should appear in News Feed!`

**Test Steps**:
1. Ensure user is logged in as `testuser_newsfeed_001`
2. Navigate to Ring Chat for `NewsFeedRing_001`
3. Enter message text: `This post should appear in News Feed!`
4. Click "Post" button
5. Navigate to Home screen (News Feed)
6. Observe News Feed
7. Wait for polling interval (up to 30 seconds) if post doesn't appear immediately
8. Verify post appears in News Feed

**Expected Results**:
- Post is created successfully in Ring Chat
- After navigating to News Feed, post appears as News Tile
- News Tile shows:
  - Ring name: `NewsFeedRing_001`
  - First 100 characters of message text (or full text if < 100 chars)
  - Author username: `testuser_newsfeed_001`
  - Timestamp
- Post appears in News Feed for all Ring members (tested with another user if possible)

**Assertions**:
- HTTP status code: 200 or 201
- Post appears in News Feed after creation
- News Tile displays correctly
- Post is visible to all Ring members in their News Feeds

---

## Test Name: Post Message in Ring - Negative Cases

### Test 3.9.6: Post Message with Empty Text

**Test Description**: Validates that posting fails when message text is empty.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_empty_001` is registered and logged in
3. User is a member of Ring `EmptyPostRing_001`

**Test Data**:
- User: `testuser_empty_001`
- Ring: `EmptyPostRing_001`
- Message Text: `` (empty)

**Test Steps**:
1. Ensure user is logged in as `testuser_empty_001`
2. Navigate to Ring Chat for `EmptyPostRing_001`
3. Leave message input field empty
4. Attempt to click "Post" button (if enabled) or verify button is disabled

**Expected Results**:
- Post button is disabled when message is empty (preferred UX)
- OR if button is enabled and clicked:
  - Posting fails
  - Error message is displayed: "Message cannot be empty."
  - User remains on Ring Chat screen
  - No post is created

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- Error message text matches exactly: "Message cannot be empty."
- No post record is created

---

### Test 3.9.7: Post Message with Text Too Long

**Test Description**: Validates that posting fails when message text exceeds 5000 characters.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_toolong_001` is registered and logged in
3. User is a member of Ring `TooLongPostRing_001`

**Test Data**:
- User: `testuser_toolong_001`
- Ring: `TooLongPostRing_001`
- Message Text: 5001 characters (exceeds maximum)

**Test Steps**:
1. Ensure user is logged in as `testuser_toolong_001`
2. Navigate to Ring Chat for `TooLongPostRing_001`
3. Enter message text (5001 characters)
4. Attempt to click "Post" button

**Expected Results**:
- Input field may prevent typing beyond 5000 characters (preferred)
- OR if 5001 characters are entered and Post is clicked:
  - Posting fails
  - Error message is displayed: "Message must be 5000 characters or less."
  - User remains on Ring Chat screen
  - No post is created

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- Error message text matches exactly: "Message must be 5000 characters or less."
- No post record is created

---

### Test 3.9.8: Post Message with Image Too Large

**Test Description**: Validates that posting fails when image file exceeds 10MB size limit.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_largeimage_001` is registered and logged in
3. User is a member of Ring `LargeImageRing_001`
4. Test image file is available: `large-image.jpg` (> 10MB)

**Test Data**:
- User: `testuser_largeimage_001`
- Ring: `LargeImageRing_001`
- Message Text: `Trying to upload large image`
- Image File: `large-image.jpg` (> 10MB, exceeds maximum)

**Test Steps**:
1. Ensure user is logged in as `testuser_largeimage_001`
2. Navigate to Ring Chat for `LargeImageRing_001`
3. Enter message text: `Trying to upload large image`
4. Click picture upload button/icon
5. Select image file: `large-image.jpg` (> 10MB)
6. Attempt to click "Post" button

**Expected Results**:
- Image file selection may be prevented if file picker validates size (preferred)
- OR if large image is selected and Post is clicked:
  - Posting fails
  - Error message is displayed: "Image file is too large. Maximum size is 10MB."
  - User remains on Ring Chat screen
  - No post is created
  - Image preview is removed or error is shown

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- Error message text matches exactly: "Image file is too large. Maximum size is 10MB."
- No post record is created
- Image file is not uploaded

---

### Test 3.9.9: Post Message with Unsupported Image Format

**Test Description**: Validates that posting fails when image file format is not supported (not JPEG, PNG, or GIF).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_badformat_001` is registered and logged in
3. User is a member of Ring `BadFormatRing_001`
4. Test file is available: `document.pdf` (unsupported format)

**Test Data**:
- User: `testuser_badformat_001`
- Ring: `BadFormatRing_001`
- Message Text: `Trying to upload PDF`
- File: `document.pdf` (unsupported format, not JPEG/PNG/GIF)

**Test Steps**:
1. Ensure user is logged in as `testuser_badformat_001`
2. Navigate to Ring Chat for `BadFormatRing_001`
3. Enter message text: `Trying to upload PDF`
4. Click picture upload button/icon
5. Attempt to select file: `document.pdf`
6. If file is selected, attempt to click "Post" button

**Expected Results**:
- File picker may filter to show only image files (preferred)
- OR if PDF is selected and Post is clicked:
  - Posting fails
  - Error message is displayed: "Unsupported image format. Please use JPEG, PNG, or GIF."
  - User remains on Ring Chat screen
  - No post is created

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- Error message text matches exactly: "Unsupported image format. Please use JPEG, PNG, or GIF."
- No post record is created
- File is not uploaded

**Additional Test Cases for Unsupported Formats**:
- Test with `.txt` file → Should fail with same error
- Test with `.doc` file → Should fail with same error
- Test with `.bmp` file → Should fail with same error (if BMP is not supported)

---

### Test 3.9.10: Post Message - Not a Member of Ring

**Test Description**: Validates that posting fails when user tries to post in a Ring they are not a member of.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_notmember_001` is registered and logged in
3. Ring `NotMemberRing_001` exists but user is NOT a member
4. Attempt to post via direct API call or invalid navigation

**Test Data**:
- User: `testuser_notmember_001`
- Ring: `NotMemberRing_001` (user is not a member)
- Message Text: `Trying to post without membership`

**Test Steps**:
1. Ensure user is logged in as `testuser_notmember_001`
2. Attempt to post message in `NotMemberRing_001` (via API call or invalid navigation)

**Expected Results**:
- Posting fails
- Error message is displayed: "You are not a member of this Ring."
- No post is created

**Assertions**:
- HTTP status code: 403 (Forbidden)
- Error message text matches exactly: "You are not a member of this Ring."
- No post record is created
- Note: This should not happen through normal UI navigation (users can only access Rings they're members of), but should be tested for security

---

### Test 3.9.11: Post Message with Valid Image Formats

**Test Description**: Validates that posting works with all supported image formats (JPEG, PNG, GIF).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_formats_001` is registered and logged in
3. User is a member of Ring `FormatsRing_001`
4. Test image files are available: `test-image.jpg`, `test-image.png`, `test-image.gif`

**Test Data**:
- User: `testuser_formats_001`
- Ring: `FormatsRing_001`
- Image Files: JPEG, PNG, GIF (all < 10MB)

**Test Steps**:
1. Ensure user is logged in as `testuser_formats_001`
2. Navigate to Ring Chat for `FormatsRing_001`
3. Test posting with JPEG image
4. Test posting with PNG image
5. Test posting with GIF image

**Expected Results**:
- All three image formats (JPEG, PNG, GIF) are accepted
- Posts are created successfully with each format
- Images are displayed correctly in Ring Chat
- Images appear in News Feed thumbnails

**Assertions**:
- HTTP status code: 200 or 201 (for each format)
- All supported formats work correctly
- Images are uploaded and stored correctly
- Images are displayed correctly

---

## Cleanup
- Test users, Rings, and posts created during tests can remain in database for integration testing
- Test image files should be cleaned up from storage if needed
- For isolated test runs, test data should be cleaned up or test database should be reset
