# Test: Logout (3.14)

## Test Scenario Name
Logout - Positive and Negative Test Cases

## Description
This test validates the Logout use case (3.14) covering session termination, redirect to Login screen, and error handling.

## Prerequisites
- Application is running and accessible
- User `testuser_logout_001` is registered and logged in

## Test Case 1: Successful Logout

### Prerequisites
- User `testuser_logout_001` is logged in
- User is on Settings Screen or any authenticated screen

### Test Steps
1. Navigate to Settings Screen (4.8 Settings Screen)
2. Verify Settings Screen displays with Logout button
3. Click the Logout button
4. Verify confirmation dialog appears asking: "Are you sure you want to logout?" with "Cancel" and "Logout" options (as per 4.8 Settings Screen)
5. Click "Logout" option in the confirmation dialog
6. Verify user is redirected to Login Screen (3.14 Logout: "User is redirected to Login screen")
7. Verify session is terminated (user is logged out)
8. Verify authentication token is cleared from client storage
9. Attempt to navigate to an authenticated screen (e.g., Home Screen via direct URL)
10. Verify user is redirected back to Login Screen (session is invalid)

### Expected Results
- Logout succeeds
- Confirmation dialog appears
- User is redirected to Login Screen
- Session is terminated
- User cannot access authenticated screens after logout

## Test Case 2: Cancel Logout

### Prerequisites
- User `testuser_logout_002` is logged in
- User is on Settings Screen

### Test Steps
1. Navigate to Settings Screen
2. Click the Logout button
3. Verify confirmation dialog appears with "Cancel" and "Logout" options
4. Click "Cancel" option in the confirmation dialog
5. Verify confirmation dialog closes
6. Verify user remains on Settings Screen (not redirected)
7. Verify user is still logged in
8. Verify session is still active
9. Verify user can still access authenticated screens

### Expected Results
- Cancel button closes confirmation dialog
- User remains logged in
- User stays on Settings Screen
- Session remains active

## Test Case 3: Logout from Different Screens

### Prerequisites
- User `testuser_logout_003` is logged in

### Test Steps
1. Navigate to Home Screen
2. Navigate to Settings Screen
3. Click Logout button
4. Click "Logout" in confirmation dialog
5. Verify user is redirected to Login Screen
6. Login again as `testuser_logout_003`
7. Navigate to My Rings Screen
8. Navigate to Settings Screen
9. Click Logout button
10. Click "Logout" in confirmation dialog
11. Verify user is redirected to Login Screen
12. Verify logout works from any screen

### Expected Results
- Logout works from Settings Screen regardless of previous navigation
- User is always redirected to Login Screen after logout
- Logout is consistent across different navigation paths

## Test Case 4: Logout Error Handling

### Prerequisites
- User `testuser_logout_004` is logged in
- Simulate API failure for logout endpoint

### Test Steps
1. Navigate to Settings Screen
2. Click Logout button
3. Click "Logout" in confirmation dialog
4. Simulate API failure for logout request
5. Verify error message is displayed: "Unable to logout. Please try again." (3.14 Logout)
6. Verify user is still logged out on client side (authentication token cleared from client storage, as per 3.14: "user is still logged out on client side")
7. Verify user is redirected to Login Screen (even if API call fails)
8. Verify user cannot access authenticated screens

### Expected Results
- Error message is displayed when API request fails
- User is still logged out on client side
- User is redirected to Login Screen
- Error message matches specification

## Test Case 5: Logout and Session Invalidation

### Prerequisites
- User `testuser_logout_005` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Note current session state (user is authenticated)
3. Click Logout button
4. Click "Logout" in confirmation dialog
5. Verify user is redirected to Login Screen
6. Verify session is invalidated on server (3.14 Logout: "System invalidates the user's authentication token/session")
7. Attempt to use previous session token (if accessible) for API call
8. Verify API call is rejected (session is invalid)

### Expected Results
- Session is invalidated on server
- Previous session tokens are no longer valid
- User cannot use old session after logout

## Test Case 6: Logout and Clear Client Storage

### Prerequisites
- User `testuser_logout_006` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Verify user is authenticated (can access authenticated screens)
3. Click Logout button
4. Click "Logout" in confirmation dialog
5. Verify authentication token is cleared from client storage (3.14 Logout: "Frontend clears authentication token from client storage")
6. Verify user is redirected to Login Screen
7. Verify no authentication data remains in client storage
8. Attempt to access authenticated screen
9. Verify user is redirected to Login Screen

### Expected Results
- Authentication token is cleared from client storage
- No authentication data remains after logout
- User cannot access authenticated screens

## Test Case 7: Logout Confirmation Dialog UI

### Prerequisites
- User `testuser_logout_007` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Click Logout button
3. Verify confirmation dialog displays:
   - Message: "Are you sure you want to logout?" (as per 4.8 Settings Screen)
   - "Cancel" button
   - "Logout" button
4. Verify dialog is modal (blocks interaction with background)
5. Verify both buttons are clickable
6. Verify dialog can be closed by clicking Cancel

### Expected Results
- Confirmation dialog displays correctly
- Dialog is modal
- Both options are available and functional

## Test Case 8: Logout and Re-Login

### Prerequisites
- User `testuser_logout_008` is registered and logged in

### Test Steps
1. Navigate to Settings Screen
2. Click Logout button
3. Click "Logout" in confirmation dialog
4. Verify user is redirected to Login Screen
5. Enter username: `testuser_logout_008`
6. Enter password: (user's password)
7. Click Login button
8. Verify user can successfully login again (3.2 User Login)
9. Verify user is redirected to Home Screen
10. Verify new session is established

### Expected Results
- User can logout and login again
- New session is established after re-login
- User can access all features after re-login

## Test Case 9: Logout from Multiple Tabs

### Prerequisites
- User `testuser_logout_009` is logged in
- User has application open in multiple browser tabs

### Test Steps
1. Open application in two browser tabs
2. Verify user is logged in on both tabs
3. In Tab 1: Navigate to Settings Screen and click Logout
4. Click "Logout" in confirmation dialog
5. Verify Tab 1 is redirected to Login Screen
6. Verify Tab 2 behavior (implementation dependent - may be logged out or show error):
   - If session is shared: Tab 2 should also be logged out or redirected
   - If session is per-tab: Tab 2 may remain logged in
7. Document the actual behavior observed

### Expected Results
- Logout behavior is consistent across tabs (implementation dependent)
- Document the actual behavior observed

## Test Case 10: Logout and Browser Back Button

### Prerequisites
- User `testuser_logout_010` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Click Logout button
3. Click "Logout" in confirmation dialog
4. Verify user is redirected to Login Screen
5. Click browser back button
6. Verify user is redirected back to Login Screen (cannot go back to authenticated screens)
7. Verify authenticated screens are not accessible via browser history

### Expected Results
- Browser back button does not allow access to authenticated screens after logout
- User remains on Login Screen
- Session protection is maintained

## Test Case 11: Logout Without Confirmation (If Implemented)

### Prerequisites
- User `testuser_logout_011` is logged in
- Check if confirmation dialog can be bypassed (implementation dependent)

### Test Steps
1. Navigate to Settings Screen
2. Check if Logout button requires confirmation or logs out immediately
3. If confirmation is required: Verify confirmation dialog appears
4. If no confirmation: Verify logout happens immediately
5. Document the actual behavior observed

### Expected Results
- Behavior matches specification (confirmation dialog required, as per 4.8 Settings Screen)
- Document the actual behavior observed

## Test Case 12: Logout and Data Persistence

### Prerequisites
- User `testuser_logout_012` is logged in
- User has created Rings and posts

### Test Steps
1. Create a Ring and post a message (to have data)
2. Navigate to Settings Screen
3. Click Logout button
4. Click "Logout" in confirmation dialog
5. Verify user is redirected to Login Screen
6. Login again as the same user
7. Navigate to My Rings Screen
8. Verify previously created Ring still exists
9. Navigate to Home Screen
10. Verify previously created posts still exist in News Feed

### Expected Results
- User data persists after logout
- Rings and posts remain after logout and re-login
- Logout only affects session, not user data

## UI Elements Referenced

- **Settings Screen** (4.8): Logout button, confirmation dialog with "Cancel" and "Logout" options
- **Login Screen** (4.2): Referenced as redirect destination after logout

## Functional Requirements Referenced

- **3.14 Logout**: Complete logout use case with session termination, client storage clearing, and redirect to Login Screen
- **3.2 User Login**: Referenced for verifying re-login after logout
