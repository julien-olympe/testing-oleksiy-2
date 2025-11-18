# Test: Search Rings in News Feed (3.4)

## Test Scenario Name
Search Rings in News Feed - Positive and Negative Test Cases

## Description
This test validates the Search Rings in News Feed use case (3.4) covering filtering News Feed by Ring name search, real-time search, and edge cases.

## Prerequisites
- Application is running and accessible
- User `testuser_search_news_001` is registered and logged in
- Test data setup as needed for each test case

## Test Case 1: Successful Search - Single Match

### Prerequisites
- User `testuser_search_news_001` is logged in
- User is a member of Ring named `TestRingAlpha`
- User is a member of Ring named `TestRingBeta`
- `TestRingAlpha` has at least one post
- `TestRingBeta` has at least one post

### Test Steps
1. Navigate to Home Screen (4.3 Home Screen)
2. Wait for News Feed to load, showing posts from both Rings
3. Verify News Feed displays posts from multiple Rings
4. Locate the search bar at the top with placeholder "Search Rings..."
5. Click on the search bar
6. Type search query: `Alpha` (partial match for "TestRingAlpha")
7. Verify search is performed in real-time as user types (3.4 Search Rings in News Feed)
8. Verify News Feed filters to show only posts from Rings whose names contain "Alpha"
9. Verify only posts from `TestRingAlpha` are displayed
10. Verify posts from `TestRingBeta` are not displayed
11. Verify News Tiles still display all required elements (Ring name, picture if any, message text, timestamp, author)

### Expected Results
- Search filters News Feed in real-time
- Only matching Ring posts are displayed
- Non-matching Ring posts are hidden
- News Tiles display correctly

## Test Case 2: Successful Search - Multiple Matches

### Prerequisites
- User `testuser_search_news_002` is logged in
- User is a member of Rings: `TechRing`, `TechNews`, `SportsRing`
- All Rings have posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type search query: `Tech` in the search bar
4. Verify News Feed filters to show posts from both `TechRing` and `TechNews`
5. Verify posts from `SportsRing` are not displayed
6. Verify News Tiles are still ordered newest first (reverse chronological)
7. Verify all displayed posts have Ring names containing "Tech"

### Expected Results
- Search returns posts from all matching Rings
- Non-matching Rings are excluded
- Posts remain ordered chronologically

## Test Case 3: Case-Insensitive Search

### Prerequisites
- User `testuser_search_news_003` is logged in
- User is a member of Ring named `TestRingCase`
- Ring has posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type search query: `testring` (lowercase) in the search bar
4. Verify News Feed displays posts from `TestRingCase` (case-insensitive matching, as per 3.4 Search Rings in News Feed)
5. Clear search and type: `TESTRING` (uppercase)
6. Verify News Feed displays posts from `TestRingCase`
7. Clear search and type: `TestRing` (mixed case)
8. Verify News Feed displays posts from `TestRingCase`

### Expected Results
- Search is case-insensitive
- All case variations match the Ring name

## Test Case 4: Clear Search - Restore Full Feed

### Prerequisites
- User `testuser_search_news_004` is logged in
- User is a member of multiple Rings with posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load, showing all posts
3. Type search query in the search bar
4. Verify News Feed filters to show only matching posts
5. Click the Clear button (X) that appears when text is entered (as per 4.3 Home Screen)
6. Verify search query is cleared
7. Verify News Feed restores to show all posts from all user's Rings (3.4 Search Rings in News Feed: "If search query is cleared, the full News Feed is restored")
8. Verify all News Tiles are displayed again

### Expected Results
- Clear button clears the search query
- Full News Feed is restored when search is cleared
- All posts from all Rings are displayed

## Test Case 5: Empty Search Query

### Prerequisites
- User `testuser_search_news_005` is logged in
- User is a member of multiple Rings with posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type a search query in the search bar
4. Verify News Feed filters
5. Delete all characters from the search bar (make it empty)
6. Verify News Feed automatically restores to show all posts (3.4 Search Rings in News Feed: "If search query is empty or cleared, system returns full News Feed")
7. Verify all News Tiles are displayed

### Expected Results
- Empty search query restores full News Feed
- No filtering is applied when search is empty

## Test Case 6: No Results - Matching Rings with No Posts

### Prerequisites
- User `testuser_search_news_006` is logged in
- User is a member of Ring named `EmptyRing` (no posts)
- User is a member of other Rings with posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type search query: `EmptyRing` in the search bar
4. Verify News Feed displays: "No posts found for 'EmptyRing'" (3.4 Search Rings in News Feed)
5. Verify no News Tiles are displayed

### Expected Results
- No results message is displayed when matching Rings have no posts
- Message includes the search query

## Test Case 7: No Results - No Matching Rings

### Prerequisites
- User `testuser_search_news_007` is logged in
- User is a member of Rings: `RingA`, `RingB`
- No Ring name contains "NonExistent"

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type search query: `NonExistent` in the search bar
4. Verify News Feed displays: "No posts found for 'NonExistent'" (3.4 Search Rings in News Feed)
5. Verify no News Tiles are displayed

### Expected Results
- No results message is displayed when no Rings match
- Message includes the search query

## Test Case 8: Partial Match - Beginning of Ring Name

### Prerequisites
- User `testuser_search_news_008` is logged in
- User is a member of Ring named `AlphaBetaGamma`
- Ring has posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type search query: `Alpha` in the search bar
4. Verify News Feed displays posts from `AlphaBetaGamma` (partial matching from beginning)
5. Type search query: `Beta` in the search bar
6. Verify News Feed displays posts from `AlphaBetaGamma` (partial matching in middle)
7. Type search query: `Gamma` in the search bar
8. Verify News Feed displays posts from `AlphaBetaGamma` (partial matching at end)

### Expected Results
- Partial matching works at any position in Ring name
- All partial matches return results

## Test Case 9: Real-Time Search as User Types

### Prerequisites
- User `testuser_search_news_009` is logged in
- User is a member of Rings: `RingOne`, `RingTwo`, `RingThree`
- All Rings have posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load, showing all posts
3. Type character: `R` in the search bar
4. Verify News Feed updates immediately (real-time search, as per 3.4 Search Rings in News Feed)
5. Verify News Feed shows posts from all Rings starting with "R"
6. Type additional character: `i` (search query now: `Ri`)
7. Verify News Feed updates immediately
8. Continue typing: `ng` (search query now: `Ring`)
9. Verify News Feed updates immediately with filtered results
10. Verify each character typed triggers a new search

### Expected Results
- Search updates in real-time as user types
- No need to press Enter or click search button
- Each character triggers immediate filtering

## Test Case 10: Search with Special Characters

### Prerequisites
- User `testuser_search_news_010` is logged in
- User is a member of Ring named `Ring123`
- Ring has posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Type search query: `123` in the search bar
4. Verify News Feed displays posts from `Ring123` (numbers in search query work)
5. Clear search
6. Type search query: `Ring` in the search bar
7. Verify News Feed displays posts from `Ring123`

### Expected Results
- Search works with alphanumeric characters
- Numbers in Ring names are searchable

## Test Case 11: Search Persistence During Navigation

### Prerequisites
- User `testuser_search_news_011` is logged in
- User is a member of multiple Rings with posts

### Test Steps
1. Navigate to Home Screen
2. Type search query in the search bar
3. Verify News Feed is filtered
4. Click on a News Tile to navigate to Ring Chat
5. Navigate back to Home Screen (using browser back button or Home footer button)
6. Verify search query is either cleared OR persisted (implementation dependent)
7. If persisted: Verify News Feed is still filtered
8. If cleared: Verify full News Feed is displayed

### Expected Results
- Search state behavior is consistent (either persisted or cleared on navigation)
- Document the actual behavior observed

## UI Elements Referenced

- **Home Screen** (4.3): Search bar with placeholder "Search Rings...", Clear button (X), News Feed, News Tiles

## Functional Requirements Referenced

- **3.4 Search Rings in News Feed**: Complete search functionality with real-time filtering, case-insensitive partial matching, and empty state handling
