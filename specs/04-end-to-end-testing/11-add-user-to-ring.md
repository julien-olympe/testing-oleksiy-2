# Test: Add User to Ring (3.10)

## Test Scenario Name
Add User to Ring - Positive and Negative Test Cases

## Description
This test validates the Add User to Ring use case (3.10) covering adding registered users to Rings, validation, and membership updates.

## Prerequisites
- Application is running and accessible
- User `testuser_add_001` is registered and logged in
- User `testuser_add_target_001` is registered (target user to be added)
- Test data setup as needed for each test case

## Test Case 1: Successful Add User to Ring

### Prerequisites
- User `testuser_add_001` is logged in
- User `testuser_add_001` is a member of a Ring
- User `testuser_add_target_001` exists and is NOT a member of the Ring
- Ring has initial member count of N

### Test Steps
1. Navigate to Ring Chat Screen for the Ring (4.5 Ring Chat Screen)
2. Verify Ring Header displays:
   - Ring name
   - Member count (e.g., "2 members")
   - "Add User" button in the header
3. Click the "Add User" button
4. Verify a modal dialog appears with:
   - Username input field
   - Add button
   - Cancel button (as per 4.5 Ring Chat Screen)
5. Enter username: `testuser_add_target_001`
6. Click Add button
7. Verify confirmation message is displayed: "User 'testuser_add_target_001' has been added to the Ring." (3.10 Add User to Ring)
8. Verify modal dialog closes
9. Verify member count in Ring Header updates (e.g., from "2 members" to "3 members")
10. Verify `testuser_add_target_001` can now access the Ring (login as that user and verify they can see the Ring in My Rings and News Feed)

### Expected Results
- User is successfully added to the Ring
- Confirmation message is displayed
- Member count updates
- Added user gains access to the Ring

## Test Case 2: User Not Found

### Prerequisites
- User `testuser_add_002` is logged in
- User `testuser_add_002` is a member of a Ring
- No user with username `nonexistentuser123` exists

### Test Steps
1. Navigate to Ring Chat Screen
2. Click the "Add User" button
3. Verify modal dialog appears
4. Enter username: `nonexistentuser123`
5. Click Add button
6. Verify error message is displayed: "User 'nonexistentuser123' not found." (3.10 Add User to Ring)
7. Verify modal dialog remains open (or closes and shows error, implementation dependent)
8. Verify user is not added to the Ring
9. Verify member count does not change

### Expected Results
- Non-existent username is rejected
- Error message is displayed
- No user is added
- Member count remains unchanged

## Test Case 3: User Already a Member

### Prerequisites
- User `testuser_add_003` is logged in
- User `testuser_add_003` is a member of a Ring
- User `testuser_add_target_002` is already a member of the same Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Click the "Add User" button
3. Verify modal dialog appears
4. Enter username: `testuser_add_target_002`
5. Click Add button
6. Verify error message is displayed: "User 'testuser_add_target_002' is already a member of this Ring." (3.10 Add User to Ring)
7. Verify user is not added again (no duplicate membership)
8. Verify member count does not change

### Expected Results
- Adding an existing member is rejected
- Error message indicates user is already a member
- No duplicate membership is created
- Member count remains unchanged

## Test Case 4: Add User by Non-Member (Access Denied)

### Prerequisites
- User `testuser_add_004` is logged in
- User `testuser_add_004` is NOT a member of a specific Ring
- Attempt to add user via invalid navigation or direct API call

### Test Steps
1. Attempt to access Ring Chat for a Ring the user is not a member of
2. If access is somehow possible, attempt to click "Add User" button
3. Verify error message is displayed: "You are not a member of this Ring." (3.10 Add User to Ring)
4. Verify user cannot add other users to Rings they don't belong to

### Expected Results
- Non-members cannot add users to Rings
- Error message is displayed
- Operation is denied

## Test Case 5: Cancel Add User

### Prerequisites
- User `testuser_add_005` is logged in
- User `testuser_add_005` is a member of a Ring
- User `testuser_add_target_003` exists and is NOT a member of the Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Click the "Add User" button
3. Verify modal dialog appears
4. Enter username: `testuser_add_target_003`
5. Click Cancel button
6. Verify modal dialog closes
7. Verify no user is added to the Ring
8. Verify member count does not change
9. Verify no confirmation message is displayed

### Expected Results
- Cancel button closes modal without adding user
- No changes are made
- Member count remains unchanged

## Test Case 6: Empty Username

### Prerequisites
- User `testuser_add_006` is logged in
- User `testuser_add_006` is a member of a Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Click the "Add User" button
3. Verify modal dialog appears
4. Leave username field empty
5. Click Add button
6. Verify validation error is displayed (browser native validation or custom validation)
7. Verify no user is added
8. Verify member count does not change

### Expected Results
- Empty username is rejected
- Validation error is displayed
- No user is added

## Test Case 7: Add Multiple Users

### Prerequisites
- User `testuser_add_007` is logged in
- User `testuser_add_007` is a member of a Ring
- Users `testuser_add_target_004` and `testuser_add_target_005` exist and are NOT members of the Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Note initial member count
3. Click "Add User" button
4. Enter username: `testuser_add_target_004`
5. Click Add button
6. Verify confirmation message and member count update
7. Click "Add User" button again
8. Enter username: `testuser_add_target_005`
9. Click Add button
10. Verify confirmation message and member count update again
11. Verify both users are now members of the Ring
12. Verify member count reflects both additions

### Expected Results
- Multiple users can be added sequentially
- Each addition updates member count
- All added users become members

## Test Case 8: Added User Sees Ring in My Rings

### Prerequisites
- User `testuser_add_008` is logged in
- User `testuser_add_008` is a member of a Ring
- User `testuser_add_target_006` exists and is NOT a member of the Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Click "Add User" button
3. Enter username: `testuser_add_target_006`
4. Click Add button
5. Verify user is added successfully
6. Logout and login as `testuser_add_target_006`
7. Navigate to My Rings Screen
8. Verify the Ring appears in My Rings list (3.6 View My Rings List)
9. Verify Ring item displays correct name and member count

### Expected Results
- Added user sees the Ring in their My Rings list
- Ring information is displayed correctly

## Test Case 9: Added User Sees Posts in News Feed

### Prerequisites
- User `testuser_add_009` is logged in
- User `testuser_add_009` is a member of a Ring
- Ring has existing posts
- User `testuser_add_target_007` exists and is NOT a member of the Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Note existing posts in the Ring
3. Click "Add User" button
4. Enter username: `testuser_add_target_007`
5. Click Add button
6. Verify user is added successfully
7. Logout and login as `testuser_add_target_007`
8. Navigate to Home Screen
9. Wait for News Feed to load (polling mechanism, maximum 30 seconds)
10. Verify posts from the Ring appear in News Feed (3.10 Add User to Ring: "The added user will see posts from this Ring in their News Feed")
11. Verify News Tiles display correctly

### Expected Results
- Added user sees existing posts in News Feed
- Posts are displayed correctly
- News Feed includes posts from the newly joined Ring

## Test Case 10: Add User and Verify Access to Chat

### Prerequisites
- User `testuser_add_010` is logged in
- User `testuser_add_010` is a member of a Ring
- Ring has posts
- User `testuser_add_target_008` exists and is NOT a member of the Ring

### Test Steps
1. Navigate to Ring Chat Screen
2. Click "Add User" button
3. Enter username: `testuser_add_target_008`
4. Click Add button
5. Verify user is added successfully
6. Logout and login as `testuser_add_target_008`
7. Navigate to My Rings Screen
8. Click on the Ring item
9. Verify user can access Ring Chat (3.8 View Ring Chat)
10. Verify user can see all posts in the Ring
11. Verify user can post messages in the Ring (3.9 Post Message in Ring)

### Expected Results
- Added user can access Ring Chat
- Added user can view all posts
- Added user can post messages

## Test Case 11: Case-Sensitive Username Matching

### Prerequisites
- User `testuser_add_011` is logged in
- User `testuser_add_011` is a member of a Ring
- User with username `TestUserCase` exists (exact case)

### Test Steps
1. Navigate to Ring Chat Screen
2. Click "Add User" button
3. Enter username: `testusercase` (lowercase)
4. Click Add button
5. Verify behavior (implementation dependent - username matching may be case-sensitive or case-insensitive)
6. If case-insensitive: Verify user is added successfully
7. If case-sensitive: Verify error "User not found" or user is not added

### Expected Results
- Behavior depends on implementation (case-sensitive or case-insensitive username matching)
- Document the actual behavior observed

## Test Case 12: Member Count Accuracy After Multiple Additions

### Prerequisites
- User `testuser_add_012` is logged in
- User `testuser_add_012` is a member of a Ring
- Ring starts with 2 members
- Users `testuser_add_target_009`, `testuser_add_target_010`, `testuser_add_target_011` exist

### Test Steps
1. Navigate to Ring Chat Screen
2. Verify initial member count: "2 members"
3. Add `testuser_add_target_009`: Verify count becomes "3 members"
4. Add `testuser_add_target_010`: Verify count becomes "4 members"
5. Add `testuser_add_target_011`: Verify count becomes "5 members"
6. Verify member count is accurate after each addition

### Expected Results
- Member count updates accurately after each addition
- Count reflects current membership

## UI Elements Referenced

- **Ring Chat Screen** (4.5): Ring Header, "Add User" button, Add User modal dialog with username input, Add button, Cancel button
- **My Rings Screen** (4.4): Rings list
- **Home Screen** (4.3): News Feed

## Functional Requirements Referenced

- **3.10 Add User to Ring**: Complete add user use case with validation, error handling, and membership updates
- **3.6 View My Rings List**: Referenced for verifying added user sees Ring in My Rings
- **3.8 View Ring Chat**: Referenced for verifying added user can access Ring Chat
- **3.9 Post Message in Ring**: Referenced for verifying added user can post messages
