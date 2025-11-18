# Use Case 3.4: Search Rings in News Feed - End-to-End Tests

## Test Name: Search Rings in News Feed - Positive Cases

### Test 3.4.1: Search News Feed by Exact Ring Name Match

**Test Description**: Validates that News Feed can be filtered by searching for an exact Ring name match.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_exact_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_search_exact_001`
- Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`
- Search query: `RingAlpha_001` (exact match)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_exact_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from all 3 Rings)
4. Enter search query: `RingAlpha_001` in the search bar
5. Observe filtered News Feed

**Expected Results**:
- Initial News Feed shows posts from all 3 Rings
- After entering search query, News Feed filters to show only posts from `RingAlpha_001`
- News Tiles display only posts from `RingAlpha_001`
- Search is performed in real-time (as user types)
- Clear button (X) appears in search bar

**Assertions**:
- HTTP status code: 200
- Search results contain only posts from matching Ring
- Posts are still ordered newest first
- All News Tiles show Ring name `RingAlpha_001`

---

### Test 3.4.2: Search News Feed by Partial Ring Name Match

**Test Description**: Validates that News Feed can be filtered by searching for a partial Ring name (case-insensitive partial matching).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_partial_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`, `RingAlphaBeta_001`, `OtherRing_001`
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_search_partial_001`
- Rings: `RingAlpha_001`, `RingBeta_001`, `RingAlphaBeta_001`, `OtherRing_001`
- Search query: `alpha` (partial match, case-insensitive)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_partial_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from all 4 Rings)
4. Enter search query: `alpha` in the search bar
5. Observe filtered News Feed

**Expected Results**:
- Initial News Feed shows posts from all 4 Rings
- After entering search query, News Feed filters to show posts from:
  - `RingAlpha_001` (contains "alpha")
  - `RingAlphaBeta_001` (contains "alpha")
- News Feed does NOT show posts from:
  - `RingBeta_001` (does not contain "alpha")
  - `OtherRing_001` (does not contain "alpha")
- Search is case-insensitive (works with "Alpha", "ALPHA", "alpha")

**Assertions**:
- HTTP status code: 200
- Search results contain only posts from Rings whose names contain the search query (case-insensitive)
- Posts are still ordered newest first
- Partial matching works correctly

---

### Test 3.4.3: Search News Feed - Case-Insensitive Matching

**Test Description**: Validates that News Feed search is case-insensitive.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_case_001` is registered and logged in
3. User is a member of Ring `RingCaseTest_001`
4. Ring has at least 1 post

**Test Data**:
- User: `testuser_search_case_001`
- Ring: `RingCaseTest_001`
- Search queries: `ringcasetest`, `RINGCASETEST`, `RingCaseTest`, `rInGcAsEtEsT`

**Test Steps**:
1. Ensure user is logged in as `testuser_search_case_001`
2. Navigate to Home screen
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
- Posts from `RingCaseTest_001` are displayed regardless of case used in search
- Search is case-insensitive

**Assertions**:
- HTTP status code: 200
- Case-insensitive matching works for all case variations
- Results are consistent regardless of input case

---

### Test 3.4.4: Clear Search Query and Restore Full News Feed

**Test Description**: Validates that clearing the search query restores the full News Feed.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_clear_001` is registered and logged in
3. User is a member of Rings: `RingA_001`, `RingB_001`, `RingC_001`
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_search_clear_001`
- Rings: `RingA_001`, `RingB_001`, `RingC_001`
- Search query: `RingA` (then cleared)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_clear_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from all 3 Rings)
4. Enter search query: `RingA` in the search bar
5. Observe filtered News Feed (should show only posts from `RingA_001`)
6. Click clear button (X) in search bar or delete all text
7. Observe News Feed

**Expected Results**:
- Initial News Feed shows posts from all 3 Rings
- After entering search, News Feed shows only posts from `RingA_001`
- After clearing search, full News Feed is restored showing posts from all 3 Rings
- News Feed returns to original state before search

**Assertions**:
- HTTP status code: 200
- Clearing search restores full News Feed
- All posts from user's Rings are displayed again
- Posts remain ordered newest first

---

### Test 3.4.5: Real-Time Search as User Types

**Test Description**: Validates that News Feed search updates in real-time as the user types.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_realtime_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_search_realtime_001`
- Rings: `RingAlpha_001`, `RingBeta_001`, `RingGamma_001`
- Search query: Type "Ring" then "A" then "l" (building "RingAl")

**Test Steps**:
1. Ensure user is logged in as `testuser_search_realtime_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from all 3 Rings)
4. Type "R" in search bar
5. Observe News Feed updates
6. Type "i" (now "Ri")
7. Observe News Feed updates
8. Type "n" (now "Rin")
9. Observe News Feed updates
10. Type "g" (now "Ring")
11. Observe News Feed updates
12. Type "A" (now "RingA")
13. Observe News Feed updates

**Expected Results**:
- News Feed updates in real-time as each character is typed
- Search results narrow down as more characters are entered
- No need to press Enter or click a search button
- Search is performed automatically on each keystroke

**Assertions**:
- HTTP status code: 200 (for each search request)
- Real-time search works correctly
- Search results update immediately as user types
- Performance is acceptable (search completes within 1 second)

---

## Test Name: Search Rings in News Feed - Negative Cases

### Test 3.4.6: Search News Feed with No Matching Rings

**Test Description**: Validates that News Feed displays appropriate message when search query matches no Rings.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_nomatch_001` is registered and logged in
3. User is a member of Rings: `RingAlpha_001`, `RingBeta_001`
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_search_nomatch_001`
- Rings: `RingAlpha_001`, `RingBeta_001`
- Search query: `RingGamma_001` (does not match any Ring user is a member of)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_nomatch_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from both Rings)
4. Enter search query: `RingGamma_001` in the search bar
5. Observe News Feed display

**Expected Results**:
- Initial News Feed shows posts from `RingAlpha_001` and `RingBeta_001`
- After entering search query, News Feed shows no results
- Message is displayed: "No posts found for 'RingGamma_001'"
- Search bar still shows the search query
- Clear button (X) is visible

**Assertions**:
- HTTP status code: 200
- No News Tiles are displayed
- Error message text matches: "No posts found for '[search query]'"
- User can clear search to restore full News Feed

---

### Test 3.4.7: Search News Feed - Matching Rings but No Posts

**Test Description**: Validates that News Feed displays appropriate message when search matches Rings but those Rings have no posts.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_noposts_001` is registered and logged in
3. User is a member of Rings: `RingWithPosts_001` (has posts), `RingNoPosts_001` (no posts)
4. Search query matches `RingNoPosts_001`

**Test Data**:
- User: `testuser_search_noposts_001`
- Rings: `RingWithPosts_001` (has posts), `RingNoPosts_001` (no posts)
- Search query: `RingNoPosts` (matches RingNoPosts_001)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_noposts_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from `RingWithPosts_001`)
4. Enter search query: `RingNoPosts` in the search bar
5. Observe News Feed display

**Expected Results**:
- Initial News Feed shows posts from `RingWithPosts_001`
- After entering search query, News Feed shows no results (Ring matches but has no posts)
- Message is displayed: "No posts found for 'RingNoPosts'"
- Search bar still shows the search query

**Assertions**:
- HTTP status code: 200
- No News Tiles are displayed
- Error message text matches: "No posts found for '[search query]'"
- Ring exists and user is a member, but Ring has no posts

---

### Test 3.4.8: Search News Feed with Empty Query

**Test Description**: Validates that News Feed handles empty search query correctly (should show full feed).

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_search_empty_001` is registered and logged in
3. User is a member of Rings: `RingA_001`, `RingB_001`
4. Each Ring has at least 1 post

**Test Data**:
- User: `testuser_search_empty_001`
- Rings: `RingA_001`, `RingB_001`
- Search query: `` (empty string)

**Test Steps**:
1. Ensure user is logged in as `testuser_search_empty_001`
2. Navigate to Home screen
3. Observe initial News Feed (should show posts from both Rings)
4. Enter a search query: `RingA`
5. Observe filtered News Feed
6. Clear search query (make it empty)
7. Observe News Feed

**Expected Results**:
- Initial News Feed shows posts from both Rings
- After entering search, News Feed shows only posts from `RingA_001`
- After clearing search (empty query), full News Feed is restored showing posts from both Rings
- Empty search query is treated as "show all" (same as no search)

**Assertions**:
- HTTP status code: 200
- Empty search query restores full News Feed
- No error occurs with empty search
- Behavior is consistent with clearing search

---

## Cleanup
- Test users and Rings created for search tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
