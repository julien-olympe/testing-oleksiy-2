# Use Case 3.7: Search My Rings - End-to-End Tests

## Test Name: Search My Rings - Positive Cases

### Test 3.7.1: Search My Rings by Exact Name Match

**Test Description**: Validates that My Rings list can be filtered by searching for an exact Ring name match.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_exact_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`

**Test Data**:
- User: `testuser_search_exact_001`
- Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`
- Search query: `RingAlpha_001` (exact match)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_exact_001`
2. Navigate to My Rings screen
3. Observe initial My Rings list (should show all 3 Rings)
4. Enter search query: `RingAlpha_001` in the search bar
5. Observe filtered My Rings list

**Expected Results**:
- Initial My Rings list shows all 3 Rings
- After entering search query, My Rings list filters to show only `RingAlpha_001`
- Only one Ring item is displayed
- Search is performed in real-time (as user types)
- Clear button (X) appears in search bar

**Assertions**:
- HTTP status code: 200
- Search results contain only the matching Ring
- Ring name and member count are displayed correctly

---

### Test 3.7.2: Search My Rings by Partial Name Match

**Test Description**: Validates that My Rings list can be filtered by searching for a partial Ring name (case-insensitive partial matching).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_partial_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`, `RingAlphaBeta_001`, `OtherRing_001`

**Test Data**:
- User: `testuser_search_partial_001`
- Rings: `RingAlpha_001`, `RingBeta_001`, `RingAlphaBeta_001`, `OtherRing_001`
- Search query: `alpha` (partial match, case-insensitive)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_partial_001`
2. Navigate to My Rings screen
3. Observe initial My Rings list (should show all 4 Rings)
4. Enter search query: `alpha` in the search bar
5. Observe filtered My Rings list

**Expected Results**:
- Initial My Rings list shows all 4 Rings
- After entering search query, My Rings list filters to show:
  - `RingAlpha_001` (contains "alpha")
  - `RingAlphaBeta_001` (contains "alpha")
- My Rings list does NOT show:
  - `RingBeta_001` (does not contain "alpha")
  - `OtherRing_001` (does not contain "alpha")
- Search is case-insensitive

**Assertions**:
- HTTP status code: 200
- Search results contain only Rings whose names contain the search query (case-insensitive)
- Partial matching works correctly

---

### Test 3.7.3: Search My Rings - Case-Insensitive Matching

**Test Description**: Validates that My Rings search is case-insensitive.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_case_001` is registered and logged in
3. User is a member of Ring `RingCaseTest_001`

**Test Data**:
- User: `testuser_search_case_001`
- Ring: `RingCaseTest_001`
- Search queries: `ringcasetest`, `RINGCASETEST`, `RingCaseTest`, `rInGcAsEtEsT`

**Test Steps**:
1. Ensure user is logged in as `testuser_search_case_001`
2. Navigate to My Rings screen
3. Enter search query: `ringcasetest` (lowercase)
4. Verify results
5. Clear search
6. Enter search query: `RINGCASETEST` (uppercase)
7. Verify results
8. Clear search
9. Enter search query: `RingCaseTest` (mixed case)
10. Verify results

**Expected Results**:
- All search queries (lowercase, uppercase, mixed case) return the same results
- Ring `RingCaseTest_001` is displayed regardless of case used in search
- Search is case-insensitive

**Assertions**:
- HTTP status code: 200
- Case-insensitive matching works for all case variations
- Results are consistent regardless of input case

---

### Test 3.7.4: Clear Search Query and Restore Full My Rings List

**Test Description**: Validates that clearing the search query restores the full My Rings list.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_clear_001` is registered and logged in
3. User is a member of Rings: `RingA_001`, `RingB_001`, `RingC_001`

**Test Data**:
- User: `testuser_search_clear_001`
- Rings: `RingA_001`, `RingB_001`, `RingC_001`
- Search query: `RingA` (then cleared)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_clear_001`
2. Navigate to My Rings screen
3. Observe initial My Rings list (should show all 3 Rings)
4. Enter search query: `RingA` in the search bar
5. Observe filtered My Rings list (should show only `RingA_001`)
6. Click clear button (X) in search bar or delete all text
7. Observe My Rings list

**Expected Results**:
- Initial My Rings list shows all 3 Rings
- After entering search, My Rings list shows only `RingA_001`
- After clearing search, full My Rings list is restored showing all 3 Rings
- My Rings list returns to original state before search

**Assertions**:
- HTTP status code: 200
- Clearing search restores full My Rings list
- All Rings are displayed again
- Rings remain ordered alphabetically

---

### Test 3.7.5: Real-Time Search as User Types

**Test Description**: Validates that My Rings search updates in real-time as the user types.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_realtime_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`

**Test Data**:
- User: `testuser_search_realtime_001`
- Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`
- Search query: Type "Ring" then "A" then "l" (building "RingAl")

**Test Steps**:
1. Ensure user is logged in as `testuser_search_realtime_001`
2. Navigate to My Rings screen
3. Observe initial My Rings list (should show all 3 Rings)
4. Type "R" in search bar
5. Observe My Rings list updates
6. Type "i" (now "Ri")
7. Observe My Rings list updates
8. Type "n" (now "Rin")
9. Observe My Rings list updates
10. Type "g" (now "Ring")
11. Observe My Rings list updates (should show all 3 Rings)
12. Type "A" (now "RingA")
13. Observe My Rings list updates (should show only RingAlpha_001)

**Expected Results**:
- My Rings list updates in real-time as each character is typed
- Search results narrow down as more characters are entered
- No need to press Enter or click a search button
- Search is performed automatically on each keystroke

**Assertions**:
- HTTP status code: 200 (for each search request)
- Real-time search works correctly
- Search results update immediately as user types
- Performance is acceptable (search completes within 1 second)

---

## Test Name: Search My Rings - Negative Cases

### Test 3.7.6: Search My Rings with No Matching Rings

**Test Description**: Validates that My Rings list displays appropriate message when search query matches no Rings.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_nomatch_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`

**Test Data**:
- User: `testuser_search_nomatch_001`
- Rings: `RingAlpha_001`, `RingBeta_001`
- Search query: `RingGamma_001` (does not match any Ring user is a member of)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_nomatch_001`
2. Navigate to My Rings screen
3. Observe initial My Rings list (should show both Rings)
4. Enter search query: `RingGamma_001` in the search bar
5. Observe My Rings list display

**Expected Results**:
- Initial My Rings list shows `RingAlpha_001` and `RingBeta_001`
- After entering search query, My Rings list shows no results
- Message is displayed: "No Rings found matching 'RingGamma_001'"
- Search bar still shows the search query
- Clear button (X) is visible

**Assertions**:
- HTTP status code: 200
- No Ring items are displayed
- Error message text matches: "No Rings found matching '[search query]'"
- User can clear search to restore full My Rings list

---

### Test 3.7.7: Search My Rings with Empty Query

**Test Description**: Validates that My Rings list handles empty search query correctly (should show full list).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_empty_001` is registered and logged in
3. User is a member of Rings: `RingA_001`, `RingB_001`

**Test Data**:
- User: `testuser_search_empty_001`
- Rings: `RingA_001`, `RingB_001`
- Search query: `` (empty string)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_empty_001`
2. Navigate to My Rings screen
3. Observe initial My Rings list (should show both Rings)
4. Enter a search query: `RingA`
5. Observe filtered My Rings list
6. Clear search query (make it empty)
7. Observe My Rings list

**Expected Results**:
- Initial My Rings list shows both Rings
- After entering search, My Rings list shows only `RingA_001`
- After clearing search (empty query), full My Rings list is restored showing both Rings
- Empty search query is treated as "show all" (same as no search)

**Assertions**:
- HTTP status code: 200
- Empty search query restores full My Rings list
- No error occurs with empty search
- Behavior is consistent with clearing search

---

## Cleanup
- Test users and Rings created for search tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
