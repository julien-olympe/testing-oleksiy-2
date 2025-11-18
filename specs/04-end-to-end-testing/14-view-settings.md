# Test: View Settings (3.13)

## Test Scenario Name
View Settings - Positive and Negative Test Cases

## Description
This test validates the View Settings use case (3.13) covering settings screen display, username display, and error handling.

## Prerequisites
- Application is running and accessible
- User `testuser_settings_001` is registered and logged in

## Test Case 1: Successful View Settings

### Prerequisites
- User `testuser_settings_001` is logged in
- User's username is `testuser_settings_001`

### Test Steps
1. Navigate to Settings Screen by clicking "Settings" button in footer navigation (4.8 Settings Screen)
2. Verify Settings Screen displays:
   - Centered content area
   - Footer navigation at the bottom
3. Verify User Information Section displays:
   - Username label and display (read-only, as per 4.8 Settings Screen)
   - Username: `testuser_settings_001` (matches logged-in user)
4. Verify Account Actions Section displays:
   - Logout button (prominent, styled as primary action, as per 4.8 Settings Screen)
5. Verify Settings button in footer is highlighted or shows active state (as per 4.9 Screen Relationships: "Current screen is indicated in footer")

### Expected Results
- Settings Screen displays correctly
- Username is displayed accurately
- Logout button is visible and accessible
- All UI elements are present

## Test Case 2: Username Display Accuracy

### Prerequisites
- User `testuser_settings_002` is registered and logged in
- User's username is `testuser_settings_002`

### Test Steps
1. Navigate to Settings Screen
2. Verify username displayed matches the logged-in user's username exactly
3. Verify username is displayed in read-only format (cannot be edited)
4. Verify username label is present (e.g., "Username:" or similar)

### Expected Results
- Username is displayed accurately
- Username matches logged-in user
- Username is read-only

## Test Case 3: Settings Screen Layout

### Prerequisites
- User `testuser_settings_003` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Verify layout structure:
   - Centered content area (as per 4.8 Settings Screen)
   - User Information Section at top
   - Account Actions Section below
   - Footer navigation at bottom (fixed)
3. Verify footer navigation contains all five buttons: Home, My Rings, Find Ring, Create Ring, Settings
4. Verify Settings button is in active/selected state

### Expected Results
- Layout matches specification
- All sections are displayed correctly
- Footer navigation is present and functional

## Test Case 4: Settings Screen Error Handling

### Prerequisites
- User `testuser_settings_004` is logged in
- Simulate API failure for settings endpoint

### Test Steps
1. Navigate to Settings Screen
2. Simulate API failure for retrieving user settings
3. Verify error message is displayed: "Unable to load settings. Please try again." (3.13 View Settings)
4. Verify user can retry loading settings (refresh page or retry button if available)
5. Verify Settings Screen still displays (even if with error message)

### Expected Results
- Error message is displayed when API request fails
- Error message matches specification exactly
- User can retry the operation

## Test Case 5: Settings Screen Navigation

### Prerequisites
- User `testuser_settings_005` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Verify footer navigation buttons are clickable
3. Click "Home" button
4. Verify user is navigated to Home Screen
5. Navigate back to Settings Screen
6. Click "My Rings" button
7. Verify user is navigated to My Rings Screen
8. Navigate back to Settings Screen
9. Verify all footer navigation buttons work correctly

### Expected Results
- Footer navigation works from Settings Screen
- All navigation buttons function correctly
- User can navigate to other screens

## Test Case 6: Settings Screen Persistence

### Prerequisites
- User `testuser_settings_006` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Verify username is displayed
3. Navigate to another screen (e.g., Home)
4. Navigate back to Settings Screen
5. Verify username is still displayed correctly
6. Verify Settings Screen state is maintained or reloaded correctly

### Expected Results
- Settings Screen displays correctly after navigation
- Username persists across navigation
- Screen state is maintained

## Test Case 7: Settings Screen with Different Usernames

### Prerequisites
- Multiple users with different usernames exist
- User `testuser_settings_007` is logged in
- User `testuser_settings_007` has username: `testuser_settings_007`

### Test Steps
1. Login as `testuser_settings_007`
2. Navigate to Settings Screen
3. Verify username displayed: `testuser_settings_007`
4. Logout
5. Login as a different user (e.g., `testuser_settings_008`)
6. Navigate to Settings Screen
7. Verify username displayed matches the new logged-in user
8. Verify username is different from previous user

### Expected Results
- Each user sees their own username in Settings
- Username changes when different user logs in
- Settings are user-specific

## Test Case 8: Settings Screen Accessibility

### Prerequisites
- User `testuser_settings_009` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Verify all UI elements are accessible:
   - Username is readable
   - Logout button is clickable
   - Footer navigation buttons are clickable
3. Verify screen is responsive (test on different viewport sizes if possible)
4. Verify text is readable and properly formatted

### Expected Results
- All UI elements are accessible
- Screen is responsive
- Text is readable

## Test Case 9: Settings Screen Loading State

### Prerequisites
- User `testuser_settings_010` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Immediately check for loading indicator (if implemented)
3. Wait for Settings Screen to load
4. Verify loading indicator disappears when data is loaded
5. Verify username is displayed after loading

### Expected Results
- Loading state is handled appropriately
- Username displays after loading completes
- No errors during loading

## Test Case 10: Settings Screen After Session Refresh

### Prerequisites
- User `testuser_settings_011` is logged in

### Test Steps
1. Navigate to Settings Screen
2. Verify username is displayed
3. Refresh the page (F5 or browser refresh)
4. Verify user remains logged in (session persists)
5. Verify Settings Screen loads correctly
6. Verify username is still displayed correctly

### Expected Results
- Settings Screen loads correctly after page refresh
- Session persists across page refresh
- Username is displayed correctly

## UI Elements Referenced

- **Settings Screen** (4.8): Centered content area, User Information Section with username label and display, Account Actions Section with Logout button, footer navigation

## Functional Requirements Referenced

- **3.13 View Settings**: Complete settings viewing use case with username display and error handling
