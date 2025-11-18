# Test: Find Ring (Search) (3.11)

## Test Scenario Name
Find Ring (Search) - Positive and Negative Test Cases

## Description
This test validates the Find Ring (Search) use case (3.11) covering Ring discovery by name search, membership status display, and search results.

## Prerequisites
- Application is running and accessible
- User `testuser_find_001` is registered and logged in
- Test Rings exist in database with various names
- Test data setup as needed for each test case

## Test Case 1: Successful Search - Single Match

### Prerequisites
- User `testuser_find_001` is logged in
- Ring named `TestRingFind001` exists in database
- User is NOT a member of `TestRingFind001`

### Test Steps
1. Navigate to Find Ring Screen by clicking "Find Ring" button in footer navigation (4.6 Find Ring Screen)
2. Verify Find Ring Screen displays:
   - Search bar at the top with placeholder "Search for Rings..."
   - Search results list below the search bar
   - Footer navigation at the bottom
3. Locate the search bar
4. Type search query: `TestRingFind001` in the search bar
5. Press Enter or click search button (if present)
6. Wait for search results to load
7. Verify Search Results List displays at least one Ring item
8. Verify the Ring item displays:
   - Ring name: `TestRingFind001`
   - Member count (e.g., "5 members")
   - "Join" button (user is not a member, as per 4.6 Find Ring Screen: "Join button (only shown if user is not a member)")
9. Verify "Join" button is clickable

### Expected Results
- Search returns matching Ring
- Ring information is displayed correctly
- Join button is shown for non-member Rings
- Search works correctly

## Test Case 2: Successful Search - Multiple Matches

### Prerequisites
- User `testuser_find_002` is logged in
- Rings named `TechRing`, `TechNews`, `TechForum` exist
- User is NOT a member of these Rings

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `Tech` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify Search Results List displays multiple Ring items (at least 3)
6. Verify all displayed Rings have names containing "Tech"
7. Verify each Ring item displays:
   - Ring name
   - Member count
   - "Join" button (user is not a member)
8. Verify results are ordered alphabetically by name (as per 4.6 Find Ring Screen)

### Expected Results
- Search returns all matching Rings
- All results match the search query
- Join buttons are shown for all non-member Rings
- Results are ordered alphabetically

## Test Case 3: Case-Insensitive Search

### Prerequisites
- User `testuser_find_003` is logged in
- Ring named `TestRingCase` exists
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `testring` (lowercase) in the search bar
3. Press Enter or click search button
4. Verify Search Results List displays `TestRingCase` (case-insensitive matching, as per 3.11 Find Ring)
5. Clear search and type: `TESTRING` (uppercase)
6. Press Enter or click search button
7. Verify Search Results List displays `TestRingCase`
8. Clear search and type: `TestRing` (mixed case)
9. Press Enter or click search button
10. Verify Search Results List displays `TestRingCase`

### Expected Results
- Search is case-insensitive
- All case variations match the Ring name

## Test Case 4: Partial Match Search

### Prerequisites
- User `testuser_find_004` is logged in
- Ring named `AlphaBetaGamma` exists
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `Alpha` in the search bar
3. Press Enter or click search button
4. Verify Search Results List displays `AlphaBetaGamma` (partial matching from beginning)
5. Clear search and type: `Beta` in the search bar
6. Press Enter or click search button
7. Verify Search Results List displays `AlphaBetaGamma` (partial matching in middle)
8. Clear search and type: `Gamma` in the search bar
9. Press Enter or click search button
10. Verify Search Results List displays `AlphaBetaGamma` (partial matching at end)

### Expected Results
- Partial matching works at any position in Ring name
- All partial matches return results

## Test Case 5: No Results

### Prerequisites
- User `testuser_find_005` is logged in
- No Ring name contains "NonExistentRing123"

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `NonExistentRing123` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify Search Results List displays: "No Rings found matching 'NonExistentRing123'" (3.11 Find Ring)
6. Verify no Ring items are displayed

### Expected Results
- No results message is displayed when no Rings match
- Message includes the search query

## Test Case 6: Empty Search Query

### Prerequisites
- User `testuser_find_006` is logged in

### Test Steps
1. Navigate to Find Ring Screen
2. Leave search bar empty
3. Press Enter or click search button (if enabled)
4. Verify error message is displayed: "Please enter a search query." (3.11 Find Ring)
5. Verify no search results are displayed
6. Verify empty state message is shown (as per 4.6 Find Ring Screen: "Empty state message when no search has been performed")

### Expected Results
- Empty search query is rejected
- Error message is displayed
- No results are shown

## Test Case 7: Search Query Too Short

### Prerequisites
- User `testuser_find_007` is logged in

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `A` (1 character, but minimum is 1 character per 3.11, so this should work)
3. Press Enter or click search button
4. Verify search is performed (minimum 1 character is required, as per 3.11 Find Ring)
5. If minimum is actually more than 1 character, verify error for too short query

### Expected Results
- Behavior depends on implementation (minimum character requirement)
- Document the actual behavior observed

## Test Case 8: Ring Already a Member - No Join Button

### Prerequisites
- User `testuser_find_008` is logged in
- User is a member of Ring named `MemberRing`
- Ring `MemberRing` exists

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `MemberRing` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify Search Results List displays `MemberRing`
6. Verify the Ring item displays:
   - Ring name: `MemberRing`
   - Member count
   - Status indicator or no button (as per 4.6 Find Ring Screen: "Status indicator or no button (if user is already a member, shows 'Member' or similar)")
   - NO "Join" button is displayed
7. Verify membership status is clearly indicated

### Expected Results
- Rings user is already a member of are shown in results
- Join button is NOT displayed for member Rings
- Membership status is indicated

## Test Case 9: Mixed Results - Member and Non-Member Rings

### Prerequisites
- User `testuser_find_009` is logged in
- User is a member of Ring named `TechRingMember`
- User is NOT a member of Ring named `TechRingNonMember`
- Both Rings exist

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `TechRing` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify Search Results List displays both Rings
6. Verify `TechRingMember` shows status indicator (no Join button)
7. Verify `TechRingNonMember` shows "Join" button
8. Verify both Rings display correctly with their respective membership statuses

### Expected Results
- Search returns both member and non-member Rings
- Membership status is correctly indicated for each Ring
- Join buttons appear only for non-member Rings

## Test Case 10: Loading Indicator

### Prerequisites
- User `testuser_find_010` is logged in

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query in the search bar
3. Immediately check for loading indicator (as per 4.6 Find Ring Screen: "Loading indicator while fetching search results")
4. Press Enter or click search button
5. Wait for search results to load
6. Verify loading indicator disappears when results are loaded

### Expected Results
- Loading indicator is displayed while fetching results
- Loading indicator disappears when data is loaded

## Test Case 11: Clear Search

### Prerequisites
- User `testuser_find_011` is logged in

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query in the search bar
3. Press Enter or click search button
4. Verify search results are displayed
5. Click the Clear button (X) that appears when text is entered (as per 4.6 Find Ring Screen)
6. Verify search query is cleared
7. Verify search results are cleared or empty state is shown

### Expected Results
- Clear button clears the search query
- Search results are cleared
- Empty state is shown

## Test Case 12: Search Results Ordering

### Prerequisites
- User `testuser_find_012` is logged in
- Rings named `AlphaRing`, `BetaRing`, `GammaRing` exist
- User is NOT a member of these Rings

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `Ring` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify all three Rings are displayed
6. Verify Rings are ordered alphabetically:
   - `AlphaRing` appears first
   - `BetaRing` appears second
   - `GammaRing` appears third
7. Verify ordering is consistent (as per 4.6 Find Ring Screen: "Results are ordered alphabetically by name")

### Expected Results
- Search results are ordered alphabetically
- Ordering is consistent

## Test Case 13: Member Count Display in Search Results

### Prerequisites
- User `testuser_find_013` is logged in
- Ring named `TestRingCount` exists with 10 members
- User is NOT a member of the Ring

### Test Steps
1. Navigate to Find Ring Screen
2. Type search query: `TestRingCount` in the search bar
3. Press Enter or click search button
4. Wait for search results to load
5. Verify the Ring item displays member count: "10 members"
6. Verify member count is accurate

### Expected Results
- Member count is displayed in search results
- Count is accurate

## UI Elements Referenced

- **Find Ring Screen** (4.6): Search bar with placeholder "Search for Rings...", Clear button (X), Search Results List, Ring items with Join button or status indicator, footer navigation, loading indicator

## Functional Requirements Referenced

- **3.11 Find Ring (Search)**: Complete Ring search use case with case-insensitive partial matching, membership status indication, and result ordering
