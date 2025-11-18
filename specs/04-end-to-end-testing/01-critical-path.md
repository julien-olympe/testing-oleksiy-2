# Critical Path Test: Complete User Journey

## Test Scenario Name
Complete User Journey - Happy Path

## Description
This test validates the complete happy path user journey as described in `specs/01-idea.md`: user registers, observes news feed, creates a Ring, adds a registered friend, clicks My Rings, chooses a Ring, posts a message with a pic, goes to home and sees the post, the added friend logs in and sees the news.

This test covers ONLY the happy path - no negative test cases are included.

## Prerequisites
- Application is running and accessible
- Database is clean (no existing test data)
- Two test users will be created during the test execution

## Test Steps

### Step 1: User Registration
1. Navigate to the Login Screen (as per 4.2 Login Screen specification)
2. Verify the Login Screen displays with two tabs/sections: "Login" and "Register"
3. Click on the "Register" tab/section
4. Verify the Registration Form is displayed with:
   - Username input field (text, required)
   - Password input field (password type, required)
   - Register button
5. Enter username: `testuser1` (meets requirements: 3-50 characters, alphanumeric)
6. Enter password: `password123` (meets requirements: minimum 8 characters, contains letter and number)
7. Click the Register button
8. Verify user is automatically redirected to Home Screen (as per 3.1 User Registration specification)
9. Verify authenticated session is established (user is logged in)

### Step 2: Observe News Feed (Empty State)
1. Verify user is on Home Screen (as per 4.3 Home Screen specification)
2. Verify the Home Screen displays:
   - Search bar at the top with placeholder "Search Rings..."
   - Footer navigation at the bottom with five buttons: Home, My Rings, Find Ring, Create Ring, Settings
3. Verify the News Feed displays empty state message: "No posts yet. Join or create a Ring to see posts here." (as per 3.3 View News Feed specification)

### Step 3: Create Ring
1. Click the "Create Ring" button in the footer navigation
2. Verify user is navigated to Create Ring Screen (as per 4.7 Create Ring Screen specification)
3. Verify the Create Ring Form displays:
   - Ring name input field with placeholder "Enter Ring name..."
   - Character count indicator showing remaining characters out of 100
   - Create button
4. Enter Ring name: `TestRing1`
5. Verify character count indicator updates to show remaining characters
6. Click the Create button
7. Verify user is automatically redirected to the new Ring's Chat screen (as per 3.5 Create Ring specification)
8. Verify the Ring Chat Screen displays (as per 4.5 Ring Chat Screen specification)

### Step 4: Register Second User (Friend)
1. Open a new browser context/window (simulating a different user)
2. Navigate to the Login Screen
3. Click on the "Register" tab/section
4. Enter username: `testuser2`
5. Enter password: `password456`
6. Click the Register button
7. Verify `testuser2` is automatically redirected to Home Screen
8. Verify `testuser2` is logged in
9. Keep this browser context open for later steps

### Step 5: Add Registered Friend to Ring
1. Return to the browser context for `testuser1`
2. Verify user is on the Ring Chat Screen for `TestRing1`
3. Verify the Ring Header displays:
   - Ring name: `TestRing1`
   - Member count (should show "1 member" or "1 members")
   - "Add User" button in the header
4. Click the "Add User" button
5. Verify a modal dialog appears with:
   - Username input field
   - Add button
   - Cancel button
6. Enter username: `testuser2`
7. Click the Add button
8. Verify confirmation message is displayed: "User 'testuser2' has been added to the Ring." (as per 3.10 Add User to Ring specification)
9. Verify the modal dialog closes
10. Verify the member count in the Ring Header updates (should show "2 members")

### Step 6: Navigate to My Rings
1. Click the "My Rings" button in the footer navigation
2. Verify user is navigated to My Rings Screen (as per 4.4 My Rings Screen specification)
3. Verify the My Rings Screen displays:
   - Search bar at the top with placeholder "Search my Rings..."
   - Rings list below the search bar
   - Footer navigation at the bottom
4. Verify the Rings list displays at least one Ring item:
   - Ring name: `TestRing1` (ellipsized to 20 characters if longer, but "TestRing1" is 9 characters so full name should be shown)
   - Member count: "2 members"
5. Verify the Ring item is clickable

### Step 7: Choose a Ring and View Ring Chat
1. Click on the Ring item for `TestRing1`
2. Verify user is navigated to Ring Chat Screen for `TestRing1` (as per 3.8 View Ring Chat specification)
3. Verify the Ring Chat Screen displays:
   - Ring Header with name `TestRing1` and member count "2 members"
   - Chat Messages Area (should be empty or show empty state)
   - Message Input Area with:
     - Text input field (multiline)
     - Picture upload button/icon
     - Post button
     - Character count indicator showing remaining characters out of 5000
   - Footer navigation

### Step 8: Post Message with Picture
1. Verify the Post button is disabled (message text is empty)
2. Enter message text in the text input field: `Hello, this is my first post with a picture!`
3. Verify the Post button becomes enabled
4. Verify the character count indicator updates to show remaining characters
5. Click the Picture upload button/icon
6. Select a test image file (JPEG format, under 10MB)
7. Verify the selected image preview appears as a thumbnail with remove option
8. Click the Post button
9. Verify the new post appears immediately in the Chat Messages Area (as per 3.9 Post Message in Ring specification)
10. Verify the post displays:
    - Author username: `testuser1`
    - Message text: `Hello, this is my first post with a picture!` (full text, not truncated)
    - Picture displayed as image (clickable to view full size)
    - Timestamp (formatted as time or relative time)
11. Verify the message input field is cleared
12. Verify the image preview is removed
13. Verify the Post button is disabled again

### Step 9: Navigate to Home and See Post in News Feed
1. Click the "Home" button in the footer navigation
2. Verify user is navigated to Home Screen
3. Verify the News Feed displays at least one News Tile (as per 3.3 View News Feed specification)
4. Verify the News Tile displays:
   - Ring name: `TestRing1` (clickable)
   - Post picture thumbnail (clickable to view full size)
   - First 100 characters of message text: `Hello, this is my first post with a picture!` (full message is 48 characters, so full text should be shown)
   - Post timestamp (relative time, e.g., "just now" or "1 minute ago")
   - Author username: `testuser1`
5. Verify News Tiles are ordered newest first (reverse chronological order)

### Step 10: Friend Logs In and Sees News
1. Switch to the browser context for `testuser2`
2. Verify `testuser2` is still on Home Screen (or navigate to Home Screen if needed)
3. Wait for News Feed to load (accounting for polling mechanism, maximum 30 seconds)
4. Verify the News Feed displays at least one News Tile
5. Verify the News Tile displays:
   - Ring name: `TestRing1`
   - Post picture thumbnail
   - First 100 characters of message text: `Hello, this is my first post with a picture!`
   - Post timestamp
   - Author username: `testuser1`
6. Verify `testuser2` can see the post from `TestRing1` even though they were added by `testuser1` (as per 3.10 Add User to Ring specification: "The added user will see posts from this Ring in their News Feed")

## Expected Results Summary

1. **User Registration**: Both users successfully register and are automatically logged in
2. **Empty News Feed**: First user sees empty state message on Home Screen
3. **Ring Creation**: First user successfully creates a Ring and is redirected to Ring Chat
4. **Friend Registration**: Second user successfully registers
5. **Add User to Ring**: First user successfully adds second user to the Ring, member count updates
6. **My Rings Navigation**: First user navigates to My Rings and sees the created Ring
7. **Ring Chat Access**: First user accesses Ring Chat from My Rings
8. **Post Creation**: First user successfully posts a message with a picture in the Ring Chat
9. **News Feed Update**: First user sees the new post in their News Feed on Home Screen
10. **Friend Sees News**: Second user (who was added to the Ring) sees the post in their News Feed

## UI Elements Referenced

- **Login Screen** (4.2): Registration form, username input, password input, Register button
- **Home Screen** (4.3): Search bar, News Feed, News Tiles, footer navigation
- **Create Ring Screen** (4.7): Ring name input, character count indicator, Create button
- **My Rings Screen** (4.4): Search bar, Rings list, Ring items with name and member count
- **Ring Chat Screen** (4.5): Ring Header, Chat Messages Area, Message Input Area, Add User button, Add User modal
- **Footer Navigation**: Home, My Rings, Find Ring, Create Ring, Settings buttons

## Functional Requirements Referenced

- **3.1 User Registration**: Registration process and automatic login
- **3.3 View News Feed**: News Feed display and empty state
- **3.5 Create Ring**: Ring creation and automatic membership
- **3.6 View My Rings List**: Displaying user's Rings
- **3.8 View Ring Chat**: Accessing Ring Chat interface
- **3.9 Post Message in Ring**: Creating posts with text and pictures
- **3.10 Add User to Ring**: Adding users to Rings and News Feed visibility
