# Use Case 3.14: Logout - End-to-End Tests

## Test Name: Logout - Positive Cases

### Test 3.14.1: Successful Logout

**Test Description**: Validates that authenticated user can successfully log out, ending their session and being redirected to Login screen.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_logout_001` is registered and logged in
3. User has an active session

**Test Data**:
- User: `testuser_logout_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_logout_001`
2. Navigate to Settings screen
3. Observe Logout button
4. Click "Logout" button
5. If confirmation dialog appears, confirm logout

**Expected Results**:
- Settings screen displays Logout button
- When Logout is clicked:
  - Confirmation dialog appears asking "Are you sure you want to logout?" with "Cancel" and "Logout" options
  - OR logout happens immediately (depending on implementation)
- After confirming logout:
  - Logout is successful
  - User's session is terminated
  - Authentication token/cookie is cleared
  - User is redirected to Login screen
  - Footer navigation is no longer visible (user is not authenticated)
  - User must log in again to access protected resources

**Assertions**:
- HTTP status code: 200
- Session is invalidated on server
- Authentication token/cookie is cleared on client
- User is redirected to Login screen
- User cannot access protected resources without re-authentication

---

### Test 3.14.2: Logout and Verify Session Termination

**Test Description**: Validates that after logout, user's session is completely terminated and protected resources are inaccessible.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_logout_session_001` is registered and logged in
3. User has an active session

**Test Data**:
- User: `testuser_logout_session_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_logout_session_001`
2. Navigate to Home screen and verify access
3. Navigate to Settings screen
4. Click "Logout" button and confirm
5. After redirect to Login screen, attempt to access protected resources:
   - Try to navigate to Home screen (via direct URL or API call)
   - Try to access My Rings (via direct URL or API call)
   - Try to access Settings (via direct URL or API call)

**Expected Results**:
- Before logout: User can access all protected screens
- After logout:
  - User is redirected to Login screen
  - Attempts to access protected resources result in:
    - Redirect to Login screen
    - OR 401 Unauthorized response
  - User cannot access any protected screens without re-authentication
  - Session is completely terminated

**Assertions**:
- HTTP status code: 401 (Unauthorized) for protected resource access attempts
- Session is invalidated
- Protected resources are inaccessible
- User must authenticate again to access platform

---

### Test 3.14.3: Logout from Different Screens

**Test Description**: Validates that logout works from Settings screen regardless of how user navigated there.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_logout_nav_001` is registered and logged in

**Test Data**:
- User: `testuser_logout_nav_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_logout_nav_001`
2. Navigate to Home screen
3. Navigate to Settings screen
4. Click "Logout" button and confirm
5. Verify logout is successful
6. Log in again
7. Navigate to My Rings screen
8. Navigate to Settings screen
9. Click "Logout" button and confirm
10. Verify logout is successful

**Expected Results**:
- Logout works from Settings screen regardless of navigation path
- Session is terminated correctly in all cases
- User is redirected to Login screen
- Logout functionality is consistent

**Assertions**:
- HTTP status code: 200 (for logout)
- Logout works from Settings screen regardless of how user arrived there
- Session termination is consistent
- User is redirected to Login screen

---

### Test 3.14.4: Logout Confirmation Dialog

**Test Description**: Validates that logout confirmation dialog works correctly (if implemented).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_logout_confirm_001` is registered and logged in

**Test Data**:
- User: `testuser_logout_confirm_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_logout_confirm_001`
2. Navigate to Settings screen
3. Click "Logout" button
4. Observe confirmation dialog
5. Click "Cancel" button in dialog
6. Verify user remains logged in
7. Click "Logout" button again
8. Click "Logout" button in confirmation dialog (confirm)
9. Verify logout is successful

**Expected Results**:
- When Logout is clicked, confirmation dialog appears:
  - Message: "Are you sure you want to logout?"
  - "Cancel" button
  - "Logout" button (confirm)
- If "Cancel" is clicked:
  - Dialog closes
  - User remains logged in
  - User remains on Settings screen
- If "Logout" (confirm) is clicked:
  - User is logged out
  - User is redirected to Login screen

**Assertions**:
- Confirmation dialog appears when Logout is clicked
- Cancel prevents logout
- Confirming logout successfully logs user out
- Dialog works as expected

---

## Test Name: Logout - Error Cases

### Test 3.14.5: Logout - API Error Handling

**Test Description**: Validates that logout handles API errors gracefully.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_logout_error_001` is registered and logged in
3. Simulate API error (network failure, server error, etc.)

**Test Data**:
- User: `testuser_logout_error_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_logout_error_001`
2. Navigate to Settings screen
3. Simulate API error condition
4. Click "Logout" button and confirm

**Expected Results**:
- Logout attempt fails due to API error
- Error message is displayed: "Unable to logout. Please try again."
- User is still logged out on client side (session cleared locally)
- OR user remains logged in if error prevents logout
- User can retry logout

**Assertions**:
- HTTP status code: 500 or network error
- Error message text matches exactly: "Unable to logout. Please try again."
- Application handles error gracefully
- Note: Per specification, user is still logged out on client side even if API request fails

---

### Test 3.14.6: Logout - Verify Session Cleanup

**Test Description**: Validates that logout properly cleans up session data on both client and server.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_logout_cleanup_001` is registered and logged in
3. User has an active session with session data

**Test Data**:
- User: `testuser_logout_cleanup_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_logout_cleanup_001`
2. Verify session exists (check authentication token/cookie)
3. Navigate to Settings screen
4. Click "Logout" button and confirm
5. Verify session cleanup:
   - Check that authentication token/cookie is cleared
   - Verify server-side session is invalidated
   - Attempt to use old session token (should fail)

**Expected Results**:
- Before logout: Session token/cookie exists and is valid
- After logout:
  - Authentication token/cookie is cleared from client
  - Server-side session is invalidated
  - Attempts to use old session token return 401 Unauthorized
  - Session data is completely removed

**Assertions**:
- HTTP status code: 401 (for attempts with old token)
- Client-side session is cleared
- Server-side session is invalidated
- Old session tokens cannot be used
- Session cleanup is complete

---

## Cleanup
- Test users created for Logout tests can remain in database for integration testing
- Sessions are automatically cleaned up after logout
- For isolated test runs, test data should be cleaned up or test database should be reset
