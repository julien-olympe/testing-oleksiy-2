# Test: User Login (3.2)

## Test Scenario Name
User Login - Positive and Negative Test Cases

## Description
This test validates the User Login use case (3.2) covering successful login, invalid credentials, and edge cases.

## Prerequisites
- Application is running and accessible
- Test user with username `testuser_login_001` and password `password123` exists in database (created via registration)

## Test Case 1: Successful Login

### Prerequisites
- User with username `testuser_login_001` and password `password123` exists

### Test Steps
1. Navigate to Login Screen (4.2 Login Screen)
2. Verify Login Screen displays with "Login" and "Register" tabs/sections
3. Verify "Login" tab/section is active by default or click on "Login" tab/section
4. Verify Login Form displays:
   - Username input field (text, required)
   - Password input field (password type, required)
   - Login button
5. Enter username: `testuser_login_001`
6. Enter password: `password123`
7. Click Login button
8. Verify user is automatically redirected to Home Screen (3.2 User Login)
9. Verify authenticated session is established (user is logged in)
10. Verify Home Screen displays (4.3 Home Screen)
11. Verify footer navigation is visible with all five buttons

### Expected Results
- Login succeeds
- User is redirected to Home Screen
- User is authenticated and logged in
- No error messages are displayed

## Test Case 2: Invalid Username

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Enter username: `nonexistentuser`
4. Enter password: `password123`
5. Click Login button
6. Verify user remains on Login Screen (not redirected)
7. Verify error message is displayed: "Invalid username or password" (3.2 User Login)
8. Verify username and password fields are cleared or remain filled (implementation dependent)

### Expected Results
- Login fails
- Error message "Invalid username or password" is displayed
- User is not redirected
- User is not logged in

## Test Case 3: Invalid Password

### Prerequisites
- User with username `testuser_login_001` exists

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Enter username: `testuser_login_001`
4. Enter password: `wrongpassword`
5. Click Login button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Invalid username or password" (3.2 User Login)
8. Verify the error message does not specify which field is wrong (security best practice)

### Expected Results
- Login fails
- Generic error message "Invalid username or password" is displayed
- User is not redirected
- User is not logged in

## Test Case 4: Empty Username

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Leave username field empty
4. Enter password: `password123`
5. Click Login button
6. Verify user remains on Login Screen
7. Verify validation error is displayed (browser native validation or custom validation message indicating username is required)

### Expected Results
- Login fails
- Validation error is displayed
- User is not redirected

## Test Case 5: Empty Password

### Prerequisites
- User with username `testuser_login_001` exists

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Enter username: `testuser_login_001`
4. Leave password field empty
5. Click Login button
6. Verify user remains on Login Screen
7. Verify validation error is displayed (browser native validation or custom validation message indicating password is required)

### Expected Results
- Login fails
- Validation error is displayed
- User is not redirected

## Test Case 6: Both Fields Empty

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Leave both username and password fields empty
4. Click Login button
5. Verify user remains on Login Screen
6. Verify validation errors are displayed for both fields

### Expected Results
- Login fails
- Validation errors are displayed
- User is not redirected

## Test Case 7: Case-Sensitive Username

### Prerequisites
- User with username `testuser_login_001` exists (lowercase)

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Enter username: `TESTUSER_LOGIN_001` (uppercase)
4. Enter password: `password123`
5. Click Login button
6. Verify user remains on Login Screen OR is redirected (depending on implementation - username matching may be case-sensitive or case-insensitive)
7. If case-sensitive: Verify error message "Invalid username or password" is displayed
8. If case-insensitive: Verify user is redirected to Home Screen

### Expected Results
- Behavior depends on implementation (case-sensitive or case-insensitive username matching)
- Either login fails with error message OR login succeeds
- Document the actual behavior observed

## Test Case 8: Password Case Sensitivity

### Prerequisites
- User with username `testuser_login_001` and password `password123` exists

### Test Steps
1. Navigate to Login Screen
2. Verify "Login" tab/section is active
3. Enter username: `testuser_login_001`
4. Enter password: `PASSWORD123` (uppercase)
5. Click Login button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Invalid username or password" (passwords should be case-sensitive)

### Expected Results
- Login fails
- Error message "Invalid username or password" is displayed
- User is not redirected

## Test Case 9: Login After Registration

### Prerequisites
- No user with username `testuser_login_002` exists

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `testuser_login_002`
4. Enter password: `password456`
5. Click Register button
6. Verify user is redirected to Home Screen and logged in
7. Logout (navigate to Settings, click Logout)
8. Verify user is redirected to Login Screen
9. Click on "Login" tab/section
10. Enter username: `testuser_login_002`
11. Enter password: `password456`
12. Click Login button
13. Verify user is redirected to Home Screen
14. Verify user is logged in

### Expected Results
- Registration succeeds and user is logged in
- After logout, user can successfully login with the same credentials
- Login works correctly after registration

## Test Case 10: Multiple Failed Login Attempts

### Prerequisites
- User with username `testuser_login_001` exists

### Test Steps
1. Navigate to Login Screen
2. Enter username: `testuser_login_001`
3. Enter password: `wrongpassword1`
4. Click Login button
5. Verify error message "Invalid username or password" is displayed
6. Enter password: `wrongpassword2`
7. Click Login button
8. Verify error message "Invalid username or password" is displayed again
9. Enter password: `password123` (correct password)
10. Click Login button
11. Verify user is redirected to Home Screen
12. Verify user is logged in

### Expected Results
- Multiple failed login attempts show error messages
- Correct credentials still allow successful login after failed attempts
- No account lockout occurs (unless specified in security requirements)

## UI Elements Referenced

- **Login Screen** (4.2): Login form, username input field, password input field, Login button, error message display area, Login/Register tabs

## Functional Requirements Referenced

- **3.2 User Login**: Complete login use case with authentication and error handling
