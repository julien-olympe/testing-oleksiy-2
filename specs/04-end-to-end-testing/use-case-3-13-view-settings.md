# Use Case 3.13: View Settings - End-to-End Tests

## Test Name: View Settings - Positive Cases

### Test 3.13.1: View Settings Screen with Username

**Test Description**: Validates that authenticated user can view their account settings displaying username and logout button.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_settings_001` is registered and logged in

**Test Data**:
- User: `testuser_settings_001`
- Username: `testuser_settings_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_settings_001`
2. Navigate to Settings screen (click "Settings" in footer)
3. Observe Settings screen display

**Expected Results**:
- Settings screen displays:
  - Centered content area
  - User Information Section:
    - Username label and display showing: `testuser_settings_001`
    - Username is read-only (not editable)
  - Account Actions Section:
    - Logout button (prominent, styled as primary action)
  - Footer navigation is visible with all five buttons
  - Settings button is highlighted/active (indicating current screen)

**Assertions**:
- HTTP status code: 200
- User data is retrieved correctly
- Username is displayed accurately
- Settings screen layout is correct
- Footer navigation is accessible

---

### Test 3.13.2: View Settings - Navigate from Different Screens

**Test Description**: Validates that Settings screen can be accessed from any authenticated screen via footer navigation.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_settings_nav_001` is registered and logged in

**Test Data**:
- User: `testuser_settings_nav_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_settings_nav_001`
2. Navigate to Home screen
3. Click "Settings" in footer
4. Verify Settings screen is displayed
5. Navigate to My Rings screen
6. Click "Settings" in footer
7. Verify Settings screen is displayed
8. Navigate to Find Ring screen
9. Click "Settings" in footer
10. Verify Settings screen is displayed

**Expected Results**:
- Settings screen can be accessed from all authenticated screens
- Settings screen displays correctly from all navigation points
- Username is displayed correctly
- Footer navigation remains accessible

**Assertions**:
- HTTP status code: 200 (for each navigation)
- Settings screen is accessible from all screens
- Navigation works correctly
- User data is consistent

---

### Test 3.13.3: View Settings - Verify Username Accuracy

**Test Description**: Validates that displayed username matches the authenticated user's actual username.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_username_check_001` is registered and logged in
3. User's username in database is `testuser_username_check_001`

**Test Data**:
- User: `testuser_username_check_001`
- Expected Username: `testuser_username_check_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_username_check_001`
2. Navigate to Settings screen
3. Observe displayed username
4. Verify username matches authenticated user

**Expected Results**:
- Settings screen displays username: `testuser_username_check_001`
- Username matches the authenticated user's username
- Username is accurate and consistent

**Assertions**:
- HTTP status code: 200
- Username displayed matches authenticated user
- API returns correct user data
- Display is accurate

---

### Test 3.13.4: View Settings - Screen Persistence

**Test Description**: Validates that Settings screen persists and displays correctly when user navigates away and returns.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_settings_persist_001` is registered and logged in

**Test Data**:
- User: `testuser_settings_persist_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_settings_persist_001`
2. Navigate to Settings screen
3. Verify username is displayed
4. Navigate to Home screen
5. Navigate back to Settings screen
6. Verify Settings screen displays correctly again

**Expected Results**:
- Settings screen displays correctly on first visit
- After navigating away and returning, Settings screen displays correctly again
- Username is displayed consistently
- No data loss or display issues

**Assertions**:
- HTTP status code: 200 (for each visit)
- Settings screen displays correctly on multiple visits
- User data is retrieved correctly each time
- No caching issues affect display

---

## Test Name: View Settings - Error Cases

### Test 3.13.5: View Settings - API Error Handling

**Test Description**: Validates that Settings screen handles API errors gracefully.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_settings_error_001` is registered and logged in
3. Simulate API error (network failure, server error, etc.)

**Test Data**:
- User: `testuser_settings_error_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_settings_error_001`
2. Simulate API error condition
3. Navigate to Settings screen

**Expected Results**:
- Settings screen attempts to load
- Error message is displayed: "Unable to load settings. Please try again."
- User remains on Settings screen (or appropriate screen)
- Footer navigation is still accessible
- User can retry by refreshing or navigating away and back

**Assertions**:
- HTTP status code: 500 or network error
- Error message text matches exactly: "Unable to load settings. Please try again."
- Application does not crash
- User can recover from error state

---

### Test 3.13.6: View Settings - Unauthenticated Access

**Test Description**: Validates that Settings screen is not accessible without authentication.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User is not authenticated (logged out or no session)

**Test Data**:
- No authenticated user

**Test Steps**:
1. Ensure user is not authenticated (logout or clear session)
2. Attempt to navigate to Settings screen (via direct URL or API call)

**Expected Results**:
- Access is denied
- User is redirected to Login screen
- OR error message is displayed indicating authentication is required
- Settings screen is not accessible

**Assertions**:
- HTTP status code: 401 (Unauthorized)
- User is redirected to Login screen
- Settings screen is protected and requires authentication
- Note: This should not happen through normal UI navigation (footer is only visible when authenticated), but should be tested for security

---

## Cleanup
- Test users created for Settings tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
