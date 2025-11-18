# Use Case 3.10: Add User to Ring - End-to-End Tests

## Test Name: Add User to Ring - Positive Cases

### Test 3.10.1: Successfully Add Registered User to Ring

**Test Description**: Validates that authenticated user can successfully add another registered user to a Ring they are a member of.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_adder_001` is registered and logged in
3. User `testuser_toadd_001` is registered (exists in database)
4. User `testuser_adder_001` is a member of Ring `AddUserRing_001`
5. User `testuser_toadd_001` is NOT a member of `AddUserRing_001`

**Test Data**:
- Adding User: `testuser_adder_001`
- User to Add: `testuser_toadd_001` (exists, not a member)
- Ring: `AddUserRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_adder_001`
2. Navigate to Ring Chat for `AddUserRing_001`
3. Observe Ring header with "Add User" button
4. Click "Add User" button in header
5. Observe modal dialog appears
6. Enter username: `testuser_toadd_001` in the username input field
7. Click "Add" button in modal dialog

**Expected Results**:
- Modal dialog appears with:
  - Username input field
  - "Add" button
  - "Cancel" button
- After entering username and clicking Add:
  - User is successfully added to the Ring
  - Confirmation message is displayed: "User 'testuser_toadd_001' has been added to the Ring."
  - Modal dialog closes
  - Member count in header updates (e.g., from "2 members" to "3 members" if there were 2 members before)
- Added user can now access the Ring (verified separately)

**Assertions**:
- HTTP status code: 200 or 201
- Membership record is created in database linking `testuser_toadd_001` to `AddUserRing_001`
- Member count is updated correctly
- Confirmation message is displayed
- Added user can access Ring Chat and see posts

---

### Test 3.10.2: Add User and Verify Access

**Test Description**: Validates that added user can immediately access the Ring and see its content.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_adder_002` is registered and logged in
3. User `testuser_added_002` is registered
4. User `testuser_adder_002` is a member of Ring `AccessRing_001`
5. Ring `AccessRing_001` has at least 1 post
6. User `testuser_added_002` is NOT a member initially

**Test Data**:
- Adding User: `testuser_adder_002`
- User to Add: `testuser_added_002`
- Ring: `AccessRing_001` (has posts)

**Test Steps**:
1. User `testuser_adder_002` adds `testuser_added_002` to `AccessRing_001` (following steps from Test 3.10.1)
2. Switch to User `testuser_added_002` session (or have them log in)
3. Navigate to My Rings screen
4. Verify Ring `AccessRing_001` appears in My Rings list
5. Navigate to Ring Chat for `AccessRing_001`
6. Verify user can see posts in the Ring
7. Navigate to Home screen
8. Verify posts from `AccessRing_001` appear in News Feed

**Expected Results**:
- Ring `AccessRing_001` appears in `testuser_added_002`'s My Rings list
- User can navigate to Ring Chat and see all posts
- Posts from `AccessRing_001` appear in user's News Feed
- User can post messages in the Ring

**Assertions**:
- HTTP status code: 200 (for all access attempts)
- Added user has full access to the Ring
- Posts are visible in Ring Chat and News Feed
- User can post in the Ring

---

### Test 3.10.3: Add Multiple Users to Ring

**Test Description**: Validates that multiple users can be added to a Ring sequentially.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_multiadder_001` is registered and logged in
3. Users `testuser_multi1_001`, `testuser_multi2_001`, `testuser_multi3_001` are registered
4. User `testuser_multiadder_001` is a member of Ring `MultiAddRing_001`
5. None of the three users are members initially

**Test Data**:
- Adding User: `testuser_multiadder_001`
- Users to Add: `testuser_multi1_001`, `testuser_multi2_001`, `testuser_multi3_001`
- Ring: `MultiAddRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_multiadder_001`
2. Navigate to Ring Chat for `MultiAddRing_001`
3. Add first user: `testuser_multi1_001`
4. Verify confirmation and member count updates
5. Add second user: `testuser_multi2_001`
6. Verify confirmation and member count updates
7. Add third user: `testuser_multi3_001`
8. Verify confirmation and member count updates

**Expected Results**:
- All three users are added successfully
- Confirmation messages are displayed for each addition
- Member count updates after each addition (e.g., 2, 3, 4 members)
- All added users can access the Ring

**Assertions**:
- HTTP status code: 200 or 201 (for each addition)
- All three membership records are created
- Member count is accurate after each addition
- All users have access to the Ring

---

## Test Name: Add User to Ring - Negative Cases

### Test 3.10.4: Add User - Username Not Found

**Test Description**: Validates that adding a user fails when username does not exist.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_notfound_001` is registered and logged in
3. User `testuser_notfound_001` is a member of Ring `NotFoundRing_001`
4. Username `nonexistent_user_999` does not exist in database

**Test Data**:
- Adding User: `testuser_notfound_001`
- Username to Add: `nonexistent_user_999` (does not exist)
- Ring: `NotFoundRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_notfound_001`
2. Navigate to Ring Chat for `NotFoundRing_001`
3. Click "Add User" button
4. Enter username: `nonexistent_user_999`
5. Click "Add" button

**Expected Results**:
- Adding user fails
- Error message is displayed: "User 'nonexistent_user_999' not found."
- Modal dialog remains open (or closes with error message)
- No membership record is created
- Member count does not change

**Assertions**:
- HTTP status code: 404 (Not Found) or 400 (Bad Request)
- Error message text matches exactly: "User 'nonexistent_user_999' not found."
- No membership record is created
- Member count remains unchanged

---

### Test 3.10.5: Add User - User Already a Member

**Test Description**: Validates that adding a user fails when user is already a member of the Ring.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_already_001` is registered and logged in
3. User `testuser_existing_001` is registered
4. User `testuser_already_001` is a member of Ring `AlreadyMemberRing_001`
5. User `testuser_existing_001` is already a member of `AlreadyMemberRing_001`

**Test Data**:
- Adding User: `testuser_already_001`
- User to Add: `testuser_existing_001` (already a member)
- Ring: `AlreadyMemberRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_already_001`
2. Navigate to Ring Chat for `AlreadyMemberRing_001`
3. Click "Add User" button
4. Enter username: `testuser_existing_001`
5. Click "Add" button

**Expected Results**:
- Adding user fails
- Error message is displayed: "User 'testuser_existing_001' is already a member of this Ring."
- Modal dialog remains open (or closes with error message)
- No duplicate membership record is created
- Member count does not change

**Assertions**:
- HTTP status code: 400 (Bad Request) or 409 (Conflict)
- Error message text matches exactly: "User 'testuser_existing_001' is already a member of this Ring."
- No duplicate membership record is created
- Member count remains unchanged

---

### Test 3.10.6: Add User - Not a Member of Ring

**Test Description**: Validates that adding a user fails when the adding user is not a member of the Ring.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_notmember_adder_001` is registered and logged in
3. User `testuser_target_001` is registered
4. Ring `NotMemberAdderRing_001` exists
5. User `testuser_notmember_adder_001` is NOT a member of `NotMemberAdderRing_001`
6. Attempt to add user via direct API call or invalid navigation

**Test Data**:
- Adding User: `testuser_notmember_adder_001` (not a member)
- User to Add: `testuser_target_001`
- Ring: `NotMemberAdderRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_notmember_adder_001`
2. Attempt to add `testuser_target_001` to `NotMemberAdderRing_001` (via API call or invalid navigation)

**Expected Results**:
- Adding user fails
- Error message is displayed: "You are not a member of this Ring."
- No membership record is created

**Assertions**:
- HTTP status code: 403 (Forbidden)
- Error message text matches exactly: "You are not a member of this Ring."
- No membership record is created
- Note: This should not happen through normal UI navigation (users can only access Rings they're members of), but should be tested for security

---

### Test 3.10.7: Add User - Cancel Operation

**Test Description**: Validates that canceling the Add User operation closes the modal without adding the user.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_cancel_001` is registered and logged in
3. User `testuser_cancel_target_001` is registered
4. User `testuser_cancel_001` is a member of Ring `CancelRing_001`
5. User `testuser_cancel_target_001` is NOT a member

**Test Data**:
- Adding User: `testuser_cancel_001`
- User to Add: `testuser_cancel_target_001`
- Ring: `CancelRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_cancel_001`
2. Navigate to Ring Chat for `CancelRing_001`
3. Click "Add User" button
4. Enter username: `testuser_cancel_target_001`
5. Click "Cancel" button in modal dialog

**Expected Results**:
- Modal dialog closes
- No user is added to the Ring
- No confirmation message is displayed
- Member count does not change
- User remains on Ring Chat screen

**Assertions**:
- No API call is made (or API call is not sent)
- Modal closes without adding user
- No membership record is created
- Member count remains unchanged

---

### Test 3.10.8: Add User - Empty Username

**Test Description**: Validates that adding a user fails when username field is empty.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_empty_username_001` is registered and logged in
3. User `testuser_empty_username_001` is a member of Ring `EmptyUsernameRing_001`

**Test Data**:
- Adding User: `testuser_empty_username_001`
- Username to Add: `` (empty)
- Ring: `EmptyUsernameRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_empty_username_001`
2. Navigate to Ring Chat for `EmptyUsernameRing_001`
3. Click "Add User" button
4. Leave username field empty
5. Attempt to click "Add" button (if enabled) or verify button is disabled

**Expected Results**:
- Add button is disabled when username is empty (preferred UX)
- OR if button is enabled and clicked:
  - Adding user fails
  - Error message is displayed (validation error)
  - No membership record is created

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- No membership record is created
- Validation prevents empty username submission

---

## Cleanup
- Test users and Rings created for Add User tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
