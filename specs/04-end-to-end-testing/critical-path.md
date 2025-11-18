# Critical Path End-to-End Test

## Test Name: Complete User Journey - Registration to Post Creation and News Feed Visibility

## Test Description
This test validates the complete happy path user journey from initial registration through creating a Ring, adding a friend, posting a message with a picture, and verifying the post appears in both users' News Feeds. This test covers the core functionality of the Rings platform and ensures all major features work together seamlessly.

**Note**: This test contains ONLY happy path scenarios. No negative test cases are included.

## Prerequisites/Setup
1. Application is running and accessible
2. Database is clean (no existing test data)
3. Test image file is available: `test-image.jpg` (valid JPEG, < 10MB)
4. Two unique test usernames are prepared:
   - User 1: `testuser_main_001`
   - User 2: `testuser_friend_002`
5. Valid test password: `Test1234` (meets requirements: 8+ chars, letter + number)

## Test Data
- **User 1 Username**: `testuser_main_001`
- **User 1 Password**: `Test1234`
- **User 2 Username**: `testuser_friend_002`
- **User 2 Password**: `Test1234`
- **Ring Name**: `TestRing_CriticalPath_001`
- **Message Text**: `Hello! This is my first post in the Ring. Testing the critical path!`
- **Image File**: `test-image.jpg` (JPEG format, < 10MB)

## Test Steps

### Phase 1: User 1 Registration and Initial Setup

**Step 1.1: Navigate to Application**
- Action: Open application in browser
- Expected Result: Login screen is displayed with Login and Register tabs/sections

**Step 1.2: Switch to Registration**
- Action: Click on "Register" tab or section
- Expected Result: Registration form is displayed with Username and Password input fields

**Step 1.3: Enter Registration Details**
- Action: 
  - Enter username: `testuser_main_001`
  - Enter password: `Test1234`
- Expected Result: Form fields are populated with entered values

**Step 1.4: Submit Registration**
- Action: Click "Register" button
- Expected Result: 
  - Registration is successful
  - User is automatically logged in
  - User is redirected to Home screen (News Feed)
  - Authentication session is established
  - Footer navigation is visible with all five buttons (Home, My Rings, Find Ring, Create Ring, Settings)

**Step 1.5: Verify Home Screen (Empty State)**
- Action: Observe Home screen
- Expected Result: 
  - News Feed is displayed
  - Empty state message is shown: "No posts yet. Join or create a Ring to see posts here."
  - Search bar is visible at the top

### Phase 2: User 1 Creates a Ring

**Step 2.1: Navigate to Create Ring Screen**
- Action: Click "Create Ring" button in footer navigation
- Expected Result: 
  - User is navigated to Create Ring screen
  - Create Ring form is displayed with Ring name input field
  - Character count indicator shows "0/100" or similar
  - Create button is visible

**Step 2.2: Enter Ring Name**
- Action: Enter Ring name: `TestRing_CriticalPath_001`
- Expected Result: 
  - Ring name is entered in input field
  - Character count indicator updates to show current count
  - Create button becomes enabled

**Step 2.3: Submit Ring Creation**
- Action: Click "Create" button
- Expected Result: 
  - Ring is created successfully
  - User is automatically redirected to Ring Chat screen for the newly created Ring
  - Ring name is displayed in the header: `TestRing_CriticalPath_001`
  - Member count is displayed (showing "1 member" or "1 members")
  - "Add User" button is visible in the header
  - Message input area is visible at the bottom
  - Empty state message is shown: "No messages yet. Be the first to post!"

### Phase 3: User 2 Registration

**Step 3.1: Open New Browser Session/Incognito Window**
- Action: Open application in a new browser window or incognito mode (to simulate a different user)
- Expected Result: New browser session is opened, showing Login screen

**Step 3.2: Register User 2**
- Action: 
  - Click "Register" tab/section
  - Enter username: `testuser_friend_002`
  - Enter password: `Test1234`
  - Click "Register" button
- Expected Result: 
  - User 2 is registered successfully
  - User 2 is automatically logged in
  - User 2 is redirected to Home screen
  - Empty state message is shown: "No posts yet. Join or create a Ring to see posts here."

### Phase 4: User 1 Adds User 2 to Ring

**Step 4.1: Return to User 1 Session**
- Action: Switch back to User 1's browser session (should still be on Ring Chat screen)
- Expected Result: Ring Chat screen is displayed for `TestRing_CriticalPath_001`

**Step 4.2: Open Add User Dialog**
- Action: Click "Add User" button in the Ring header
- Expected Result: 
  - Modal dialog appears
  - Username input field is displayed
  - "Add" button and "Cancel" button are visible

**Step 4.3: Enter Username to Add**
- Action: Enter username: `testuser_friend_002` in the username input field
- Expected Result: Username is entered in the input field

**Step 4.4: Submit Add User**
- Action: Click "Add" button in the modal dialog
- Expected Result: 
  - User 2 is successfully added to the Ring
  - Confirmation message is displayed: "User 'testuser_friend_002' has been added to the Ring."
  - Modal dialog closes
  - Member count in header updates to show "2 members" (or "2 members")

### Phase 5: User 1 Posts Message with Picture

**Step 5.1: Enter Message Text**
- Action: 
  - Click in the message input field
  - Enter message text: `Hello! This is my first post in the Ring. Testing the critical path!`
- Expected Result: 
  - Message text is entered in the input field
  - Character count indicator shows remaining characters (e.g., "4920 characters remaining" or similar)
  - Post button becomes enabled

**Step 5.2: Upload Image**
- Action: 
  - Click picture upload button/icon
  - Select image file: `test-image.jpg`
- Expected Result: 
  - Image file is selected
  - Image preview thumbnail is displayed
  - Remove image option is available
  - Post button remains enabled

**Step 5.3: Submit Post**
- Action: Click "Post" button
- Expected Result: 
  - Post is created successfully
  - Post appears immediately in the Ring Chat at the bottom of the messages list
  - Post displays:
    - Author username: `testuser_main_001`
    - Full message text: `Hello! This is my first post in the Ring. Testing the critical path!`
    - Image is displayed (thumbnail or full image)
    - Timestamp is displayed
  - Message input field is cleared
  - Image preview is removed
  - Character count indicator resets

### Phase 6: User 1 Verifies Post in News Feed

**Step 6.1: Navigate to Home Screen**
- Action: Click "Home" button in footer navigation
- Expected Result: 
  - User is navigated to Home screen (News Feed)
  - News Feed is displayed

**Step 6.2: Verify Post in News Feed**
- Action: Observe News Feed content
- Expected Result: 
  - News Feed displays at least one News Tile
  - News Tile shows:
    - Ring name: `TestRing_CriticalPath_001` (clickable)
    - Post picture thumbnail (from the uploaded image)
    - First 100 characters of message text: `Hello! This is my first post in the Ring. Testing the critical path!` (full text since it's less than 100 chars)
    - Author username: `testuser_main_001`
    - Post timestamp (relative time, e.g., "just now" or "1 minute ago")
  - News Tile is ordered first (newest first)

**Step 6.3: Verify News Tile is Clickable**
- Action: Click on the News Tile
- Expected Result: 
  - User is navigated to Ring Chat screen for `TestRing_CriticalPath_001`
  - Ring Chat displays the post that was just created

### Phase 7: User 2 Verifies Post in News Feed

**Step 7.1: Switch to User 2 Session**
- Action: Switch to User 2's browser session
- Expected Result: User 2 is on Home screen (News Feed)

**Step 7.2: Verify Post Appears in User 2's News Feed**
- Action: Observe User 2's News Feed
- Expected Result: 
  - News Feed displays at least one News Tile
  - News Tile shows:
    - Ring name: `TestRing_CriticalPath_001` (clickable)
    - Post picture thumbnail (from the uploaded image)
    - First 100 characters of message text: `Hello! This is my first post in the Ring. Testing the critical path!`
    - Author username: `testuser_main_001`
    - Post timestamp
  - News Tile is ordered first (newest first)

**Step 7.3: User 2 Clicks on News Tile**
- Action: Click on the News Tile in User 2's News Feed
- Expected Result: 
  - User 2 is navigated to Ring Chat screen for `TestRing_CriticalPath_001`
  - Ring Chat displays the post created by User 1
  - User 2 can see:
    - Ring name: `TestRing_CriticalPath_001`
    - Member count showing "2 members"
    - The post with full message text and image
    - Author username: `testuser_main_001`

## Assertions

### Authentication Assertions
- ✅ User 1 is successfully registered and automatically logged in
- ✅ User 2 is successfully registered and automatically logged in
- ✅ Both users maintain valid authentication sessions throughout the test

### Ring Creation Assertions
- ✅ Ring `TestRing_CriticalPath_001` is created successfully
- ✅ User 1 is automatically added as a member of the created Ring
- ✅ Ring Chat screen displays correct Ring name and member count (1 member initially)

### Membership Assertions
- ✅ User 2 is successfully added to the Ring
- ✅ Member count updates to show 2 members
- ✅ User 2 can access the Ring Chat screen

### Post Creation Assertions
- ✅ Post is created successfully with message text and image
- ✅ Post appears immediately in Ring Chat for User 1
- ✅ Post contains correct message text, image, author username, and timestamp

### News Feed Assertions
- ✅ Post appears in User 1's News Feed after navigation to Home screen
- ✅ Post appears in User 2's News Feed (User 2 was added to Ring before post was created)
- ✅ News Tile displays correct Ring name, image thumbnail, message text (first 100 chars), author, and timestamp
- ✅ News Tiles are ordered newest first
- ✅ Clicking News Tile navigates to correct Ring Chat

### Navigation Assertions
- ✅ All navigation between screens works correctly
- ✅ Footer navigation buttons function correctly
- ✅ Deep linking to Ring Chat works (via News Tile click)

## Cleanup
1. Logout User 1 (optional, for test isolation)
2. Logout User 2 (optional, for test isolation)
3. Test database can be reset for next test run (if using isolated test database)

## Test Completion Criteria
- ✅ All test steps complete successfully
- ✅ All assertions pass
- ✅ No errors or unexpected behaviors occur
- ✅ Complete user journey from registration to post visibility is validated
- ✅ Both users can see the post in their News Feeds
- ✅ Post is accessible via Ring Chat for both users

## Notes
- This test validates the complete critical path and ensures all major features integrate correctly
- The test uses two separate browser sessions to simulate two different users
- All actions follow the happy path with no error conditions
- The test verifies both immediate visibility (Ring Chat) and aggregated visibility (News Feed)
- The test validates that adding a user to a Ring before posting ensures the added user sees the post in their News Feed
