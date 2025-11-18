# Test: Join Ring (Apply for Membership) (3.12)

## Test Scenario Name
Join Ring - Positive and Negative Test Cases

## Description
This test validates the Join Ring use case (3.12) covering joining Rings from Find Ring screen, membership creation, and access updates.

## Prerequisites
- Application is running and accessible
- User `testuser_join_001` is registered and logged in
- Test Rings exist in database
- Test data setup as needed for each test case

## Test Case 1: Successful Join Ring

### Prerequisites
- User `testuser_join_001` is logged in
- Ring named `TestRingJoin001` exists
- User is NOT a member of `TestRingJoin001`
- Ring has initial member count of N

### Test Steps
1. Navigate to Find Ring Screen (4.6 Find Ring Screen)
2. Type search query: `TestRingJoin001` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify Ring `TestRingJoin001` is displayed with "Join" button
6. Click the "Join" button on the Ring item
7. Verify confirmation message is displayed: "You have joined 'TestRingJoin001'." (3.12 Join Ring)
8. Verify the Ring item updates to remove "Join" button (3.12 Join Ring: "Join button disappears for that Ring")
9. Verify status indicator shows "Member" or similar (as per 4.6 Find Ring Screen)
10. Verify user is automatically redirected to the joined Ring's Chat screen (as per 4.6 Find Ring Screen: "After joining a Ring, user is automatically redirected to that Ring's Chat screen")
11. Verify Ring Chat Screen displays for `TestRingJoin001`
12. Verify user can now post messages in the Ring (user is a member)

### Expected Results
- User successfully joins the Ring
- Confirmation message is displayed
- Join button is removed
- User is redirected to Ring Chat
- User gains access to Ring features

## Test Case 2: Join Ring Already a Member

### Prerequisites
- User `testuser_join_002` is logged in
- User is already a member of Ring named `AlreadyMemberRing`
- Ring `AlreadyMemberRing` exists

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `AlreadyMemberRing` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify Ring is displayed but "Join" button is NOT shown (user is already a member)
6. If "Join" button is somehow accessible (edge case), attempt to click it
7. Verify error message is displayed: "You are already a member of this Ring." (3.12 Join Ring)
8. Verify no duplicate membership is created
9. Verify member count does not change

### Expected Results
- Joining a Ring user is already a member of is rejected
- Error message is displayed
- No duplicate membership is created

## Test Case 3: Join Ring and Verify My Rings

### Prerequisites
- User `testuser_join_003` is logged in
- Ring named `TestRingMyRings` exists
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Search for and join `TestRingMyRings`
3. Verify user is redirected to Ring Chat
4. Navigate to My Rings Screen (4.4 My Rings Screen)
5. Wait for Rings list to load
6. Verify `TestRingMyRings` appears in My Rings list (3.6 View My Rings List)
7. Verify Ring item displays:
   - Ring name
   - Member count (updated to include the user)
8. Click on the Ring item
9. Verify user can access Ring Chat

### Expected Results
- Joined Ring appears in My Rings list
- Ring information is displayed correctly
- User can access Ring Chat from My Rings

## Test Case 4: Join Ring and Verify News Feed

### Prerequisites
- User `testuser_join_004` is logged in
- Ring named `TestRingNewsFeed` exists
- Ring has existing posts
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Search for and join `TestRingNewsFeed`
3. Verify user is redirected to Ring Chat
4. Navigate to Home Screen (4.3 Home Screen)
5. Wait for News Feed to load (polling mechanism, maximum 30 seconds)
6. Verify posts from `TestRingNewsFeed` appear in News Feed (3.3 View News Feed)
7. Verify News Tiles display correctly with Ring name and post content
8. Verify user can see all existing posts from the Ring

### Expected Results
- Joined Ring's posts appear in News Feed
- Posts are displayed correctly
- User can see existing posts

## Test Case 5: Join Ring and Post Message

### Prerequisites
- User `testuser_join_005` is logged in
- Ring named `TestRingPost` exists
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Search for and join `TestRingPost`
3. Verify user is redirected to Ring Chat
4. Verify Message Input Area is displayed and functional
5. Enter message text: `Hello, I just joined this Ring!`
6. Click Post button
7. Verify post is created successfully (3.9 Post Message in Ring)
8. Verify post appears in Ring Chat
9. Verify post appears in News Feed for all Ring members

### Expected Results
- User can post messages after joining
- Posts are created successfully
- Posts appear in Ring Chat and News Feed

## Test Case 6: Join Multiple Rings

### Prerequisites
- User `testuser_join_006` is logged in
- Rings named `RingOne`, `RingTwo`, `RingThree` exist
- User is NOT a member of these Rings

### Test Steps
1. Navigate to Find Ring Screen
2. Search for and join `RingOne`
3. Verify user is redirected to Ring Chat for `RingOne`
4. Navigate to Find Ring Screen again
5. Search for and join `RingTwo`
6. Verify user is redirected to Ring Chat for `RingTwo`
7. Navigate to Find Ring Screen again
8. Search for and join `RingThree`
9. Verify user is redirected to Ring Chat for `RingThree`
10. Navigate to My Rings Screen
11. Verify all three Rings appear in My Rings list
12. Verify user is a member of all three Rings

### Expected Results
- User can join multiple Rings
- All joined Rings appear in My Rings
- User is a member of all joined Rings

## Test Case 7: Join Ring Error Handling

### Prerequisites
- User `testuser_join_007` is logged in
- Ring named `TestRingError` exists
- User is NOT a member of the Ring
- Simulate API failure (network error or server error)

### Test Steps
1. Navigate to Find Ring Screen
2. Search for `TestRingError`
3. Verify Ring is displayed with "Join" button
4. Simulate API failure for join operation
5. Click "Join" button
6. Verify error message is displayed: "Unable to join Ring. Please try again." (3.12 Join Ring)
7. Verify user is not redirected
8. Verify "Join" button is still visible (user did not join)
9. Verify user can retry the join operation

### Expected Results
- Error message is displayed when API request fails
- User is not redirected
- Join button remains visible
- User can retry the operation

## Test Case 8: Join Ring and Member Count Update

### Prerequisites
- User `testuser_join_008` is logged in
- Ring named `TestRingCount` exists with 5 members
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Search for `TestRingCount`
3. Verify Ring displays member count: "5 members"
4. Click "Join" button
5. Verify user joins successfully
6. Verify user is redirected to Ring Chat
7. Verify Ring Header shows updated member count: "6 members" (includes the new member)
8. Navigate to Find Ring Screen and search again
9. Verify member count in search results is updated: "6 members"

### Expected Results
- Member count updates after joining
- Count reflects the new member
- Count is consistent across screens

## Test Case 9: Join Ring from Search Results

### Prerequisites
- User `testuser_join_009` is logged in
- Multiple Rings exist with names containing "Test"
- User is NOT a member of these Rings

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `Test` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify multiple Rings are displayed
6. Click "Join" button on one of the Rings
7. Verify user joins successfully
8. Verify user is redirected to that Ring's Chat
9. Navigate back to Find Ring Screen
10. Search for "Test" again
11. Verify the joined Ring no longer shows "Join" button
12. Verify other non-member Rings still show "Join" button

### Expected Results
- Join works from search results
- Joined Ring's status updates in search results
- Other Rings remain joinable

## Test Case 10: Join Ring and Access Control

### Prerequisites
- User `testuser_join_010` is logged in
- Ring named `TestRingAccess` exists
- User is NOT a member of the Ring
- Ring has posts from other members

### Test Steps
1. Navigate to Find Ring Screen
2. Search for and join `TestRingAccess`
3. Verify user is redirected to Ring Chat
4. Verify user can view all posts in the Ring (3.8 View Ring Chat)
5. Verify user can post messages in the Ring (3.9 Post Message in Ring)
6. Verify user can add other users to the Ring (3.10 Add User to Ring)
7. Verify user has full access to Ring features

### Expected Results
- User gains full access to Ring after joining
- All Ring features are accessible
- User can interact with the Ring

## Test Case 11: Join Ring Button Disappears

### Prerequisites
- User `testuser_join_011` is logged in
- Ring named `TestRingButton` exists
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Search for `TestRingButton`
3. Verify "Join" button is displayed
4. Click "Join" button
5. Verify confirmation message is displayed
6. Verify "Join" button disappears immediately (3.12 Join Ring: "Join button disappears for that Ring")
7. Verify status indicator shows membership status
8. Refresh the page or navigate away and back
9. Search for `TestRingButton` again
10. Verify "Join" button is still not displayed (user is a member)

### Expected Results
- Join button disappears after joining
- Status persists across page refreshes
- Join button does not reappear

## Test Case 12: Join Ring and Verify Immediate Visibility

### Prerequisites
- User `testuser_join_012` is logged in
- Ring named `TestRingImmediate` exists
- Ring has recent posts
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Search for and join `TestRingImmediate`
3. Verify user is redirected to Ring Chat
4. Verify user can immediately see existing posts in Ring Chat
5. Navigate to Home Screen
6. Wait for News Feed to refresh (polling mechanism, maximum 30 seconds)
7. Verify posts from `TestRingImmediate` appear in News Feed immediately after joining

### Expected Results
- User can see existing posts immediately after joining
- Posts appear in News Feed after joining
- No delay in access to Ring content

## UI Elements Referenced

- **Find Ring Screen** (4.6): Search bar, Search Results List, Ring items with Join button, status indicator
- **Ring Chat Screen** (4.5): Ring Header, member count, Message Input Area, Chat Messages Area
- **My Rings Screen** (4.4): Rings list
- **Home Screen** (4.3): News Feed, News Tiles

## Functional Requirements Referenced

- **3.12 Join Ring (Apply for Membership)**: Complete join Ring use case with membership creation, access updates, and error handling
- **3.6 View My Rings List**: Referenced for verifying joined Ring appears in My Rings
- **3.8 View Ring Chat**: Referenced for verifying user can access Ring Chat after joining
- **3.9 Post Message in Ring**: Referenced for verifying user can post after joining
- **3.10 Add User to Ring**: Referenced for verifying user can add others after joining
