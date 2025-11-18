# Test: Create Ring (3.5)

## Test Scenario Name
Create Ring - Positive and Negative Test Cases

## Description
This test validates the Create Ring use case (3.5) covering Ring creation, validation, uniqueness, and automatic membership.

## Prerequisites
- Application is running and accessible
- User `testuser_create_ring_001` is registered and logged in

## Test Case 1: Successful Ring Creation

### Prerequisites
- User `testuser_create_ring_001` is logged in
- No Ring with name `TestRingCreate001` exists

### Test Steps
1. Navigate to Create Ring Screen by clicking "Create Ring" button in footer navigation (4.7 Create Ring Screen)
2. Verify Create Ring Screen displays:
   - Centered form container
   - Ring name input field with placeholder "Enter Ring name..."
   - Character count indicator showing remaining characters out of 100
   - Create button
   - Help text explaining what a Ring is
   - Footer navigation at the bottom
3. Verify Create button is disabled (Ring name is empty)
4. Enter Ring name: `TestRingCreate001`
5. Verify character count indicator updates to show remaining characters (100 - length of "TestRingCreate001")
6. Verify Create button becomes enabled
7. Click Create button
8. Verify user is automatically redirected to the new Ring's Chat screen (3.5 Create Ring)
9. Verify Ring Chat Screen displays (4.5 Ring Chat Screen)
10. Verify Ring Header displays:
    - Ring name: `TestRingCreate001`
    - Member count: "1 member" (user automatically becomes a member, as per 3.5 Create Ring)
11. Verify user can post messages in the Ring (user is a member)

### Expected Results
- Ring is created successfully
- User is redirected to Ring Chat
- User automatically becomes a member
- Ring name is displayed correctly

## Test Case 2: Ring Name Already Exists

### Prerequisites
- User `testuser_create_ring_002` is logged in
- Ring with name `ExistingRing` already exists in database

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `ExistingRing`
3. Click Create button
4. Verify user remains on Create Ring Screen (not redirected)
5. Verify error message is displayed: "Ring name already exists. Please choose a different name." (3.5 Create Ring)
6. Verify Ring name input field still contains the entered name (or is cleared, implementation dependent)
7. Verify user can modify the Ring name and try again

### Expected Results
- Ring creation fails
- Error message is displayed
- User is not redirected
- User can retry with a different name

## Test Case 3: Ring Name Too Short

### Test Steps
1. Navigate to Create Ring Screen
2. Leave Ring name field empty
3. Verify Create button remains disabled
4. Try to click Create button (should not be clickable)
5. If button is enabled, click it and verify validation error: "Ring name must be between 1 and 100 characters." (3.5 Create Ring)

### Expected Results
- Empty Ring name is not accepted
- Create button is disabled or validation error is shown

## Test Case 4: Ring Name Too Long

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `a`.repeat(101) (101 characters, exceeds maximum of 100)
3. Verify character count indicator shows 0 or negative remaining characters
4. Click Create button
5. Verify user remains on Create Ring Screen
6. Verify error message is displayed: "Ring name must be between 1 and 100 characters." (3.5 Create Ring)

### Expected Results
- Ring name exceeding 100 characters is rejected
- Validation error is displayed
- User is not redirected

## Test Case 5: Ring Name Exactly 1 Character (Boundary)

### Prerequisites
- No Ring with name `A` exists

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `A` (exactly 1 character, minimum valid)
3. Verify character count indicator shows 99 remaining characters
4. Click Create button
5. Verify user is automatically redirected to the new Ring's Chat screen
6. Verify Ring Chat Screen displays with Ring name: `A`

### Expected Results
- Ring name with 1 character is accepted
- Ring is created successfully
- User is redirected to Ring Chat

## Test Case 6: Ring Name Exactly 100 Characters (Boundary)

### Prerequisites
- No Ring with name of 100 characters exists

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `a`.repeat(100) (exactly 100 characters, maximum valid)
3. Verify character count indicator shows 0 remaining characters
4. Click Create button
5. Verify user is automatically redirected to the new Ring's Chat screen
6. Verify Ring Chat Screen displays with Ring name of 100 characters (may be truncated in UI)

### Expected Results
- Ring name with 100 characters is accepted
- Ring is created successfully
- User is redirected to Ring Chat

## Test Case 7: Ring Name with Special Characters

### Prerequisites
- No Ring with name `Ring!@#$%` exists (or similar with special characters)

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `Ring!@#$%` (contains special characters)
3. Click Create button
4. Verify behavior (implementation dependent - special characters may be allowed or rejected)
5. If allowed: Verify Ring is created successfully
6. If rejected: Verify validation error is displayed

### Expected Results
- Behavior depends on implementation (special characters may be allowed or restricted)
- Document the actual behavior observed

## Test Case 8: Character Count Indicator Updates

### Test Steps
1. Navigate to Create Ring Screen
2. Verify character count indicator shows "100" or "100 remaining" initially
3. Type character: `T`
4. Verify character count indicator updates to show "99" or "99 remaining"
5. Type additional characters: `est`
6. Verify character count indicator updates to show "96" or "96 remaining"
7. Delete one character
8. Verify character count indicator updates to show "97" or "97 remaining"

### Expected Results
- Character count indicator updates in real-time as user types
- Count accurately reflects remaining characters out of 100

## Test Case 9: Create Multiple Rings

### Prerequisites
- User `testuser_create_ring_003` is logged in

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `RingOne`
3. Click Create button
4. Verify user is redirected to Ring Chat for `RingOne`
5. Navigate to Create Ring Screen again (click "Create Ring" in footer)
6. Enter Ring name: `RingTwo`
7. Click Create button
8. Verify user is redirected to Ring Chat for `RingTwo`
9. Navigate to My Rings Screen
10. Verify both `RingOne` and `RingTwo` are listed in My Rings (3.6 View My Rings List)

### Expected Results
- User can create multiple Rings
- All created Rings appear in My Rings list
- Each Ring creation works independently

## Test Case 10: Create Ring and Verify Membership

### Prerequisites
- User `testuser_create_ring_004` is logged in

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `MembershipTestRing`
3. Click Create button
4. Verify user is redirected to Ring Chat
5. Verify Ring Header shows member count: "1 member"
6. Navigate to My Rings Screen
7. Verify `MembershipTestRing` appears in the list
8. Navigate to Home Screen
9. Verify user can see posts from `MembershipTestRing` in News Feed (once posts are created)

### Expected Results
- User automatically becomes a member of created Ring
- Member count reflects the creator as a member
- Ring appears in My Rings
- User can access Ring features

## Test Case 11: Create Ring with Whitespace

### Prerequisites
- No Ring with name `TestRing` exists

### Test Steps
1. Navigate to Create Ring Screen
2. Enter Ring name: `  TestRing  ` (with leading and trailing spaces)
3. Click Create button
4. Verify behavior (implementation dependent - whitespace may be trimmed or preserved)
5. If trimmed: Verify Ring is created with name `TestRing` (without spaces)
6. If preserved: Verify Ring is created with name including spaces
7. Verify user is redirected to Ring Chat

### Expected Results
- Behavior depends on implementation (whitespace trimming)
- Document the actual behavior observed

## UI Elements Referenced

- **Create Ring Screen** (4.7): Ring name input field, character count indicator, Create button, help text, footer navigation
- **Ring Chat Screen** (4.5): Ring Header, member count
- **My Rings Screen** (4.4): Rings list

## Functional Requirements Referenced

- **3.5 Create Ring**: Complete Ring creation use case with validation, uniqueness checking, and automatic membership
