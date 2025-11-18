# Use Case 3.12: Join Ring (Apply for Membership) - End-to-End Tests

## Test Name: Join Ring - Positive Cases

### Test 3.12.1: Successfully Join a Ring

**Test Description**: Validates that authenticated user can successfully join a Ring they are not a member of by clicking the "Join" button.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_join_001` is registered and logged in
3. Ring `JoinTestRing_001` exists
4. User `testuser_join_001` is NOT a member of `JoinTestRing_001`

**Test Data**:
- User: `testuser_join_001`
- Ring: `JoinTestRing_001` (not a member)

**Test Steps**:
1. Ensure user is logged in as `testuser_join_001`
2. Navigate to Find Ring screen
3. Search for Ring: `JoinTestRing_001`
4. Observe search results showing `JoinTestRing_001` with "Join" button
5. Click "Join" button

**Expected Results**:
- After clicking Join:
  - User is successfully added to the Ring
  - Confirmation message is displayed: "You have joined 'JoinTestRing_001'."
  - "Join" button is removed from the Ring item (or replaced with "Member" status)
  - User is automatically redirected to the Ring's Chat screen
  - Ring Chat displays:
    - Ring name: `JoinTestRing_001` in header
    - Member count (updated to include new member)
    - "Add User" button
    - Message history (or empty state)
    - Message input area

**Assertions**:
- HTTP status code: 200 or 201
- Membership record is created in database linking user to Ring
- User is redirected to Ring Chat screen
- Ring appears in user's My Rings list
- User can view and post in the Ring
- Posts from Ring appear in user's News Feed

---

### Test 3.12.2: Join Ring and Verify Access

**Test Description**: Validates that after joining, user has full access to the Ring including viewing posts and posting messages.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_join_access_001` is registered and logged in
3. Ring `JoinAccessRing_001` exists and has at least 2 posts from other members
4. User `testuser_join_access_001` is NOT a member initially

**Test Data**:
- User: `testuser_join_access_001`
- Ring: `JoinAccessRing_001` (has posts, user not a member)

**Test Steps**:
1. Ensure user is logged in as `testuser_join_access_001`
2. Join Ring `JoinAccessRing_001` (following steps from Test 3.12.1)
3. After redirect to Ring Chat, verify access:
   - Observe all posts in Ring Chat
   - Navigate to My Rings screen
   - Verify Ring appears in My Rings list
   - Navigate to Home screen
   - Verify posts from Ring appear in News Feed
   - Navigate back to Ring Chat
   - Post a test message in the Ring

**Expected Results**:
- User can see all posts in Ring Chat
- Ring appears in My Rings list
- Posts from Ring appear in News Feed
- User can post messages in the Ring
- All Ring functionality is accessible

**Assertions**:
- HTTP status code: 200 (for all access attempts)
- User has full access to Ring features
- Posts are visible in Ring Chat and News Feed
- User can post in the Ring

---

### Test 3.12.3: Join Multiple Rings

**Test Description**: Validates that user can join multiple Rings sequentially.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_join_multi_001` is registered and logged in
3. Rings exist: `JoinRing1_001`, `JoinRing2_001`, `JoinRing3_001`
4. User is NOT a member of any of these Rings initially

**Test Data**:
- User: `testuser_join_multi_001`
- Rings: `JoinRing1_001`, `JoinRing2_001`, `JoinRing3_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_join_multi_001`
2. Join first Ring: `JoinRing1_001`
3. Verify confirmation and redirect
4. Navigate back to Find Ring screen
5. Join second Ring: `JoinRing2_001`
6. Verify confirmation and redirect
7. Navigate back to Find Ring screen
8. Join third Ring: `JoinRing3_001`
9. Verify confirmation and redirect
10. Navigate to My Rings screen
11. Verify all three Rings appear in My Rings list

**Expected Results**:
- All three Rings are joined successfully
- Confirmation messages are displayed for each join
- User is redirected to Ring Chat after each join
- All three Rings appear in My Rings list
- Posts from all three Rings appear in News Feed

**Assertions**:
- HTTP status code: 200 or 201 (for each join)
- All three membership records are created
- All Rings appear in My Rings list
- User has access to all joined Rings

---

## Test Name: Join Ring - Negative Cases

### Test 3.12.4: Join Ring - Already a Member

**Test Description**: Validates that joining fails when user is already a member of the Ring.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_already_join_001` is registered and logged in
3. Ring `AlreadyMemberJoinRing_001` exists
4. User `testuser_already_join_001` is already a member of `AlreadyMemberJoinRing_001`

**Test Data**:
- User: `testuser_already_join_001`
- Ring: `AlreadyMemberJoinRing_001` (already a member)

**Test Steps**:
1. Ensure user is logged in as `testuser_already_join_001`
2. Navigate to Find Ring screen
3. Search for Ring: `AlreadyMemberJoinRing_001`
4. Observe search results (should show "Member" status, no "Join" button)
5. If "Join" button is still visible (should not be), attempt to click it
6. OR attempt to join via direct API call

**Expected Results**:
- Search results show "Member" status (no "Join" button) - preferred UX
- OR if "Join" button is clicked:
  - Joining fails
  - Error message is displayed: "You are already a member of this Ring."
  - No duplicate membership record is created

**Assertions**:
- HTTP status code: 400 (Bad Request) or 409 (Conflict) if join attempted
- Error message text matches exactly: "You are already a member of this Ring."
- No duplicate membership record is created
- UI should prevent joining Rings user is already a member of

---

### Test 3.12.5: Join Ring - API Error Handling

**Test Description**: Validates that Join Ring handles API errors gracefully.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_join_error_001` is registered and logged in
3. Ring `ErrorJoinRing_001` exists
4. User is NOT a member
5. Simulate API error (network failure, server error, etc.)

**Test Data**:
- User: `testuser_join_error_001`
- Ring: `ErrorJoinRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_join_error_001`
2. Navigate to Find Ring screen
3. Search for Ring: `ErrorJoinRing_001`
4. Simulate API error condition
5. Click "Join" button

**Expected Results**:
- Joining fails due to API error
- Error message is displayed: "Unable to join Ring. Please try again."
- User remains on Find Ring screen (or appropriate screen)
- No membership record is created
- User can retry joining

**Assertions**:
- HTTP status code: 500 or network error
- Error message text matches exactly: "Unable to join Ring. Please try again."
- Application does not crash
- User can recover from error state and retry

---

### Test 3.12.6: Join Ring - Ring Does Not Exist

**Test Description**: Validates that joining fails when Ring does not exist (edge case for direct API calls).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_join_nonexistent_001` is registered and logged in
3. Ring with ID does not exist in database
4. Attempt to join via direct API call with invalid Ring ID

**Test Data**:
- User: `testuser_join_nonexistent_001`
- Ring ID: Invalid/non-existent Ring ID

**Test Steps**:
1. Ensure user is logged in as `testuser_join_nonexistent_001`
2. Attempt to join non-existent Ring via direct API call

**Expected Results**:
- Joining fails
- Error message is displayed (404 Not Found or appropriate error)
- No membership record is created

**Assertions**:
- HTTP status code: 404 (Not Found)
- Appropriate error message is displayed
- No membership record is created
- Note: This should not happen through normal UI navigation, but should be tested for security

---

## Cleanup
- Test users and Rings created for Join Ring tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
