# Unit Test Specification: View My Rings List (Use Case 3.6)

## Overview
This document specifies unit tests for the View My Rings List use case, covering membership retrieval, ring formatting, member count calculation, and edge cases.

## Function/API Being Tested
- **API Endpoint**: `GET /api/rings`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `getUserMemberships(userId: string): Promise<Membership[]>`
  - `getRingDetails(ringId: string): Promise<Ring>`
  - `getRingMemberCount(ringId: string): Promise<number>`
  - `formatRingForList(ring: Ring, memberCount: number): RingListItem`
  - `getMyRings(userId: string): Promise<RingListItem[]>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for memberships
- Mock database queries for ring details
- Mock database queries for member counts

### Test Data Factories
```typescript
const createTestMembership = (overrides = {}) => ({
  id: 'membership-uuid',
  user_id: 'user-uuid',
  ring_id: 'ring-uuid',
  joined_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});

const createTestRing = (overrides = {}) => ({
  id: 'ring-uuid',
  name: 'Test Ring',
  creator_id: 'user-uuid',
  created_at: new Date('2024-01-01T00:00:00Z'),
  ...overrides
});
```

## Test Cases

### TC-MY-RINGS-001: Successful My Rings List Retrieval (Happy Path)
**Description**: Test successful retrieval of user's Rings list.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return 5 Rings
3. Arrange: Mock ring details for each ring
4. Arrange: Mock member counts for each ring
5. Act: Call `getMyRings(userId)`
6. Assert: Verify authentication was validated
7. Assert: Verify memberships were retrieved
8. Assert: Verify ring details were retrieved for each ring
9. Assert: Verify member counts were retrieved for each ring
10. Assert: Verify each ring is formatted correctly
11. Assert: Verify response contains array of RingListItem objects

**Expected Output**:
- Status: 200 OK
- Response: Array of RingListItem objects
- Each item: `{ id, name, memberCount }`

**Mock Verification**:
- `validateAuthToken` called once
- `getUserMemberships` called once with user id
- `getRingDetails` called for each ring
- `getRingMemberCount` called for each ring

---

### TC-MY-RINGS-002: My Rings List - Empty State (No Rings)
**Description**: Test My Rings list when user has no Rings.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return empty array
3. Act: Call `getMyRings(userId)`
4. Assert: Verify empty array is returned
5. Assert: Verify no ring detail queries are executed

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "You haven't joined any Rings yet. Create or find a Ring to get started."

---

### TC-MY-RINGS-003: My Rings List - Ring Name Truncation (Exactly 20 Characters)
**Description**: Test that ring names are truncated to 20 characters in list items.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with name exactly 20 characters
3. Act: Call `getMyRings(userId)`
4. Assert: Verify ring name is exactly 20 characters (no ellipsis)
5. Arrange: Mock ring with name of 21 characters
6. Act: Call `getMyRings(userId)`
7. Assert: Verify ring name is truncated to 20 characters with ellipsis

**Expected Output**:
- 20 char name: Name is 20 chars, no ellipsis
- 21+ char name: Name is 20 chars + "..."

---

### TC-MY-RINGS-004: My Rings List - Ring Name Truncation (100 Characters)
**Description**: Test ring name truncation for maximum length name.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with name of 100 characters (maximum)
3. Act: Call `getMyRings(userId)`
4. Assert: Verify ring name is truncated to 20 characters with ellipsis

**Expected Output**:
- Ring name: First 20 characters + "..."

---

### TC-MY-RINGS-005: My Rings List - Member Count Calculation
**Description**: Test that member count is correctly calculated for each ring.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with 5 members
3. Arrange: Mock ring with 1 member (creator only)
4. Arrange: Mock ring with 100 members
5. Act: Call `getMyRings(userId)`
6. Assert: Verify member counts are correct for each ring
7. Assert: Verify member count is included in response

**Expected Output**:
- Each RingListItem includes correct memberCount
- Member count reflects actual number of memberships

---

### TC-MY-RINGS-006: My Rings List - Multiple Rings with Different Counts
**Description**: Test My Rings list with multiple Rings having different member counts.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock memberships for 5 Rings
3. Arrange: Mock member counts: 1, 5, 10, 50, 100
4. Act: Call `getMyRings(userId)`
5. Assert: Verify all 5 Rings are included
6. Assert: Verify each Ring has correct member count

**Expected Output**:
- Response contains 5 RingListItems
- Each item has correct memberCount

---

### TC-MY-RINGS-007: My Rings List - Authentication Failure
**Description**: Test My Rings list retrieval with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `getMyRings(userId)`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error
5. Assert: Verify no database queries are executed

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-MY-RINGS-008: My Rings List - Database Connection Error
**Description**: Test My Rings list retrieval when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `getMyRings(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load Rings. Please try again."

---

### TC-MY-RINGS-009: My Rings List - Membership Query Error
**Description**: Test My Rings list retrieval when membership query fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock membership query to throw error
3. Act: Call `getMyRings(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load Rings. Please try again."

---

### TC-MY-RINGS-010: My Rings List - Ring Details Query Error
**Description**: Test My Rings list retrieval when ring details query fails.

**Test Steps**:
1. Arrange: Mock authentication and memberships to succeed
2. Arrange: Mock ring details query to throw error
3. Act: Call `getMyRings(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load Rings. Please try again."

---

### TC-MY-RINGS-011: My Rings List - Member Count Query Error
**Description**: Test My Rings list retrieval when member count query fails.

**Test Steps**:
1. Arrange: Mock authentication, memberships, and ring details to succeed
2. Arrange: Mock member count query to throw error
3. Act: Call `getMyRings(userId)`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to load Rings. Please try again."

---

### TC-MY-RINGS-012: My Rings List - Performance with 50 Rings
**Description**: Test My Rings list performance with maximum number of Rings (50).

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock memberships to return 50 Rings
3. Act: Call `getMyRings(userId)`
4. Assert: Verify query completes within 500ms
5. Assert: Verify all Rings are retrieved and formatted

**Expected Output**:
- Status: 200 OK
- Response time: < 500ms
- All 50 Rings included

---

### TC-MY-RINGS-013: My Rings List - Ring Ordering
**Description**: Test that Rings are returned in consistent order.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock 5 Rings
3. Act: Call `getMyRings(userId)`
4. Assert: Verify Rings are returned in consistent order (e.g., by name or creation date)
5. Assert: Verify order is maintained across requests

**Expected Output**:
- Rings returned in consistent order
- Order matches specification (alphabetical by name or chronological)

---

### TC-MY-RINGS-014: My Rings List - Ring with Single Member (Creator)
**Description**: Test My Rings list for ring with only creator as member.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with member count = 1
3. Act: Call `getMyRings(userId)`
4. Assert: Verify member count is 1
5. Assert: Verify ring is included in list

**Expected Output**:
- Ring included with memberCount = 1

---

### TC-MY-RINGS-015: My Rings List - Ring with Many Members
**Description**: Test My Rings list for ring with large member count.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with member count = 1000
3. Act: Call `getMyRings(userId)`
4. Assert: Verify member count is 1000
5. Assert: Verify large numbers are handled correctly

**Expected Output**:
- Ring included with memberCount = 1000

---

### TC-MY-RINGS-016: My Rings List - Concurrent Requests
**Description**: Test handling of concurrent My Rings list requests.

**Test Steps**:
1. Arrange: Mock authentication and database
2. Act: Simulate 100 concurrent My Rings list requests
3. Assert: Verify all requests complete successfully
4. Assert: Verify database connection pool handles concurrent queries

**Expected Output**:
- All 100 requests: 200 OK
- No connection pool exhaustion
- Response times remain acceptable

---

### TC-MY-RINGS-017: My Rings List - Ring Name with Special Characters
**Description**: Test My Rings list formatting with special characters in ring names.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with name containing special characters: "Tech@Ring", "Tech-Ring"
3. Act: Call `getMyRings(userId)`
4. Assert: Verify special characters are preserved in name
5. Assert: Verify truncation works correctly with special characters

**Expected Output**:
- Special characters preserved in ring name
- Truncation works correctly

---

### TC-MY-RINGS-018: My Rings List - Ring Name with Unicode
**Description**: Test My Rings list formatting with Unicode characters in ring names.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with name containing Unicode: "Café Ring", "北京 Ring"
3. Act: Call `getMyRings(userId)`
4. Assert: Verify Unicode characters are handled correctly
5. Assert: Verify truncation works correctly with Unicode

**Expected Output**:
- Unicode characters preserved
- Truncation works correctly with multi-byte characters

---

### TC-MY-RINGS-019: My Rings List - Member Count Edge Cases
**Description**: Test member count calculation edge cases.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring with member count = 0 (edge case - should not happen)
3. Arrange: Mock ring with member count = null (error case)
4. Act: Call `getMyRings(userId)`
5. Assert: Verify edge cases are handled gracefully

**Expected Output**:
- Edge cases handled without errors
- Default values used if needed

---

### TC-MY-RINGS-020: My Rings List - Ring ID Included
**Description**: Test that ring ID is included in response for navigation.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock ring details
3. Act: Call `getMyRings(userId)`
4. Assert: Verify each RingListItem includes ring id
5. Assert: Verify id can be used for navigation to Ring Chat

**Expected Output**:
- Each RingListItem includes id field
- ID is valid UUID
