# Use Case 3.6: View My Rings List - End-to-End Tests

## Test Name: View My Rings List - Positive Cases

### Test 3.6.1: View My Rings List with Multiple Rings

**Test Description**: Validates that authenticated user can view a list of all Rings they are a member of, displaying Ring name and member count.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_myrings_001` is registered and logged in
3. User is a member of 5 Rings:
   - `RingA_001` (3 members)
   - `RingB_001` (5 members)
   - `RingC_001` (1 member)
   - `RingD_001` (10 members)
   - `RingE_001` (2 members)

**Test Data**:
- User: `testuser_myrings_001`
- Rings: RingA_001 (3 members), RingB_001 (5 members), RingC_001 (1 member), RingD_001 (10 members), RingE_001 (2 members)

**Test Steps**:
1. Ensure user is logged in as `testuser_myrings_001`
2. Navigate to My Rings screen (click "My Rings" in footer)
3. Observe My Rings list display

**Expected Results**:
- My Rings screen displays:
  - Search bar at the top with placeholder "Search my Rings..."
  - List of 5 Ring items
  - Each Ring item displays:
    - Ring name (ellipsized to 20 characters if longer, full name on hover/tooltip)
    - Member count (e.g., "3 members", "5 members", "1 member", "10 members", "2 members")
    - Entire item is clickable
  - Rings are ordered alphabetically by name
  - Footer navigation is visible

**Assertions**:
- HTTP status code: 200
- All 5 Rings are displayed
- Ring names are displayed correctly (ellipsized if > 20 chars)
- Member counts are accurate
- Rings are ordered alphabetically
- Each Ring item is clickable

---

### Test 3.6.2: View My Rings List - Ring Name Ellipsization

**Test Description**: Validates that long Ring names are ellipsized to 20 characters in the list display.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_ellipsis_001` is registered and logged in
3. User is a member of Ring with long name: `VeryLongRingNameThatExceedsTwentyCharacters_001` (50+ characters)

**Test Data**:
- User: `testuser_ellipsis_001`
- Ring: `VeryLongRingNameThatExceedsTwentyCharacters_001` (50+ characters)

**Test Steps**:
1. Ensure user is logged in as `testuser_ellipsis_001`
2. Navigate to My Rings screen
3. Observe Ring item display

**Expected Results**:
- Ring item displays:
  - Ring name ellipsized to 20 characters: "VeryLongRingNameTh..." (with ellipsis)
  - Full Ring name is available on hover/tooltip: `VeryLongRingNameThatExceedsTwentyCharacters_001`
  - Member count is displayed
  - Ring item is clickable

**Assertions**:
- HTTP status code: 200
- Ring name is ellipsized to 20 characters
- Full name is accessible via hover/tooltip
- Clicking Ring item navigates to Ring Chat with full name displayed

---

### Test 3.6.3: View My Rings List - Alphabetical Ordering

**Test Description**: Validates that Rings are displayed in alphabetical order by name.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_alphabetical_001` is registered and logged in
3. User is a member of Rings: `ZebraRing`, `AlphaRing`, `BetaRing`, `DeltaRing`, `CharlieRing`

**Test Data**:
- User: `testuser_alphabetical_001`
- Rings: `ZebraRing`, `AlphaRing`, `BetaRing`, `DeltaRing`, `CharlieRing`

**Test Steps**:
1. Ensure user is logged in as `testuser_alphabetical_001`
2. Navigate to My Rings screen
3. Observe order of Ring items

**Expected Results**:
- Rings are displayed in alphabetical order:
  1. `AlphaRing`
  2. `BetaRing`
  3. `CharlieRing`
  4. `DeltaRing`
  5. `ZebraRing`

**Assertions**:
- HTTP status code: 200
- Rings are ordered alphabetically by name (case-insensitive)
- Order is consistent and correct

---

### Test 3.6.4: View My Rings List - Click Ring to Navigate

**Test Description**: Validates that clicking a Ring item in My Rings list navigates to that Ring's Chat screen.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_navigate_001` is registered and logged in
3. User is a member of Ring `NavigationTestRing_001`

**Test Data**:
- User: `testuser_navigate_001`
- Ring: `NavigationTestRing_001`

**Test Steps**:
1. Ensure user is logged in as `testuser_navigate_001`
2. Navigate to My Rings screen
3. Observe Ring item for `NavigationTestRing_001`
4. Click on the Ring item

**Expected Results**:
- User is navigated to Ring Chat screen for `NavigationTestRing_001`
- Ring Chat displays:
  - Ring name: `NavigationTestRing_001` in header
  - Member count
  - "Add User" button
  - Message history (or empty state)
  - Message input area

**Assertions**:
- HTTP status code: 200 (for Ring Chat)
- Navigation to Ring Chat is successful
- Correct Ring is displayed
- User can view and post in the Ring

---

### Test 3.6.5: View My Rings List - Member Count Accuracy

**Test Description**: Validates that member count displayed for each Ring is accurate.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_membercount_001` is registered and logged in
3. User is a member of Ring `MemberCountRing_001`
4. Ring has exactly 5 members (including testuser_membercount_001)

**Test Data**:
- User: `testuser_membercount_001`
- Ring: `MemberCountRing_001` (5 members total)

**Test Steps**:
1. Ensure user is logged in as `testuser_membercount_001`
2. Navigate to My Rings screen
3. Observe member count for `MemberCountRing_001`

**Expected Results**:
- Ring item displays member count: "5 members" (or "5 members")
- Member count is accurate and matches actual number of members in database

**Assertions**:
- HTTP status code: 200
- Member count is accurate
- Count matches database Membership records for that Ring

---

## Test Name: View My Rings List - Empty States

### Test 3.6.6: View My Rings List with No Rings

**Test Description**: Validates that My Rings screen displays appropriate empty state when user has not joined any Rings.

**Prerequisites/Setup**:
1. Application is running and accessible
2. User `testuser_norings_001` is registered and logged in
3. User is not a member of any Rings

**Test Data**:
- User: `testuser_norings_001`
- Rings: None

**Test Steps**:
1. Ensure user is logged in as `testuser_norings_001`
2. Navigate to My Rings screen
3. Observe My Rings display

**Expected Results**:
- My Rings screen displays:
  - Search bar at the top
  - Empty state message: "You haven't joined any Rings yet. Create or find a Ring to get started."
  - Footer navigation is visible
  - No Ring items are displayed

**Assertions**:
- HTTP status code: 200
- Empty state message text matches exactly: "You haven't joined any Rings yet. Create or find a Ring to get started."
- No Ring items are displayed
- User can navigate to Create Ring or Find Ring screens

---

## Cleanup
- Test users and Rings created for My Rings tests can remain in database for integration testing
- For isolated test runs, test data should be cleaned up or test database should be reset
