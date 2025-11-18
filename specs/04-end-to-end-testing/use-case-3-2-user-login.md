# Use Case 3.2: User Login - End-to-End Tests

## Test Name: User Login - Positive Cases

### Test 3.2.1: Successful Login with Valid Credentials

**Test Description**: Validates that an existing registered user can successfully log in with correct username and password.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_login_001` and password `Test1234` exists in database
3. Navigate to Login screen

**Test Data**:
- Username: `testuser_login_001`
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Ensure "Login" tab/section is active
3. Enter username: `testuser_login_001`
4. Enter password: `Test1234`
5. Click "Login" button

**Expected Results**:
- Login is successful
- User is authenticated
- User is redirected to Home screen (News Feed)
- Authentication session is established (cookie/token is set)
- Footer navigation is visible with all five buttons
- News Feed is displayed (or empty state if user has no Rings)

**Assertions**:
- HTTP status code: 200
- Response contains user data and authentication token
- Session is established and valid
- User's last_login_at timestamp is updated in database
- User can access protected resources

---

### Test 3.2.2: Login and Verify Session Persistence

**Test Description**: Validates that user session persists after successful login and allows access to protected screens.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_session_001` and password `Test1234` exists in database

**Test Data**:
- Username: `testuser_session_001`
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Enter username: `testuser_session_001`
3. Enter password: `Test1234`
4. Click "Login" button
5. After redirect to Home screen, click "My Rings" button in footer
6. Click "Settings" button in footer
7. Click "Find Ring" button in footer
8. Click "Home" button in footer

**Expected Results**:
- Login is successful
- User can navigate to all protected screens without re-authentication
- All footer navigation buttons work correctly
- User remains authenticated throughout navigation

**Assertions**:
- Session cookie/token is present in all subsequent requests
- All protected API endpoints return 200 (not 401 Unauthorized)
- User can access all authenticated screens

---

## Test Name: User Login - Negative Cases

### Test 3.2.3: Login with Non-Existent Username

**Test Description**: Validates that login fails when username does not exist in database.

**Prerequisites/Setup**:
1. Application is running and accessible
2. Username `testuser_nonexistent_999` does not exist in database

**Test Data**:
- Username: `testuser_nonexistent_999` (does not exist)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Enter username: `testuser_nonexistent_999`
3. Enter password: `Test1234`
4. Click "Login" button

**Expected Results**:
- Login fails
- Error message is displayed: "Invalid username or password"
- User remains on Login screen
- User is not authenticated
- No authentication session is established

**Assertions**:
- HTTP status code: 401 (Unauthorized)
- Error message text matches exactly: "Invalid username or password"
- No authentication token/cookie is set
- User is not redirected to Home screen

---

### Test 3.2.4: Login with Incorrect Password

**Test Description**: Validates that login fails when password is incorrect for an existing username.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_wrongpass_001` and password `Test1234` exists in database

**Test Data**:
- Username: `testuser_wrongpass_001` (exists)
- Password: `WrongPass123` (incorrect password)

**Test Steps**:
1. Navigate to Login screen
2. Enter username: `testuser_wrongpass_001`
3. Enter password: `WrongPass123`
4. Click "Login" button

**Expected Results**:
- Login fails
- Error message is displayed: "Invalid username or password"
- User remains on Login screen
- User is not authenticated
- No authentication session is established

**Assertions**:
- HTTP status code: 401 (Unauthorized)
- Error message text matches exactly: "Invalid username or password"
- No authentication token/cookie is set
- User is not redirected to Home screen
- Note: Error message does not specify whether username or password is wrong (security best practice)

---

### Test 3.2.5: Login with Empty Username

**Test Description**: Validates that login fails when username field is empty.

**Prerequisites/Setup**:
1. Application is running and accessible

**Test Data**:
- Username: `` (empty)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Leave username field empty
3. Enter password: `Test1234`
4. Click "Login" button

**Expected Results**:
- Login fails
- Error message is displayed: "Invalid username or password"
- User remains on Login screen
- User is not authenticated

**Assertions**:
- HTTP status code: 401 (Unauthorized) or 400 (Bad Request)
- Error message text matches: "Invalid username or password" (or appropriate validation error)
- No authentication session is established

---

### Test 3.2.6: Login with Empty Password

**Test Description**: Validates that login fails when password field is empty.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_emptypass_001` exists in database

**Test Data**:
- Username: `testuser_emptypass_001`
- Password: `` (empty)

**Test Steps**:
1. Navigate to Login screen
2. Enter username: `testuser_emptypass_001`
3. Leave password field empty
4. Click "Login" button

**Expected Results**:
- Login fails
- Error message is displayed: "Invalid username or password"
- User remains on Login screen
- User is not authenticated

**Assertions**:
- HTTP status code: 401 (Unauthorized) or 400 (Bad Request)
- Error message text matches: "Invalid username or password" (or appropriate validation error)
- No authentication session is established

---

### Test 3.2.7: Login with Case-Sensitive Username

**Test Description**: Validates that login is case-sensitive for username (if applicable) or case-insensitive (depending on implementation).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_case_001` (lowercase) and password `Test1234` exists in database

**Test Data**:
- Username: `TESTUSER_CASE_001` (uppercase version)
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Enter username: `TESTUSER_CASE_001` (uppercase)
3. Enter password: `Test1234`
4. Click "Login" button

**Expected Results**:
- Behavior depends on implementation:
  - If usernames are case-sensitive: Login fails with "Invalid username or password"
  - If usernames are case-insensitive: Login succeeds
- Document actual behavior observed

**Assertions**:
- Verify whether username matching is case-sensitive or case-insensitive
- Document the actual behavior for reference

---

### Test 3.2.8: Login Attempt After Session Expiration

**Test Description**: Validates that user can log in again after previous session has expired.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User with username `testuser_expired_001` and password `Test1234` exists in database
3. Previous session for this user has expired (or simulate expiration)

**Test Data**:
- Username: `testuser_expired_001`
- Password: `Test1234`

**Test Steps**:
1. Navigate to Login screen
2. Enter username: `testuser_expired_001`
3. Enter password: `Test1234`
4. Click "Login" button

**Expected Results**:
- Login is successful
- New session is established
- User is redirected to Home screen
- Previous expired session does not interfere

**Assertions**:
- HTTP status code: 200
- New authentication token/cookie is set
- User can access protected resources with new session

---

## Cleanup
- Test users created for login tests can remain in database for integration testing
- For isolated test runs, test users should be deleted or test database should be reset
