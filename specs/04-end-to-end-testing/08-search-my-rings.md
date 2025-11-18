# Test: Search My Rings (3.7)

## Test Scenario Name
Search My Rings - Positive and Negative Test Cases

## Description
This test validates the Search My Rings use case (3.7) covering filtering My Rings list by Ring name search, real-time search, and edge cases.

## Prerequisites
- Application is running and accessible
- User `testuser_search_myrings_001` is registered and logged in
- Test data setup as needed for each test case

## Test Case 1: Successful Search - Single Match

### Prerequisites
- User `testuser_search_myrings_001` is logged in
- User is a member of Rings: `AlphaRing`, `BetaRing`, `GammaRing`

### Test Steps
1. Navigate to My Rings Screen (4.4 My Rings Screen)
2. Wait for Rings list to load, showing all user's Rings
3. Verify Rings list displays all three Rings
4. Locate the search bar at the top with placeholder "Search my Rings..."
5. Click on the search bar
6. Type search query: `Alpha` (partial match for "AlphaRing")
7. Verify search is performed in real-time as user types (3.7 Search My Rings)
8. Verify Rings list filters to show only Rings whose names contain "Alpha"
9. Verify only `AlphaRing` is displayed
10. Verify `BetaRing` and `GammaRing` are not displayed
11. Verify Ring items still display all required elements (name ellipsized to 20 chars, member count)

### Expected Results
- Search filters Rings list in real-time
- Only matching Rings are displayed
- Non-matching Rings are hidden
- Ring items display correctly

## Test Case 2: Successful Search - Multiple Matches

### Prerequisites
- User `testuser_search_myrings_002` is logged in
- User is a member of Rings: `TechRing`, `TechNews`, `SportsRing`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Type search query: `Tech` in the search bar
4. Verify Rings list filters to show both `TechRing` and `TechNews`
5. Verify `SportsRing` is not displayed
6. Verify Ring items are still ordered alphabetically (as per 4.4 My Rings Screen)
7. Verify all displayed Rings have names containing "Tech"

### Expected Results
- Search returns all matching Rings
- Non-matching Rings are excluded
- Alphabetical ordering is maintained

## Test Case 3: Case-Insensitive Search

### Prerequisites
- User `testuser_search_myrings_003` is logged in
- User is a member of Ring named `TestRingCase`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Type search query: `testring` (lowercase) in the search bar
4. Verify Rings list displays `TestRingCase` (case-insensitive matching, as per 3.7 Search My Rings)
5. Clear search and type: `TESTRING` (uppercase)
6. Verify Rings list displays `TestRingCase`
7. Clear search and type: `TestRing` (mixed case)
8. Verify Rings list displays `TestRingCase`

### Expected Results
- Search is case-insensitive
- All case variations match the Ring name

## Test Case 4: Clear Search - Restore Full List

### Prerequisites
- User `testuser_search_myrings_004` is logged in
- User is a member of multiple Rings

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load, showing all Rings
3. Type search query in the search bar
4. Verify Rings list filters to show only matching Rings
5. Click the Clear button (X) that appears when text is entered (as per 4.4 My Rings Screen)
6. Verify search query is cleared
7. Verify Rings list restores to show all user's Rings (3.7 Search My Rings: "If search query is cleared, the full list is restored")
8. Verify all Ring items are displayed again

### Expected Results
- Clear button clears the search query
- Full Rings list is restored when search is cleared
- All Rings are displayed again

## Test Case 5: Empty Search Query

### Prerequisites
- User `testuser_search_myrings_005` is logged in
- User is a member of multiple Rings

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Type a search query in the search bar
4. Verify Rings list filters
5. Delete all characters from the search bar (make it empty)
6. Verify Rings list automatically restores to show all Rings (3.7 Search My Rings: "If search query is empty or cleared, system returns full My Rings list")
7. Verify all Ring items are displayed

### Expected Results
- Empty search query restores full Rings list
- No filtering is applied when search is empty

## Test Case 6: No Results

### Prerequisites
- User `testuser_search_myrings_006` is logged in
- User is a member of Rings: `RingA`, `RingB`
- No Ring name contains "NonExistent"

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Type search query: `NonExistent` in the search bar
4. Verify Rings list displays: "No Rings found matching 'NonExistent'" (3.7 Search My Rings)
5. Verify no Ring items are displayed

### Expected Results
- No results message is displayed when no Rings match
- Message includes the search query

## Test Case 7: Partial Match - Beginning of Ring Name

### Prerequisites
- User `testuser_search_myrings_007` is logged in
- User is a member of Ring named `AlphaBetaGamma`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Type search query: `Alpha` in the search bar
4. Verify Rings list displays `AlphaBetaGamma` (partial matching from beginning)
5. Type search query: `Beta` in the search bar
6. Verify Rings list displays `AlphaBetaGamma` (partial matching in middle)
7. Type search query: `Gamma` in the search bar
8. Verify Rings list displays `AlphaBetaGamma` (partial matching at end)

### Expected Results
- Partial matching works at any position in Ring name
- All partial matches return results

## Test Case 8: Real-Time Search as User Types

### Prerequisites
- User `testuser_search_myrings_008` is logged in
- User is a member of Rings: `RingOne`, `RingTwo`, `RingThree`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load, showing all Rings
3. Type character: `R` in the search bar
4. Verify Rings list updates immediately (real-time search, as per 3.7 Search My Rings)
5. Verify Rings list shows all Rings starting with "R"
6. Type additional character: `i` (search query now: `Ri`)
7. Verify Rings list updates immediately
8. Continue typing: `ng` (search query now: `Ring`)
9. Verify Rings list updates immediately with filtered results
10. Verify each character typed triggers a new search

### Expected Results
- Search updates in real-time as user types
- No need to press Enter or click search button
- Each character triggers immediate filtering

## Test Case 9: Search with Ellipsized Names

### Prerequisites
- User `testuser_search_myrings_009` is logged in
- User is a member of Ring with name longer than 20 characters: `ThisIsAVeryLongRingNameThatExceedsTwentyCharacters`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Verify Ring name is ellipsized to 20 characters in the list
4. Type search query: `VeryLong` in the search bar (matches part of the long name)
5. Verify Rings list displays the Ring (search should match against full name, not ellipsized display)
6. Verify Ring item still shows ellipsized name in the list

### Expected Results
- Search matches against full Ring name, not ellipsized display
- Matching Rings are found even if name is ellipsized in display

## Test Case 10: Search Persistence During Navigation

### Prerequisites
- User `testuser_search_myrings_010` is logged in
- User is a member of multiple Rings

### Test Steps
1. Navigate to My Rings Screen
2. Type search query in the search bar
3. Verify Rings list is filtered
4. Click on a Ring item to navigate to Ring Chat
5. Navigate back to My Rings Screen (using browser back button or My Rings footer button)
6. Verify search query is either cleared OR persisted (implementation dependent)
7. If persisted: Verify Rings list is still filtered
8. If cleared: Verify full Rings list is displayed

### Expected Results
- Search state behavior is consistent (either persisted or cleared on navigation)
- Document the actual behavior observed

## Test Case 11: Search with Special Characters

### Prerequisites
- User `testuser_search_myrings_011` is logged in
- User is a member of Ring named `Ring123`

### Test Steps
1. Navigate to My Rings Screen
2. Wait for Rings list to load
3. Type search query: `123` in the search bar
4. Verify Rings list displays `Ring123` (numbers in search query work)
5. Clear search
6. Type search query: `Ring` in the search bar
7. Verify Rings list displays `Ring123`

### Expected Results
- Search works with alphanumeric characters
- Numbers in Ring names are searchable

## UI Elements Referenced

- **My Rings Screen** (4.4): Search bar with placeholder "Search my Rings...", Clear button (X), Rings list, Ring items

## Functional Requirements Referenced

- **3.7 Search My Rings**: Complete search functionality with real-time filtering, case-insensitive partial matching, and empty state handling
