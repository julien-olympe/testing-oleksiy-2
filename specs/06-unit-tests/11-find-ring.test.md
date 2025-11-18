# Unit Test Specification: Find Ring (Search) (Use Case 3.11)

## Overview
This document specifies unit tests for the Find Ring (Search) use case, covering ring search by name, membership status indication, and search result formatting.

## Function/API Being Tested
- **API Endpoint**: `GET /api/rings/search?q=searchQuery`
- **Business Logic Functions**:
  - `validateAuthToken(token: string): Promise<User | null>`
  - `validateSearchQuery(query: string): ValidationResult`
  - `searchRingsByName(query: string): Promise<Ring[]>`
  - `checkUserMembership(userId: string, ringIds: string[]): Promise<boolean[]>`
  - `getRingMemberCount(ringId: string): Promise<number>`
  - `formatRingForSearch(ring: Ring, isMember: boolean, memberCount: number): SearchRingResult`
  - `findRings(userId: string, searchQuery: string): Promise<SearchRingResult[]>`

## Test Setup and Mock Data

### Mock Requirements
- Mock authentication token validation
- Mock database queries for ring search
- Mock database queries for membership checks
- Mock database queries for member counts

## Test Cases

### TC-FIND-RING-001: Successful Ring Search (Happy Path)
**Description**: Test successful ring search with matching results.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Mock search query validation to pass
3. Arrange: Mock ring search to return 5 matching Rings
4. Arrange: Mock membership checks for each ring
5. Arrange: Mock member counts for each ring
6. Act: Call `findRings(userId, 'Tech')`
7. Assert: Verify authentication was validated
8. Assert: Verify search query validation was called
9. Assert: Verify ring search was performed (case-insensitive partial matching)
10. Assert: Verify membership status was checked for each ring
11. Assert: Verify member counts were retrieved
12. Assert: Verify each ring is formatted correctly
13. Assert: Verify response contains array of SearchRingResult objects

**Expected Output**:
- Status: 200 OK
- Response: Array of SearchRingResult objects
- Each result: `{ id, name, memberCount, isMember: true/false }`

**Mock Verification**:
- `validateAuthToken` called once
- `validateSearchQuery` called once with 'Tech'
- `searchRingsByName` called once
- `checkUserMembership` called once with user_id and ring_ids
- `getRingMemberCount` called for each ring

---

### TC-FIND-RING-002: Ring Search - Empty Query
**Description**: Test ring search failure when query is empty.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Set search query to empty string
3. Act: Call `findRings(userId, '')`
4. Assert: Verify search query validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Please enter a search query."

---

### TC-FIND-RING-003: Ring Search - Whitespace-Only Query
**Description**: Test ring search failure when query contains only whitespace.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Set search query to whitespace only
3. Act: Call `findRings(userId, '   ')`
4. Assert: Verify search query validation fails (after trim)
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Please enter a search query."

---

### TC-FIND-RING-004: Ring Search - No Results
**Description**: Test ring search when no Rings match the query.

**Test Steps**:
1. Arrange: Mock authentication and validation to succeed
2. Arrange: Mock ring search to return empty array
3. Act: Call `findRings(userId, 'NonexistentRing')`
4. Assert: Verify empty array is returned

**Expected Output**:
- Status: 200 OK
- Response: `[]` (empty array)
- Frontend displays: "No Rings found matching 'NonexistentRing'"

---

### TC-FIND-RING-005: Ring Search - Case-Insensitive Matching
**Description**: Test that search is case-insensitive.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock Rings with names: "Technology", "TECHNOLOGY", "technology"
3. Arrange: Mock search query "tech"
4. Act: Call `findRings(userId, 'tech')`
5. Assert: Verify all three Rings match (case-insensitive)

**Expected Output**:
- All case variations match the same Rings
- Search is case-insensitive

---

### TC-FIND-RING-006: Ring Search - Partial Matching
**Description**: Test that search performs partial matching on Ring names.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock Rings with names: "JavaScript", "Java", "Python", "Java Script"
3. Arrange: Mock search query "Java"
4. Act: Call `findRings(userId, 'Java')`
5. Assert: Verify "JavaScript", "Java", and "Java Script" match
6. Assert: Verify "Python" does not match

**Expected Output**:
- Rings containing "Java" in name are matched
- Partial matches work correctly

---

### TC-FIND-RING-007: Ring Search - Membership Status Indication
**Description**: Test that membership status is correctly indicated for each ring.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock 5 Rings in search results
3. Arrange: Mock membership checks: 3 rings user is member, 2 rings user is not member
4. Act: Call `findRings(userId, 'Tech')`
5. Assert: Verify isMember flag is correct for each ring
6. Assert: Verify rings user is member of have isMember: true
7. Assert: Verify rings user is not member of have isMember: false

**Expected Output**:
- Each SearchRingResult includes isMember boolean
- isMember correctly reflects user's membership status

---

### TC-FIND-RING-008: Ring Search - Member Count Included
**Description**: Test that member count is included for each ring.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock Rings with different member counts
3. Act: Call `findRings(userId, 'Tech')`
4. Assert: Verify member count is retrieved for each ring
5. Assert: Verify member count is included in response

**Expected Output**:
- Each SearchRingResult includes memberCount
- Member count reflects actual number of members

---

### TC-FIND-RING-009: Ring Search - Authentication Failure
**Description**: Test ring search with invalid authentication token.

**Test Steps**:
1. Arrange: Mock authentication to return null
2. Act: Call `findRings(userId, 'Tech')`
3. Assert: Verify authentication validation fails
4. Assert: Verify function returns unauthorized error

**Expected Output**:
- Status: 401 Unauthorized
- Error: "Authentication required"

---

### TC-FIND-RING-010: Ring Search - Database Connection Error
**Description**: Test ring search when database connection fails.

**Test Steps**:
1. Arrange: Mock authentication to succeed
2. Arrange: Mock database connection to throw error
3. Act: Call `findRings(userId, 'Tech')`
4. Assert: Verify error is caught and handled
5. Assert: Verify function returns server error

**Expected Output**:
- Status: 500 Internal Server Error
- Error: "Unable to search Rings. Please try again."

---

### TC-FIND-RING-011: Ring Search - SQL Injection Prevention
**Description**: Test that search query prevents SQL injection.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock database with parameterized query verification
3. Act: Call `findRings(userId, "'; DROP TABLE rings; --")`
4. Assert: Verify parameterized queries are used
5. Assert: Verify SQL injection attempt is treated as literal query string
6. Assert: Verify database is not compromised

**Expected Output**:
- Status: 200 OK
- Search treats injection attempt as literal query string
- No database damage

---

### TC-FIND-RING-012: Ring Search - Performance
**Description**: Test search performance with many matching Rings.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock ring search to return 100 matching Rings
3. Act: Call `findRings(userId, 'Tech')`
4. Assert: Verify search completes within 1 second
5. Assert: Verify all Rings are processed

**Expected Output**:
- Status: 200 OK
- Response time: < 1 second
- All 100 Rings included

---

### TC-FIND-RING-013: Ring Search - Single Character Query
**Description**: Test search with single character query.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock Rings with names containing "T"
3. Arrange: Mock search query "T"
4. Act: Call `findRings(userId, 'T')`
5. Assert: Verify all Rings with "T" in name match
6. Assert: Verify partial matching works with single character

**Expected Output**:
- Status: 200 OK
- Response: Posts from Rings with "T" in name

---

### TC-FIND-RING-014: Ring Search - Very Long Query
**Description**: Test search with very long query string.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock search query of 1000 characters
3. Act: Call `findRings(userId, 'a'.repeat(1000))`
4. Assert: Verify search executes without error
5. Assert: Verify no Rings match (unless Ring name is extremely long)

**Expected Output**:
- Status: 200 OK
- Response: Empty array or filtered results

---

### TC-FIND-RING-015: Ring Search - Special Characters in Query
**Description**: Test search with special characters in query.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock search query with special characters
3. Act: Call `findRings(userId, 'Tech@Ring')`
4. Assert: Verify special characters are handled safely
5. Assert: Verify SQL injection attempts are prevented

**Expected Output**:
- Status: 200 OK
- Special characters treated as literal characters in search

---

### TC-FIND-RING-016: Ring Search - Unicode Characters in Query
**Description**: Test search with Unicode characters.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock search query with Unicode: "Café", "北京"
3. Act: Call `findRings(userId, 'Café')`
4. Assert: Verify Unicode characters are handled correctly
5. Assert: Verify encoding is preserved

**Expected Output**:
- Status: 200 OK
- Unicode characters handled correctly

---

### TC-FIND-RING-017: Ring Search - Rate Limiting
**Description**: Test that search endpoint respects rate limiting.

**Test Steps**:
1. Arrange: Mock rate limiter
2. Arrange: Set rate limit to 20 requests per minute per user
3. Act: Call search endpoint 21 times rapidly
4. Assert: Verify first 20 requests succeed
5. Assert: Verify 21st request returns 429 Too Many Requests

**Expected Output**:
- First 20 requests: 200 OK
- 21st request: 429 Too Many Requests

---

### TC-FIND-RING-018: Ring Search - Join Button Visibility Logic
**Description**: Test that Join button visibility is determined by membership status.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock Rings with mixed membership status
3. Act: Call `findRings(userId, 'Tech')`
4. Assert: Verify rings with isMember: false should show Join button
5. Assert: Verify rings with isMember: true should not show Join button

**Expected Output**:
- SearchRingResult with isMember: false → Join button shown
- SearchRingResult with isMember: true → Join button hidden

---

### TC-FIND-RING-019: Ring Search - Multiple Matching Rings
**Description**: Test search with multiple Rings matching query.

**Test Steps**:
1. Arrange: Mock authentication and validation
2. Arrange: Mock 20 Rings matching "Tech"
3. Act: Call `findRings(userId, 'Tech')`
4. Assert: Verify all 20 Rings are included in response
5. Assert: Verify membership status and member counts are correct for all

**Expected Output**:
- Response contains 20 SearchRingResults
- All Rings have correct membership status and member counts

---

### TC-FIND-RING-020: Ring Search - Null Query
**Description**: Test ring search failure when query is null.

**Test Steps**:
1. Arrange: Mock authentication to return valid user
2. Arrange: Set search query to null
3. Act: Call `findRings(userId, null)`
4. Assert: Verify search query validation fails
5. Assert: Verify function returns validation error

**Expected Output**:
- Status: 400 Bad Request
- Error: "Please enter a search query."
