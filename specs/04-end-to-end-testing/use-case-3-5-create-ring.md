# Use Case 3.5: Create Ring - End-to-End Tests

## Test Name: Create Ring - Positive Cases

### Test 3.5.1: Successful Ring Creation with Valid Name

**Test Description**: Validates that authenticated user can successfully create a new Ring with a valid unique name and is automatically added as a member.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_createring_001` is registered and logged in
3. Ring name `TestRing_New_001` does not exist in database

**Test Data**:
- User: `testuser_createring_001`
- Ring Name: `TestRing_New_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_createring_001`
2. Navigate to Create Ring screen (click "Create Ring" in footer)
3. Observe Create Ring form
4. Enter Ring name: `TestRing_New_001`
5. Observe character count indicator updates
6. Click "Create" button

**Expected Results**:
- Create Ring screen displays form with:
  - Ring name input field
  - Character count indicator (showing current count out of 100)
  - Create button (enabled when name is entered)
  - Help text explaining what a Ring is
- After entering Ring name, character count updates
- After clicking Create, Ring is created successfully
- User is automatically redirected to Ring Chat screen for the newly created Ring
- Ring Chat displays:
  - Ring name: `TestRing_New_001` in header
  - Member count: "1 member" (or "1 members")
  - "Add User" button in header
  - Empty state message: "No messages yet. Be the first to post!"
  - Message input area at the bottom

**Assertions**:
- HTTP status code: 200 or 201
- Ring record is created in database with correct name and creator_id
- Membership record is created linking user to the new Ring
- User is automatically a member of the created Ring
- Ring Chat screen displays correctly

---

### Test 3.5.2: Create Ring with Minimum Valid Name Length

**Test Description**: Validates that Ring creation works with minimum valid name length (1 character).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_minring_001` is registered and logged in
3. Ring name `A` does not exist in database

**Test Data**:
- User: `testuser_minring_001`
- Ring Name: `A` (exactly 1 character, minimum valid length)

**Test Steps**:
1. Ensure user is logged in as `testuser_minring_001`
2. Navigate to Create Ring screen
3. Enter Ring name: `A`
4. Click "Create" button

**Expected Results**:
- Ring is created successfully
- User is redirected to Ring Chat screen
- Ring name `A` is displayed in header

**Assertions**:
- HTTP status code: 200 or 201
- Ring record is created with 1-character name
- Ring is accessible and functional

---

### Test 3.5.3: Create Ring with Maximum Valid Name Length

**Test Description**: Validates that Ring creation works with maximum valid name length (100 characters).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_maxring_001` is registered and logged in
3. Ring name does not exist in database

**Test Data**:
- User: `testuser_maxring_001`
- Ring Name: `abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?` (exactly 100 characters)

**Test Steps**:
1. Ensure user is logged in as `testuser_maxring_001`
2. Navigate to Create Ring screen
3. Enter Ring name (100 characters)
4. Click "Create" button

**Expected Results**:
- Ring is created successfully
- User is redirected to Ring Chat screen
- Full 100-character Ring name is displayed in header

**Assertions**:
- HTTP status code: 200 or 201
- Ring record is created with 100-character name
- Ring name is stored and displayed correctly

---

### Test 3.5.4: Create Ring and Verify Automatic Membership

**Test Description**: Validates that Ring creator is automatically added as a member and can immediately post.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_automatic_001` is registered and logged in

**Test Data**:
- User: `testuser_automatic_001`
- Ring Name: `AutoMemberRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_automatic_001`
2. Navigate to Create Ring screen
3. Enter Ring name: `AutoMemberRing_001`
4. Click "Create" button
5. After redirect to Ring Chat, verify membership
6. Navigate to My Rings screen
7. Verify Ring appears in My Rings list

**Expected Results**:
- Ring is created successfully
- User is redirected to Ring Chat
- User can see message input area (indicating membership)
- Member count shows "1 member"
- Ring appears in My Rings list with name `AutoMemberRing_001`
- User can immediately post in the Ring

**Assertions**:
- HTTP status code: 200 or 201
- Membership record exists linking user to Ring
- User can access Ring Chat
- Ring appears in user's My Rings list
- User can post messages in the Ring

---

## Test Name: Create Ring - Negative Cases

### Test 3.5.5: Create Ring with Duplicate Name

**Test Description**: Validates that Ring creation fails when Ring name already exists.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_duplicate_001` is registered and logged in
3. Ring with name `DuplicateRing_001` already exists in database (created by any user)

**Test Data**:
- User: `testuser_duplicate_001`
- Ring Name: `DuplicateRing_001` (already exists)

**Test Steps**:
1. Ensure user is logged in as `testuser_duplicate_001`
2. Navigate to Create Ring screen
3. Enter Ring name: `DuplicateRing_001`
4. Click "Create" button

**Expected Results**:
- Ring creation fails
- Error message is displayed: "Ring name already exists. Please choose a different name."
- User remains on Create Ring screen
- Ring name input field still contains the entered name
- No Ring is created

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Ring name already exists. Please choose a different name."
- No Ring record is created in database
- User is not redirected to Ring Chat

---

### Test 3.5.6: Create Ring with Empty Name

**Test Description**: Validates that Ring creation fails when Ring name is empty.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_empty_001` is registered and logged in

**Test Data**:
- User: `testuser_empty_001`
- Ring Name: `` (empty)

**Test Steps**:
1. Ensure user is logged in as `testuser_empty_001`
2. Navigate to Create Ring screen
3. Leave Ring name field empty
4. Attempt to click "Create" button (if enabled) or verify button is disabled

**Expected Results**:
- Create button is disabled when name is empty (preferred UX)
- OR if button is enabled and clicked:
  - Ring creation fails
  - Error message is displayed: "Ring name must be between 1 and 100 characters."
  - User remains on Create Ring screen

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- Error message text matches: "Ring name must be between 1 and 100 characters."
- No Ring record is created

---

### Test 3.5.7: Create Ring with Name Too Long

**Test Description**: Validates that Ring creation fails when Ring name exceeds 100 characters.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_toolong_001` is registered and logged in

**Test Data**:
- User: `testuser_toolong_001`
- Ring Name: `abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?X` (101 characters, exceeds maximum)

**Test Steps**:
1. Ensure user is logged in as `testuser_toolong_001`
2. Navigate to Create Ring screen
3. Enter Ring name (101 characters)
4. Click "Create" button

**Expected Results**:
- Ring creation fails
- Error message is displayed: "Ring name must be between 1 and 100 characters."
- User remains on Create Ring screen
- No Ring is created

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Ring name must be between 1 and 100 characters."
- No Ring record is created

---

### Test 3.5.8: Create Ring - Character Count Indicator

**Test Description**: Validates that character count indicator works correctly and updates as user types.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_charcount_001` is registered and logged in

**Test Data**:
- User: `testuser_charcount_001`
- Ring Name: Type various lengths to test character count

**Test Steps**:
1. Ensure user is logged in as `testuser_charcount_001`
2. Navigate to Create Ring screen
3. Observe initial character count indicator (should show "0/100" or similar)
4. Type "A" - observe count updates to "1/100"
5. Type more characters - observe count updates
6. Type up to 100 characters - observe count shows "100/100"
7. Attempt to type beyond 100 characters (if allowed by input field)

**Expected Results**:
- Character count indicator displays current count out of 100
- Count updates in real-time as user types
- Count accurately reflects number of characters entered
- Input field may prevent typing beyond 100 characters (preferred) or allow but validation fails

**Assertions**:
- Character count indicator is accurate
- Updates occur in real-time
- Maximum length is enforced (either by input field or validation)

---

## Cleanup
- Test Rings created during positive tests can remain in database for integration testing
- For isolated test runs, test Rings should be deleted or test database should be reset
