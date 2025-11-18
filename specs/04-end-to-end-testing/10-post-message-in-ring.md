# Test: Post Message in Ring (3.9)

## Test Scenario Name
Post Message in Ring - Positive and Negative Test Cases

## Description
This test validates the Post Message in Ring use case (3.9) covering message creation with text and optional pictures, validation, and immediate visibility.

## Prerequisites
- Application is running and accessible
- User `testuser_post_001` is registered and logged in
- Test data setup as needed for each test case

## Test Case 1: Successful Post - Text Only

### Prerequisites
- User `testuser_post_001` is logged in
- User is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen for the Ring (4.5 Ring Chat Screen)
2. Verify Message Input Area displays:
   - Text input field (multiline)
   - Picture upload button/icon
   - Post button
   - Character count indicator showing remaining characters out of 5000
3. Verify Post button is disabled (message text is empty)
4. Enter message text: `This is my first post in this Ring!`
5. Verify Post button becomes enabled
6. Verify character count indicator updates to show remaining characters
7. Click Post button
8. Verify new post appears immediately in Chat Messages Area (3.9 Post Message in Ring)
9. Verify the post displays:
   - Author username: `testuser_post_001`
   - Message text: `This is my first post in this Ring!` (full text)
   - Timestamp
   - No picture (text-only post)
10. Verify message appears at the bottom of the chat (newest message)
11. Verify message input field is cleared
12. Verify Post button is disabled again
13. Verify character count indicator resets

### Expected Results
- Post is created successfully
- Post appears immediately in Ring Chat
- Post displays all required elements
- Input field is cleared after posting

## Test Case 2: Successful Post - Text with Picture

### Prerequisites
- User `testuser_post_002` is logged in
- User is a member of a Ring
- Test image file available (JPEG format, under 10MB)

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `Check out this picture!`
3. Click Picture upload button/icon
4. Select a test image file (JPEG, under 10MB)
5. Verify selected image preview appears as thumbnail with remove option (as per 4.5 Ring Chat Screen)
6. Verify Post button is enabled
7. Click Post button
8. Verify new post appears immediately in Chat Messages Area
9. Verify the post displays:
   - Author username
   - Message text: `Check out this picture!`
   - Picture displayed as image (clickable to view full size)
   - Timestamp
10. Verify image preview is removed from input area
11. Click on the picture in the post
12. Verify full-size image is displayed

### Expected Results
- Post with picture is created successfully
- Picture is displayed in the post
- Picture is clickable to view full size
- Image preview is cleared after posting

## Test Case 3: Empty Message Text

### Prerequisites
- User `testuser_post_003` is logged in
- User is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Leave message text field empty
3. Verify Post button is disabled
4. If Post button is enabled (implementation dependent), try to click it
5. Verify error message is displayed: "Message cannot be empty." (3.9 Post Message in Ring)
6. Verify no post is created

### Expected Results
- Empty messages are not accepted
- Post button is disabled or error is shown
- No post is created

## Test Case 4: Message Text Too Long

### Prerequisites
- User `testuser_post_004` is logged in
- User is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `a`.repeat(5001) (5001 characters, exceeds maximum of 5000)
3. Verify character count indicator shows 0 or negative remaining characters
4. Click Post button
5. Verify user remains on Ring Chat Screen
6. Verify error message is displayed: "Message must be 5000 characters or less." (3.9 Post Message in Ring)
7. Verify no post is created
8. Verify message text remains in input field (or is cleared, implementation dependent)

### Expected Results
- Messages exceeding 5000 characters are rejected
- Validation error is displayed
- No post is created

## Test Case 5: Message Text Exactly 5000 Characters (Boundary)

### Prerequisites
- User `testuser_post_005` is logged in
- User is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `a`.repeat(5000) (exactly 5000 characters, maximum valid)
3. Verify character count indicator shows 0 remaining characters
4. Click Post button
5. Verify new post appears in Chat Messages Area
6. Verify the post displays the full 5000-character message

### Expected Results
- Message with exactly 5000 characters is accepted
- Post is created successfully
- Full message is displayed

## Test Case 6: Image File Too Large

### Prerequisites
- User `testuser_post_006` is logged in
- User is a member of a Ring
- Test image file available (over 10MB)

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `This image is too large`
3. Click Picture upload button/icon
4. Select a test image file (over 10MB)
5. Verify error message is displayed: "Image file is too large. Maximum size is 10MB." (3.9 Post Message in Ring)
6. Verify image is not added to the post
7. Verify message text remains in input field
8. Verify user can still post without the image

### Expected Results
- Images over 10MB are rejected
- Error message is displayed
- User can still post text without the image

## Test Case 7: Unsupported Image Format

### Prerequisites
- User `testuser_post_007` is logged in
- User is a member of a Ring
- Test file available (non-image file or unsupported format like BMP, WEBP)

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `Trying to upload unsupported format`
3. Click Picture upload button/icon
4. Select a file with unsupported format (e.g., .txt, .pdf, .bmp, .webp)
5. Verify error message is displayed: "Unsupported image format. Please use JPEG, PNG, or GIF." (3.9 Post Message in Ring)
6. Verify file is not added to the post
7. Verify message text remains in input field

### Expected Results
- Unsupported image formats are rejected
- Error message specifies allowed formats
- User can still post text

## Test Case 8: Valid Image Formats - JPEG

### Prerequisites
- User `testuser_post_008` is logged in
- User is a member of a Ring
- Test JPEG image file available (under 10MB)

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `JPEG image test`
3. Click Picture upload button/icon
4. Select a JPEG image file
5. Verify image preview appears as thumbnail
6. Click Post button
7. Verify post is created with JPEG image displayed correctly

### Expected Results
- JPEG images are accepted
- Image is displayed in the post

## Test Case 9: Valid Image Formats - PNG

### Prerequisites
- User `testuser_post_009` is logged in
- User is a member of a Ring
- Test PNG image file available (under 10MB)

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `PNG image test`
3. Click Picture upload button/icon
4. Select a PNG image file
5. Verify image preview appears
6. Click Post button
7. Verify post is created with PNG image displayed correctly

### Expected Results
- PNG images are accepted
- Image is displayed in the post

## Test Case 10: Valid Image Formats - GIF

### Prerequisites
- User `testuser_post_010` is logged in
- User is a member of a Ring
- Test GIF image file available (under 10MB)

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `GIF image test`
3. Click Picture upload button/icon
4. Select a GIF image file
5. Verify image preview appears
6. Click Post button
7. Verify post is created with GIF image displayed correctly

### Expected Results
- GIF images are accepted
- Image is displayed in the post

## Test Case 11: Remove Image Preview Before Posting

### Prerequisites
- User `testuser_post_011` is logged in
- User is a member of a Ring
- Test image file available

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `Testing image removal`
3. Click Picture upload button/icon
4. Select an image file
5. Verify image preview appears with remove option
6. Click remove option on the image preview
7. Verify image preview is removed
8. Verify message text remains in input field
9. Click Post button
10. Verify post is created with text only (no image)

### Expected Results
- Image preview can be removed before posting
- Post is created without image if preview is removed
- Message text is preserved

## Test Case 12: Post Appears in News Feed

### Prerequisites
- User `testuser_post_012` is logged in
- User is a member of a Ring
- Another user is also a member of the same Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `This post should appear in News Feed`
3. Click Post button
4. Verify post appears in Ring Chat
5. Navigate to Home Screen
6. Wait for News Feed to refresh (polling mechanism, maximum 30 seconds)
7. Verify the new post appears in News Feed as a News Tile
8. Verify News Tile displays:
   - Ring name
   - First 100 characters of message text (truncated if longer)
   - Post timestamp
   - Author username
9. Verify another user (member of the same Ring) can also see the post in their News Feed

### Expected Results
- Post appears in News Feed for all Ring members
- News Tile displays correctly
- Post is visible to all members

## Test Case 13: Post from Non-Member (Access Denied)

### Prerequisites
- User `testuser_post_013` is logged in
- User is NOT a member of a specific Ring
- Attempt to post via invalid navigation or direct API call

### Test Steps
1. Attempt to navigate to Ring Chat for a Ring the user is not a member of
2. If access is denied at navigation, verify error message
3. If access is somehow possible, attempt to post a message
4. Verify error message is displayed: "You are not a member of this Ring." (3.9 Post Message in Ring)
5. Verify no post is created

### Expected Results
- Non-members cannot post in Rings
- Error message is displayed
- No post is created

## Test Case 14: Character Count Indicator Updates

### Prerequisites
- User `testuser_post_014` is logged in
- User is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Verify character count indicator shows "5000" or "5000 remaining" initially
3. Type character: `H`
4. Verify character count indicator updates to show "4999" or "4999 remaining"
5. Type additional characters: `ello`
6. Verify character count indicator updates to show "4995" or "4995 remaining"
7. Delete one character
8. Verify character count indicator updates to show "4996" or "4996 remaining"

### Expected Results
- Character count indicator updates in real-time
- Count accurately reflects remaining characters out of 5000

## Test Case 15: Multiple Posts in Sequence

### Prerequisites
- User `testuser_post_015` is logged in
- User is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Enter message text: `First post`
3. Click Post button
4. Verify first post appears in chat
5. Enter message text: `Second post`
6. Click Post button
7. Verify second post appears in chat below the first post
8. Enter message text: `Third post`
9. Click Post button
10. Verify third post appears in chat below the second post
11. Verify all three posts are displayed in chronological order
12. Verify all posts show the same author username

### Expected Results
- Multiple posts can be created in sequence
- Posts appear in chronological order
- All posts are displayed correctly

## UI Elements Referenced

- **Ring Chat Screen** (4.5): Message Input Area, text input field, picture upload button, Post button, character count indicator, image preview with remove option, Chat Messages Area
- **Home Screen** (4.3): News Feed, News Tiles

## Functional Requirements Referenced

- **3.9 Post Message in Ring**: Complete post creation use case with text and optional picture validation, immediate visibility, and News Feed integration
