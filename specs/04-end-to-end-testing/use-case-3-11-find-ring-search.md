# Use Case 3.11: Find Ring (Search) - End-to-End Tests

## Test Name: Find Ring (Search) - Positive Cases

### Test 3.11.1: Search for Rings by Exact Name Match

**Test Description**: Validates that authenticated user can search for Rings by exact name and see results with Join buttons for non-member Rings.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_exact_001` is registered and logged in
3. Rings exist in database:
   - `ExactMatchRing_001` (user is NOT a member)
   - `OtherRing_001` (user may or may not be a member)

**Test Data**:
- User: `testuser_find_exact_001`
- Search query: `ExactMatchRing_001` (exact match)
- Ring: `ExactMatchRing_001` (not a member)

**Test Steps**:
1. Ensure user is logged in as `testuser_find_exact_001`
2. Navigate to Find Ring screen (click "Find Ring" in footer)
3. Observe Find Ring screen with search bar
4. Enter search query: `ExactMatchRing_001` in the search bar
5. Press Enter or click search button
6. Observe search results

**Expected Results**:
- Find Ring screen displays:
  - Search bar at the top with placeholder "Search for Rings..."
  - Search icon or button
  - Clear button (X) appears when text is entered
- After entering search query and submitting:
  - Search results list displays
  - Ring `ExactMatchRing_001` appears in results
  - Ring item displays:
    - Ring name: `ExactMatchRing_001`
    - Member count (e.g., "5 members")
    - "Join" button (since user is not a member)
  - Results are ordered alphabetically by name

**Assertions**:
- HTTP status code: 200
- Search results contain matching Ring
- Ring name and member count are displayed correctly
- "Join" button is visible for non-member Rings
- Search requires minimum 1 character

---

### Test 3.11.2: Search for Rings by Partial Name Match

**Test Description**: Validates that search works with partial Ring name matching (case-insensitive).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_partial_001` is registered and logged in
3. Rings exist in database:
   - `RingAlpha_001` (user is NOT a member)
   - `RingAlphaBeta_001` (user is NOT a member)
   - `RingBeta_001` (user may or may not be a member)
   - `OtherRing_001` (user may or may not be a member)

**Test Data**:
- User: `testuser_find_partial_001`
- Search query: `alpha` (partial match, case-insensitive)
- Matching Rings: `RingAlpha_001`, `RingAlphaBeta_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_find_partial_001`
2. Navigate to Find Ring screen
3. Enter search query: `alpha` in the search bar
4. Press Enter or click search button
5. Observe search results

**Expected Results**:
- Search results display:
  - `RingAlpha_001` (contains "alpha")
  - `RingAlphaBeta_001` (contains "alpha")
- Search results do NOT display:
  - `RingBeta_001` (does not contain "alpha")
  - `OtherRing_001` (does not contain "alpha")
- Each matching Ring shows:
  - Ring name
  - Member count
  - "Join" button (if user is not a member)
- Search is case-insensitive

**Assertions**:
- HTTP status code: 200
- Search results contain only Rings whose names contain the search query (case-insensitive)
- Partial matching works correctly
- Results are ordered alphabetically

---

### Test 3.11.3: Search for Rings - Case-Insensitive Matching

**Test Description**: Validates that Find Ring search is case-insensitive.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_case_001` is registered and logged in
3. Ring `RingCaseTest_001` exists (user is NOT a member)

**Test Data**:
- User: `testuser_find_case_001`
- Ring: `RingCaseTest_001`
- Search queries: `ringcasetest`, `RINGCASETEST`, `RingCaseTest`, `rInGcAsEtEsT`

**Test Steps**:
1. Ensure user is logged in as `testuser_find_case_001`
2. Navigate to Find Ring screen
3. Enter search query: `ringcasetest` (lowercase)
4. Submit search and verify results
5. Clear search
6. Enter search query: `RINGCASETEST` (uppercase)
7. Submit search and verify results
8. Clear search
9. Enter search query: `RingCaseTest` (mixed case)
10. Submit search and verify results

**Expected Results**:
- All search queries (lowercase, uppercase, mixed case) return the same results
- Ring `RingCaseTest_001` is displayed regardless of case used in search
- Search is case-insensitive

**Assertions**:
- HTTP status code: 200
- Case-insensitive matching works for all case variations
- Results are consistent regardless of input case

---

### Test 3.11.4: Search Results Show Membership Status

**Test Description**: Validates that search results indicate which Rings user is already a member of.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_memberstatus_001` is registered and logged in
3. Rings exist:
   - `MemberRing_001` (user IS a member)
   - `NonMemberRing_001` (user is NOT a member)

**Test Data**:
- User: `testuser_memberstatus_001`
- Rings: `MemberRing_001` (member), `NonMemberRing_001` (not a member)
- Search query: `Ring` (matches both)

**Test Steps**:
1. Ensure user is logged in as `testuser_memberstatus_001`
2. Navigate to Find Ring screen
3. Enter search query: `Ring` in the search bar
4. Submit search
5. Observe search results

**Expected Results**:
- Search results display both Rings
- `NonMemberRing_001` displays:
  - Ring name
  - Member count
  - "Join" button (user can join)
- `MemberRing_001` displays:
  - Ring name
  - Member count
  - Status indicator showing "Member" or similar (no "Join" button)

**Assertions**:
- HTTP status code: 200
- Membership status is correctly indicated
- "Join" button only appears for non-member Rings
- Member Rings show appropriate status indicator

---

### Test 3.11.5: Clear Search Query

**Test Description**: Validates that clearing the search query resets the Find Ring screen.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_clear_001` is registered and logged in

**Test Data**:
- User: `testuser_find_clear_001`
- Search query: `TestRing` (then cleared)

**Test Steps**:
1. Ensure user is logged in as `testuser_find_clear_001`
2. Navigate to Find Ring screen
3. Enter search query: `TestRing`
4. Submit search and observe results
5. Click clear button (X) in search bar or delete all text
6. Observe Find Ring screen

**Expected Results**:
- After entering search, results are displayed
- After clearing search, Find Ring screen returns to initial state:
  - Search bar is empty
  - Empty state message is displayed (if no search has been performed)
  - OR results list is cleared

**Assertions**:
- HTTP status code: 200
- Clearing search resets the screen
- User can perform a new search

---

## Test Name: Find Ring (Search) - Negative Cases

### Test 3.11.6: Search with No Matching Rings

**Test Description**: Validates that Find Ring displays appropriate message when search query matches no Rings.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_nomatch_001` is registered and logged in
3. No Rings exist with names matching the search query

**Test Data**:
- User: `testuser_find_nomatch_001`
- Search query: `NonExistentRing_999` (does not match any Ring)

**Test Steps**:
1. Ensure user is logged in as `testuser_find_nomatch_001`
2. Navigate to Find Ring screen
3. Enter search query: `NonExistentRing_999` in the search bar
4. Press Enter or click search button
5. Observe search results

**Expected Results**:
- Search results display no Rings
- Message is displayed: "No Rings found matching 'NonExistentRing_999'"
- Search bar still shows the search query
- Clear button (X) is visible

**Assertions**:
- HTTP status code: 200
- No Ring items are displayed
- Error message text matches: "No Rings found matching '[search query]'"
- User can clear search and try again

---

### Test 3.11.7: Search with Empty Query

**Test Description**: Validates that Find Ring search fails or prevents submission when search query is empty.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_empty_001` is registered and logged in

**Test Data**:
- User: `testuser_find_empty_001`
- Search query: `` (empty)

**Test Steps**:
1. Ensure user is logged in as `testuser_find_empty_001`
2. Navigate to Find Ring screen
3. Leave search bar empty
4. Attempt to submit search (press Enter or click search button)

**Expected Results**:
- Search button is disabled when query is empty (preferred UX)
- OR if search is submitted with empty query:
  - Error message is displayed: "Please enter a search query."
  - No search results are displayed
  - User remains on Find Ring screen

**Assertions**:
- HTTP status code: 400 (Bad Request) if submission attempted
- Error message text matches: "Please enter a search query."
- No search is performed with empty query
- Minimum 1 character is required for search

---

### Test 3.11.8: Search with Single Character (Minimum Length)

**Test Description**: Validates that search works with minimum valid query length (1 character).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_find_min_001` is registered and logged in
3. Rings exist with names starting with "A": `ARing_001`, `AlphaRing_001`, etc.

**Test Data**:
- User: `testuser_find_min_001`
- Search query: `A` (exactly 1 character, minimum valid length)

**Test Steps**:
1. Ensure user is logged in as `testuser_find_min_001`
2. Navigate to Find Ring screen
3. Enter search query: `A` in the search bar
4. Press Enter or click search button
5. Observe search results

**Expected Results**:
- Search is performed successfully
- Search results display all Rings whose names contain "A" (case-insensitive)
- Results are displayed correctly
- Single character search works

**Assertions**:
- HTTP status code: 200
- Search works with 1-character query
- Results are returned correctly
- Minimum length requirement (1 character) is met

---

## Cleanup
- Test users and Rings created for Find Ring tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
