# Use Case 3.1: User Registration - End-to-End Tests

## Test Name: User Registration - Positive Cases

### Test 3.1.1: Successful Registration with Valid Credentials

**Test Description**: Validates that a new user can successfully register with valid username and password, and is automatically logged in.

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique
3. Navigate to Login screen

**Test Data**:
- Username: `testuser_new_001`
- Password: `Test1234` (meets requirements: 8+ chars, contains letter and number)

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_new_001`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration is successful
- User is automatically logged in
- User is redirected to Home screen (News Feed)
- Authentication session is established (cookie/token is set)
- Footer navigation is visible with all five buttons
- Empty state message is displayed: "No posts yet. Join or create a Ring to see posts here."

**Assertions**:
- HTTP status code: 200 or 201
- Response contains user data and authentication token
- User record is created in database with correct username
- Password is hashed (not stored in plain text)
- Session is established and valid

---

### Test 3.1.2: Registration with Minimum Valid Username Length

**Test Description**: Validates that registration works with minimum valid username length (3 characters).

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `abc` (exactly 3 characters, minimum valid length)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `abc`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration is successful
- User is automatically logged in
- User is redirected to Home screen

**Assertions**:
- HTTP status code: 200 or 201
- User record is created with username `abc`

---

### Test 3.1.3: Registration with Maximum Valid Username Length

**Test Description**: Validates that registration works with maximum valid username length (50 characters).

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `abcdefghijklmnopqrstuvwxyz1234567890ABCDEF` (exactly 50 characters)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `abcdefghijklmnopqrstuvwxyz1234567890ABCDEF`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration is successful
- User is automatically logged in
- User is redirected to Home screen

**Assertions**:
- HTTP status code: 200 or 201
- User record is created with the 50-character username

---

### Test 3.1.4: Registration with Username Containing Underscores

**Test Description**: Validates that registration works with username containing underscores (allowed characters).

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `test_user_001`
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `test_user_001`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration is successful
- User is automatically logged in
- User is redirected to Home screen

**Assertions**:
- HTTP status code: 200 or 201
- User record is created with username containing underscores

---

### Test 3.1.5: Registration with Minimum Valid Password Length

**Test Description**: Validates that registration works with minimum valid password length (8 characters with letter and number).

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `testuser_minpass_001`
- Password: `Test1234` (exactly 8 characters, contains letter and number)

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_minpass_001`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration is successful
- User is automatically logged in
- User is redirected to Home screen

**Assertions**:
- HTTP status code: 200 or 201
- User record is created with password properly hashed

---

## Test Name: User Registration - Negative Cases

### Test 3.1.6: Registration with Duplicate Username

**Test Description**: Validates that registration fails when username already exists.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_duplicate_001` already exists in database

**Test Data**:
- Username: `testuser_duplicate_001` (already exists)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_duplicate_001`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Username already exists"
- User remains on Login/Register screen
- User is not logged in
- No new user record is created

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Username already exists"
- User is not redirected to Home screen
- No authentication session is established

---

### Test 3.1.7: Registration with Username Too Short

**Test Description**: Validates that registration fails when username is less than 3 characters.

**Prerequisites/Setup**:
1. Application is running and accessible

**Test Data**:
- Username: `ab` (2 characters, below minimum)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `ab`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- User remains on Login/Register screen
- User is not logged in

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- No user record is created

---

### Test 3.1.8: Registration with Username Too Long

**Test Description**: Validates that registration fails when username exceeds 50 characters.

**Prerequisites/Setup**:
1. Application is running and accessible

**Test Data**:
- Username: `abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG` (51 characters, exceeds maximum)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- User remains on Login/Register screen

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- No user record is created

---

### Test 3.1.9: Registration with Username Containing Invalid Characters

**Test Description**: Validates that registration fails when username contains invalid characters (not alphanumeric or underscore).

**Prerequisites/Setup**:
1. Application is running and accessible

**Test Data**:
- Username: `test-user-001` (contains hyphen, invalid character)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `test-user-001`
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- User remains on Login/Register screen

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- No user record is created

**Additional Test Cases for Invalid Characters**:
- Username with spaces: `test user 001` → Should fail with same error
- Username with special characters: `test@user#001` → Should fail with same error
- Username with unicode characters: `test用户001` → Should fail with same error

---

### Test 3.1.10: Registration with Password Too Short

**Test Description**: Validates that registration fails when password is less than 8 characters.

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `testuser_shortpass_001`
- Password: `Test123` (7 characters, below minimum)

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_shortpass_001`
4. Enter password: `Test123`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number"
- User remains on Login/Register screen
- User is not logged in

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Password must be at least 8 characters and contain at least one letter and one number"
- No user record is created

---

### Test 3.1.11: Registration with Password Missing Letter

**Test Description**: Validates that registration fails when password contains only numbers (no letters).

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `testuser_noletters_001`
- Password: `12345678` (8+ characters, numbers only, no letters)

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_noletters_001`
4. Enter password: `12345678`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number"
- User remains on Login/Register screen

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Password must be at least 8 characters and contain at least one letter and one number"
- No user record is created

---

### Test 3.1.12: Registration with Password Missing Number

**Test Description**: Validates that registration fails when password contains only letters (no numbers).

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `testuser_nonumbers_001`
- Password: `TestPassword` (8+ characters, letters only, no numbers)

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_nonumbers_001`
4. Enter password: `TestPassword`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number"
- User remains on Login/Register screen

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Password must be at least 8 characters and contain at least one letter and one number"
- No user record is created

---

### Test 3.1.13: Registration with Empty Username

**Test Description**: Validates that registration fails when username is empty.

**Prerequisites/Setup**:
1. Application is running and accessible

**Test Data**:
- Username: `` (empty)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Leave username field empty
4. Enter password: `Test1234`
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- User remains on Login/Register screen

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Username must be 3-50 characters and contain only letters, numbers, and underscores"
- No user record is created

---

### Test 3.1.14: Registration with Empty Password

**Test Description**: Validates that registration fails when password is empty.

**Prerequisites/Setup**:
1. Application is running and accessible
2. Database is clean or username is guaranteed to be unique

**Test Data**:
- Username: `testuser_emptypass_001`
- Password: `` (empty)

**Test Steps**:
1. Navigate to Login screen
2. Click on "Register" tab or section
3. Enter username: `testuser_emptypass_001`
4. Leave password field empty
5. Click "Register" button

**Expected Results**:
- Registration fails
- Error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number"
- User remains on Login/Register screen

**Assertions**:
- HTTP status code: 400 (Bad Request)
- Error message text matches exactly: "Password must be at least 8 characters and contain at least one letter and one number"
- No user record is created

---

## Cleanup
- Test users created during positive tests can remain in database for integration testing
- For isolated test runs, test users should be deleted or test database should be reset
