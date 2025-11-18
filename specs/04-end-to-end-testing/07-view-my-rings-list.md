# Test: View My Rings List (3.6)

## Test Scenario Name
View My Rings List - Positive and Negative Test Cases

## Description
This test validates the View My Rings List use case (3.6) covering Ring list display, member counts, name ellipsization, and empty states.

## Prerequisites
- Application is running and accessible
- User `testuser_myrings_001` is registered and logged in
- Test data setup as needed for each test case

## Test Case 1: View My Rings with Multiple Rings

### Prerequisites
- User `testuser_myrings_001` is logged in
- User is a member of at least 3 different Rings

### Test Steps
1. Navigate to My Rings Screen by clicking "My Rings" button in footer navigation (4.4 My Rings Screen)
2. Verify My Rings Screen displays:
   - Search bar at the top with placeholder "Search my Rings..."
   - Rings list below the search bar
   - Footer navigation at the bottom
3. Wait for Rings list to load
4. Verify Rings list displays at least 3 Ring items
5. Verify each Ring item displays:
   - Ring name (ellipsized to 20 characters if longer, as per 3.6 View My Rings List)
   - Member count (e.g., "15 members")
   - Entire item is clickable (as per 4.4 My Rings Screen)
6. Verify Ring items are ordered alphabetically by name (as per 4.4 My Rings Screen)
7. Click on a Ring item
8. Verify user is navigated to the corresponding Ring Chat screen (4.5 Ring Chat Screen)

### Expected Results
- My Rings list displays correctly with all required elements
- Rings are ordered alphabetically
- Ring items are clickable and navigate to Ring Chat
- Member counts are displayed correctly

## Test Case 2: View Empty My Rings List

### Prerequisites
- User `testuser_myrings_002` is registered and logged in
- User is not a member of any Rings

### Test Steps
1. Navigate to My Rings Screen
2. Verify My Rings Screen displays with search bar and footer navigation
3. Wait for Rings list to load
4. Verify Rings list displays empty state message: "You haven't joined any Rings yet. Create or find a Ring to get started." (3.6 View My Rings List)
5. Verify no Ring items are displayed

### Expected Results
- Empty state message is displayed
- No Ring items are shown
- User can still navigate using footer buttons

## Test Case 3: Ring Name Ellipsization - Long Name

### Prerequisites
- User `testuser_myrings_003` is logged in
- User is a member of a Ring with name longer than 20 characters (e.g., `ThisIsAVeryLongRingNameThatExceedsTwentyCharacters`)

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Find the Ring item with the long name
4. Verify Ring name is ellipsized to 20 characters with ellipsis (...) (3.6 View My Rings List: "ellipsized to 20 characters if longer")
5. Verify full Ring name is shown on hover/tooltip (as per 4.4 My Rings Screen: "full name shown on hover/tooltip")
6. Click on the Ring item
7. Verify Ring Chat displays the full Ring name (not ellipsized)

### Expected Results
- Long Ring names are ellipsized to 20 characters in the list
- Full name is accessible via hover/tooltip
- Full name is displayed in Ring Chat

## Test Case 4: Ring Name - Short Name (No Ellipsization)

### Prerequisites
- User `testuser_myrings_004` is logged in
- User is a member of a Ring with name shorter than 20 characters (e.g., `ShortRing`)

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Find the Ring item with the short name
4. Verify Ring name is displayed in full (not ellipsized, as it's under 20 characters)
5. Verify no ellipsis is shown

### Expected Results
- Short Ring names are displayed in full
- No ellipsization is applied

## Test Case 5: Ring Name Exactly 20 Characters (Boundary)

### Prerequisites
- User `testuser_myrings_005` is logged in
- User is a member of a Ring with name exactly 20 characters (e.g., `RingNameExactly20Ch`)

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Find the Ring item with exactly 20-character name
4. Verify Ring name is displayed in full (20 characters, no ellipsis, as per 3.6: "ellipsized to 20 characters if longer" - 20 is not longer)

### Expected Results
- Ring name with exactly 20 characters is displayed in full
- No ellipsization is applied

## Test Case 6: Member Count Display - Single Member

### Prerequisites
- User `testuser_myrings_006` is logged in
- User is a member of a Ring with exactly 1 member (only the user)

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Find the Ring item with 1 member
4. Verify member count displays: "1 member" or "1 members" (implementation dependent, but should be grammatically correct)

### Expected Results
- Member count is displayed correctly for single member
- Text is grammatically correct

## Test Case 7: Member Count Display - Multiple Members

### Prerequisites
- User `testuser_myrings_007` is logged in
- User is a member of a Ring with multiple members (e.g., 5 members)

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Find the Ring item with multiple members
4. Verify member count displays: "5 members" (plural form)
5. Verify the count is accurate

### Expected Results
- Member count displays correctly for multiple members
- Plural form is used

## Test Case 8: Member Count Updates After Adding User

### Prerequisites
- User `testuser_myrings_008` is logged in
- User is a member of a Ring
- Ring has 2 members initially

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Note the member count for the Ring (e.g., "2 members")
4. Navigate to Ring Chat for that Ring
5. Add another user to the Ring (3.10 Add User to Ring)
6. Navigate back to My Rings Screen
7. Wait for list to refresh
8. Verify member count has updated (e.g., "3 members")

### Expected Results
- Member count updates after adding users
- Count reflects current membership

## Test Case 9: Alphabetical Ordering

### Prerequisites
- User `testuser_myrings_009` is logged in
- User is a member of Rings: `ZebraRing`, `AlphaRing`, `BetaRing`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Verify Rings are displayed in alphabetical order:
   - `AlphaRing` appears first
   - `BetaRing` appears second
   - `ZebraRing` appears third
4. Verify ordering is case-insensitive or case-sensitive (implementation dependent)

### Expected Results
- Rings are ordered alphabetically
- Ordering is consistent

## Test Case 10: Loading Indicator

### Prerequisites
- User `testuser_myrings_010` is logged in

### Test Steps
1. Navigate to My Rings Screen
2. Immediately check for loading indicator (as per 4.4 My Rings Screen: "Loading indicator while fetching data")
3. Wait for Rings list to load
4. Verify loading indicator disappears when Rings list is loaded

### Expected Results
- Loading indicator is displayed while fetching Rings list
- Loading indicator disappears when data is loaded

## Test Case 11: My Rings List Refresh

### Prerequisites
- User `testuser_myrings_011` is logged in
- User is a member of N Rings initially

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Count the number of Ring items displayed
4. Create a new Ring (3.5 Create Ring) or join a Ring (3.12 Join Ring)
5. Navigate back to My Rings Screen
6. Wait for list to refresh
7. Verify the new Ring appears in the list
8. Verify the total count has increased by 1

### Expected Results
- New Rings appear in My Rings list after creation or joining
- List updates to reflect current membership

## Test Case 12: Clickable Ring Item Area

### Prerequisites
- User `testuser_myrings_012` is logged in
- User is a member of at least one Ring

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Verify entire Ring item is clickable (not just the name, as per 4.4 My Rings Screen: "entire item is clickable")
4. Click on different areas of a Ring item (name area, member count area, empty space in item)
5. Verify all clicks navigate to Ring Chat

### Expected Results
- Entire Ring item area is clickable
- Navigation works from any part of the item

## UI Elements Referenced

- **My Rings Screen** (4.4): Search bar, Rings list, Ring items, footer navigation, loading indicator
- **Ring Chat Screen** (4.5): Referenced when clicking Ring items

## Functional Requirements Referenced

- **3.6 View My Rings List**: Complete My Rings list viewing use case with name ellipsization, member counts, and ordering
