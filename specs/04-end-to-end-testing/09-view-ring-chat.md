# Test: View Ring Chat (3.8)

## Test Scenario Name
View Ring Chat - Positive and Negative Test Cases

## Description
This test validates the View Ring Chat use case (3.8) covering Ring Chat display, message history, access control, and UI elements.

## Prerequisites
- Application is running and accessible
- User `testuser_chat_001` is registered and logged in
- Test data setup as needed for each test case

## Test Case 1: View Ring Chat with Messages

### Prerequisites
- User `testuser_chat_001` is logged in
- User is a member of a Ring
- Ring has at least 3 posts from different users

### Test Steps
1. Navigate to Ring Chat Screen by clicking on a Ring item in My Rings or clicking a News Tile (4.5 Ring Chat Screen)
2. Verify Ring Chat Screen displays:
   - Ring name header at the top
   - Member count displayed in header
   - "Add User" button in the header
   - Chat messages area in the center (scrollable)
   - Message input area at the bottom (above footer)
   - Footer navigation at the bottom
3. Wait for chat messages to load
4. Verify Chat Messages Area displays at least 3 posts
5. Verify each message displays:
   - Author username
   - Message text (full text, not truncated, as per 3.8 View Ring Chat)
   - Picture (if message includes one, displayed as image, clickable to view full size)
   - Timestamp (formatted as time or relative time)
6. Verify messages are ordered oldest first (chronological order, as per 3.8 View Ring Chat: "ordered by creation timestamp ascending")
7. Verify newest messages appear at the bottom
8. Verify Message Input Area displays:
   - Text input field (multiline, expands as needed)
   - Picture upload button/icon
   - Post button
   - Character count indicator showing remaining characters out of 5000

### Expected Results
- Ring Chat displays correctly with all required elements
- Messages are ordered chronologically (oldest first)
- Full message text is displayed (not truncated)
- All UI elements are present and functional

## Test Case 2: View Empty Ring Chat

### Prerequisites
- User `testuser_chat_002` is logged in
- User is a member of a Ring
- Ring has no posts

### Test Steps
1. Navigate to Ring Chat Screen for the empty Ring
2. Verify Ring Chat Screen displays with all UI elements
3. Verify Chat Messages Area displays empty state message: "No messages yet. Be the first to post!" (3.8 View Ring Chat)
4. Verify Message Input Area is displayed and functional
5. Verify user can type in the message input field

### Expected Results
- Empty state message is displayed
- Message input is available for posting
- All UI elements are present

## Test Case 3: Access Denied - Not a Member

### Prerequisites
- User `testuser_chat_003` is logged in
- User is NOT a member of a specific Ring
- Attempt to access Ring Chat via direct URL or invalid navigation

### Test Steps
1. Attempt to navigate to Ring Chat for a Ring the user is not a member of (via direct URL with Ring id)
2. Verify access is denied
3. Verify error message is displayed: "You are not a member of this Ring." (3.8 View Ring Chat)
4. Verify user is redirected to an appropriate screen (Home or My Rings)

### Expected Results
- Access to non-member Ring Chat is denied
- Error message is displayed
- User is redirected appropriately

## Test Case 4: Ring Header Information

### Prerequisites
- User `testuser_chat_004` is logged in
- User is a member of a Ring with name `TestRingHeader` and 5 members

### Test Steps
1. Navigate to Ring Chat Screen
2. Verify Ring Header displays:
   - Ring name: `TestRingHeader` (displayed prominently)
   - Member count: "5 members" (as per 4.5 Ring Chat Screen)
   - "Add User" button displayed in the header
3. Verify Ring name is displayed in full (not ellipsized)
4. Verify member count is accurate

### Expected Results
- Ring Header displays correct information
- Ring name and member count are accurate
- Add User button is visible

## Test Case 5: Message Ordering - Chronological

### Prerequisites
- User `testuser_chat_005` is logged in
- User is a member of a Ring
- Ring has posts created at different times (oldest to newest)

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Verify messages are displayed in chronological order (oldest first, newest last)
4. Verify the first message in the list is the oldest
5. Verify the last message in the list is the newest
6. Scroll to bottom of chat
7. Verify newest message is visible at the bottom

### Expected Results
- Messages are ordered chronologically (oldest first)
- Newest messages appear at the bottom
- Ordering is consistent

## Test Case 6: Messages with Pictures

### Prerequisites
- User `testuser_chat_006` is logged in
- User is a member of a Ring
- Ring has at least one post with a picture

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Find a message that contains a picture
4. Verify the message displays:
   - Author username
   - Message text
   - Picture displayed as image (as per 4.5 Ring Chat Screen)
   - Timestamp
5. Click on the picture
6. Verify full-size image is displayed (implementation dependent: modal, new page, etc.)

### Expected Results
- Messages with pictures display images correctly
- Pictures are clickable to view full size
- All message elements are displayed

## Test Case 7: Messages without Pictures

### Prerequisites
- User `testuser_chat_007` is logged in
- User is a member of a Ring
- Ring has at least one post without a picture (text only)

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Find a message that does not contain a picture
4. Verify the message displays:
   - Author username
   - Message text (full text)
   - Timestamp
   - No picture is displayed

### Expected Results
- Text-only messages display correctly
- No picture placeholder or error is shown
- All text message elements are displayed

## Test Case 8: Auto-Scroll to Bottom

### Prerequisites
- User `testuser_chat_008` is logged in
- User is a member of a Ring
- Ring has multiple posts (requires scrolling to see all)

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Verify chat automatically scrolls to bottom showing newest message (as per 4.5 Ring Chat Screen: "Auto-scroll to bottom when new messages arrive")
4. Create a new post in the Ring (from another user or browser context)
5. Wait for new message to appear (polling mechanism, maximum 30 seconds)
6. Verify chat automatically scrolls to bottom to show the new message

### Expected Results
- Chat auto-scrolls to bottom on load
- Chat auto-scrolls when new messages arrive
- Newest messages are visible

## Test Case 9: Loading Indicator

### Prerequisites
- User `testuser_chat_009` is logged in

### Test Steps
1. Navigate to Ring Chat Screen
2. Immediately check for loading indicator (as per 4.5 Ring Chat Screen: "Loading indicator while fetching messages")
3. Wait for messages to load
4. Verify loading indicator disappears when messages are loaded

### Expected Results
- Loading indicator is displayed while fetching messages
- Loading indicator disappears when data is loaded

## Test Case 10: Full Message Text Display

### Prerequisites
- User `testuser_chat_010` is logged in
- User is a member of a Ring
- Ring has a post with message text longer than 100 characters

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Find the message with long text (over 100 characters)
4. Verify the message displays the full text (not truncated, as per 3.8 View Ring Chat: "Message text (full text, not truncated)")
5. Compare with News Feed: Navigate to Home Screen and verify the same post shows only first 100 characters in News Feed

### Expected Results
- Ring Chat displays full message text (not truncated)
- News Feed shows truncated text (first 100 chars)
- Full text is accessible in Ring Chat

## Test Case 11: Multiple Authors

### Prerequisites
- User `testuser_chat_011` is logged in
- User is a member of a Ring
- Ring has posts from at least 3 different users

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Verify messages display different author usernames
4. Verify each message correctly shows its author
5. Verify author usernames are displayed consistently for all messages

### Expected Results
- Multiple authors are displayed correctly
- Each message shows its correct author
- Author display is consistent

## Test Case 12: Timestamp Display

### Prerequisites
- User `testuser_chat_012` is logged in
- User is a member of a Ring
- Ring has posts from different times (recent and older)

### Test Steps
1. Navigate to Ring Chat Screen
2. Wait for messages to load
3. Verify each message displays a timestamp
4. Verify timestamps are formatted as time or relative time (e.g., "2 hours ago", "just now", as per 4.5 Ring Chat Screen)
5. Verify timestamps are accurate and readable

### Expected Results
- Timestamps are displayed for all messages
- Timestamps are formatted appropriately
- Timestamps are accurate

## UI Elements Referenced

- **Ring Chat Screen** (4.5): Ring Header, Ring name, member count, Add User button, Chat Messages Area, Message Input Area, text input field, picture upload button, Post button, character count indicator, footer navigation, loading indicator

## Functional Requirements Referenced

- **3.8 View Ring Chat**: Complete Ring Chat viewing use case with message history, chronological ordering, and access control
