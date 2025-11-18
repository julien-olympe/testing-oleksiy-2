# Unit Test Specification: Search My Rings (Use Case 3.7)

## Overview
This document specifies unit tests for the Search My Rings use case, covering search filtering within user's Rings, case-insensitive matching, empty query handling, and edge cases.

## Function/API Being Tested
- **API Endpoint**: `GET /api/rings?q=searchQuery`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `getUserMemberships(userId: string): Promise<Membership[]>`
  - `filterRingsByName(ringIds: string[], searchQuery: string): Promise<Ring[]>`
  - `getRingMemberCount(ringId: string): Promise<number>`
  - `formatRingForList(ring: Ring, memberCount: number): RingListItem`
  - `searchMyRings(userId: string, searchQuery: string): Promise<RingListItem[]>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for memberships
- Mock database queries for ring name filtering
- Mock database queries for member counts

## Test Cases

### TC-SEARCH-MY-RINGS-001: Successful My Rings Search (Happy Path)
**Description**: Test successful search filtering of user's Rings by name.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock memberships to return 5 Rings with names: "Tech", "Sports", "Tech News", "Music", "Tech Talk"
3. Arrange: Mock search query "Tech"
4. Arrange: Mock filtered Rings to return 3 matching Rings
5. Arrange: Mock member counts for matching Rings
6. Act: Call `searchMyRings(userId, 'Tech')`
7. Assert: Verify authentication was validated
8. Assert: Verify memberships were retrieved
9. Assert: Verify ring name filtering was performed (case-insensitive)
10. Assert: Verify only matching Rings are returned
11. Assert: Verify member counts are retrieved for matching Rings
12. Assert: Verify Rings are formatted correctly

**Expected Output**:
- Status: 200 OK
- Response: Array of RingListItems from Rings matching "Tech"
- Only "Tech", "Tech News", "Tech Talk" included

**Mock Verification**:
- `getUserMemberships` called once
- `filterRingsByName` called with ringIds and "Tech"
- `getRingMemberCount` called for each matching ring

---

### TC-SEARCH-MY-RINGS-002: Search with Empty Query Returns Full List
**Description**: Test that empty search query returns full My Rings list.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock all user's Rings
3. Act: Call `searchMyRings(userId, '')`
4. Assert: Verify search query is treated as empty
5. Assert: Verify full My Rings list is returned (same as View My Rings List)
6. Assert: Verify no filtering is applied

**Expected Output**:
- Status: 200 OK
- Response: Full My Rings list (all user's Rings)
- Same result as View My Rings List without search

---

### TC-SEARCH-MY-RINGS-003: Search - Case-Insensitive Matching
**Description**: Test that search is case-insensitive.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names: "Technology", "TECHNOLOGY", "technology"
3. Arrange: Mock search query "tech"
4. Act: Call `searchMyRings(userId, 'tech')`
5. Assert: Verify all three Rings match (case-insensitive)

**Expected Output**:
- All case variations match the same Rings
- Search is case-insensitive

---

### TC-SEARCH-MY-RINGS-004: Search - Partial Matching
**Description**: Test that search performs partial matching on Ring names.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names: "JavaScript", "Java", "Python", "Java Script"
3. Arrange: Mock search query "Java"
4. Act: Call `searchMyRings(userId, 'Java')`
5. Assert: Verify "JavaScript", "Java", and "Java Script" match
6. Assert: Verify "Python" does not match

**Expected Output**:
- Rings containing "Java" in name are matched
- Partial matches work correctly

---

### TC-SEARCH-MY-RINGS-005: Search - No Matching Rings
**Description**: Test search when no Rings match the query.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock Rings with names: "Tech", "Sports", "Music"
3. Arrange: Mock search query "Science"
4. Act: Call `searchMyRings(userId, 'Science')`
5. Assert: Verify no Rings match
6. Assert: Verify empty array is returned

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "No Rings found matching 'Science'"

---

### TC-SEARCH-MY-RINGS-006: Search - Authentication Failure
**Description**: Test search with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `searchMyRings(userId, 'Tech')`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-SEARCH-MY-RINGS-007: Search - SQL Injection Prevention
**Description**: Test that search query prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Mock search query with SQL injection attempt
3. Act: Call `searchMyRings(userId, "'; DROP TABLE rings; --")`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as literal string

**Expected Output**:
- Status: 200 OK
- Search treats injection attempt as literal query string
- No database damage

---

### TC-SEARCH-MY-RINGS-008: Search - Performance
**Description**: Test search performance with 50 Rings.

**Test Steps**:
1. Arrange: Mock authentication
2. Arrange: Mock memberships to return 50 Rings
3. Arrange: Mock search query matching 10 Rings
4. Act: Call `searchMyRings(userId, 'Tech')`
5. Assert: Verify search completes within 1 second
6. Assert: Verify only matching Rings are queried

**Expected Output**:
- Status: 200 OK
- Response time: < 1 second

---

### TC-SEARCH-MY-RINGS-009: Search - Clear Search (Empty Query)
**Description**: Test that clearing search restores full list.

**Test Steps**:
1. Arrange: Mock authentication and memberships
2. Arrange: Perform search with query "Tech"
3. Arrange: Mock full My Rings list
4. Act: Call `searchMyRings(userId, '')` (clear search)
5. Assert: Verify full My Rings list is returned
6. Assert: Verify no filtering is applied

**Expected Output**:
- Status: 200 OK
- Response: Full My Rings list
