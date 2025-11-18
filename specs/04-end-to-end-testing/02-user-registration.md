# Test: User Registration (3.1)

## Test Scenario Name
User Registration - Positive and Negative Test Cases

## Description
This test validates the User Registration use case (3.1) covering successful registration, validation errors, and edge cases.

## Prerequisites
- Application is running and accessible
- Database is clean or test data is isolated
- Login Screen is accessible

## Test Case 1: Successful Registration

### Prerequisites
- No user with username `testuser_reg_001` exists

### Test Steps
1. Navigate to Login Screen (4.2 Login Screen)
2. Verify Login Screen displays with "Login" and "Register" tabs/sections
3. Click on "Register" tab/section
4. Verify Registration Form displays:
   - Username input field (text, required)
   - Password input field (password type, required)
   - Register button
5. Enter username: `testuser_reg_001` (valid: 9 characters, alphanumeric)
6. Enter password: `password123` (valid: 12 characters, contains letters and numbers)
7. Click Register button
8. Verify user is automatically redirected to Home Screen (3.1 User Registration)
9. Verify authenticated session is established (user is logged in)
10. Verify Home Screen displays (4.3 Home Screen)
11. Verify footer navigation is visible with all five buttons

### Expected Results
- Registration succeeds
- User is redirected to Home Screen
- User is automatically logged in
- No error messages are displayed

## Test Case 2: Username Already Exists

### Prerequisites
- User with username `existinguser` already exists in database

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `existinguser`
4. Enter password: `password123`
5. Click Register button
6. Verify user remains on Login Screen (not redirected)
7. Verify error message is displayed: "Username already exists" (3.1 User Registration)

### Expected Results
- Registration fails
- Error message "Username already exists" is displayed
- User is not redirected
- User is not logged in

## Test Case 3: Username Too Short

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `ab` (2 characters, below minimum of 3)
4. Enter password: `password123`
5. Click Register button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores" (3.1 User Registration)

### Expected Results
- Registration fails
- Validation error message is displayed
- User is not redirected
- User is not logged in

## Test Case 4: Username Too Long

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `a`.repeat(51) (51 characters, exceeds maximum of 50)
4. Enter password: `password123`
5. Click Register button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

### Expected Results
- Registration fails
- Validation error message is displayed
- User is not redirected

## Test Case 5: Username Contains Invalid Characters

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `test-user!` (contains hyphen and exclamation mark, invalid characters)
4. Enter password: `password123`
5. Click Register button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Username must be 3-50 characters and contain only letters, numbers, and underscores"

### Expected Results
- Registration fails
- Validation error message is displayed
- User is not redirected

## Test Case 6: Username Exactly 3 Characters (Boundary)

### Prerequisites
- No user with username `abc` exists

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `abc` (exactly 3 characters, minimum valid)
4. Enter password: `password123`
5. Click Register button
6. Verify user is automatically redirected to Home Screen
7. Verify user is logged in

### Expected Results
- Registration succeeds
- User is redirected to Home Screen
- User is logged in

## Test Case 7: Username Exactly 50 Characters (Boundary)

### Prerequisites
- No user with username `a`.repeat(50) exists

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `a`.repeat(50) (exactly 50 characters, maximum valid)
4. Enter password: `password123`
5. Click Register button
6. Verify user is automatically redirected to Home Screen
7. Verify user is logged in

### Expected Results
- Registration succeeds
- User is redirected to Home Screen
- User is logged in

## Test Case 8: Password Too Short

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `testuser_reg_002`
4. Enter password: `pass123` (7 characters, below minimum of 8)
5. Click Register button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number" (3.1 User Registration)

### Expected Results
- Registration fails
- Validation error message is displayed
- User is not redirected

## Test Case 9: Password Without Letters

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `testuser_reg_003`
4. Enter password: `12345678` (8+ characters, but no letters)
5. Click Register button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number"

### Expected Results
- Registration fails
- Validation error message is displayed
- User is not redirected

## Test Case 10: Password Without Numbers

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `testuser_reg_004`
4. Enter password: `password` (8+ characters, but no numbers)
5. Click Register button
6. Verify user remains on Login Screen
7. Verify error message is displayed: "Password must be at least 8 characters and contain at least one letter and one number"

### Expected Results
- Registration fails
- Validation error message is displayed
- User is not redirected

## Test Case 11: Password Exactly 8 Characters with Letter and Number (Boundary)

### Prerequisites
- No user with username `testuser_reg_005` exists

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `testuser_reg_005`
4. Enter password: `pass1234` (exactly 8 characters, contains letters and numbers)
5. Click Register button
6. Verify user is automatically redirected to Home Screen
7. Verify user is logged in

### Expected Results
- Registration succeeds
- User is redirected to Home Screen
- User is logged in

## Test Case 12: Empty Username

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Leave username field empty
4. Enter password: `password123`
5. Click Register button
6. Verify user remains on Login Screen
7. Verify validation error is displayed (browser native validation or custom validation message)

### Expected Results
- Registration fails
- Validation error is displayed
- User is not redirected

## Test Case 13: Empty Password

### Test Steps
1. Navigate to Login Screen
2. Click on "Register" tab/section
3. Enter username: `testuser_reg_006`
4. Leave password field empty
5. Click Register button
6. Verify user remains on Login Screen
7. Verify validation error is displayed

### Expected Results
- Registration fails
- Validation error is displayed
- User is not redirected

## UI Elements Referenced

- **Login Screen** (4.2): Registration form, username input field, password input field, Register button, error message display area

## Functional Requirements Referenced

- **3.1 User Registration**: Complete registration use case with all validation rules and error messages
