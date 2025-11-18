# End-to-End Testing Rules and Conventions

This document defines general rules, conventions, and patterns that apply to all end-to-end test cases in the Rings platform.

## 1. Test Structure

### 1.1 Test File Naming Convention
- Test files are named using the pattern: `use-case-{number}-{name}.md` (e.g., `use-case-3-1-user-registration.md`)
- Critical path test: `critical-path.md`
- General rules: `rules.md`

### 1.2 Test Case Structure
Each test case must include:
- **Test Name**: Clear, descriptive name of the test scenario
- **Test Description**: Brief explanation of what the test validates
- **Prerequisites/Setup**: Required state before test execution
- **Test Steps**: Step-by-step actions with expected results
- **Test Data**: Specific data values used in the test
- **Assertions**: Exact expected values and behaviors
- **Cleanup**: Steps to restore system state (if needed)

## 2. Test Execution Standards

### 2.1 Test Environment
- Tests must be executable in a controlled test environment
- Database must be reset or isolated per test run
- Test data must be independent and not rely on external state
- All tests must be idempotent (can be run multiple times with same results)

### 2.2 Authentication and Session Management
- Each test that requires authentication must explicitly perform login or registration
- Session cookies must be properly handled and validated
- Tests must verify authentication state before accessing protected resources
- Logout must be tested to ensure session invalidation

### 2.3 API Interaction Patterns
- All API calls must use proper HTTP methods (GET, POST, PUT, DELETE)
- Request headers must include Content-Type and authentication tokens
- Response status codes must be validated (200, 201, 400, 401, 403, 404, 429, 500)
- Response body structure must match expected schema
- Error messages must match exact specifications from functional requirements

### 2.4 Database State Validation
- Tests must verify database state changes when applicable
- User creation, Ring creation, Post creation, and Membership creation must be validated in database
- Foreign key relationships must be verified
- Unique constraints must be tested (username uniqueness, Ring name uniqueness)

## 3. Test Data Management

### 3.1 Test User Accounts
- Use unique usernames per test run (e.g., `testuser_{timestamp}` or `testuser_{random}`)
- Test passwords must meet validation requirements (minimum 8 characters, letter + number)
- Example test credentials:
  - Username: `testuser_001`
  - Password: `Test1234`

### 3.2 Test Ring Names
- Use unique Ring names per test run to avoid conflicts
- Ring names must meet validation requirements (1-100 characters)
- Example: `TestRing_{timestamp}` or `TestRing_{random}`

### 3.3 Test Messages
- Message text must meet validation requirements (1-5000 characters)
- Test with various lengths: minimum (1 char), typical (50-200 chars), maximum (5000 chars)
- Test with special characters, emojis, and unicode characters

### 3.4 Test Images
- Use test image files that meet requirements:
  - Formats: JPEG, PNG, GIF
  - Maximum size: 10MB
  - Valid test images must be available in test fixtures directory
- Test with various image sizes: small (< 1MB), medium (1-5MB), large (5-10MB)
- Test with invalid formats (e.g., PDF, TXT) and oversized files (> 10MB)

## 4. Assertion Standards

### 4.1 Response Validation
- **Status Codes**: Verify exact HTTP status codes (200 for success, 400 for validation errors, 401 for unauthorized, 403 for forbidden, 404 for not found)
- **Response Body**: Validate structure and content match expected schema
- **Error Messages**: Verify exact error message text matches functional specification requirements
- **Timestamps**: Validate timestamp format and that created_at/joined_at are set correctly

### 4.2 UI Element Validation
- **Visibility**: Verify UI elements are displayed or hidden as expected
- **Text Content**: Verify exact text matches specifications (error messages, labels, placeholders)
- **Navigation**: Verify correct screen navigation after actions
- **State Changes**: Verify UI updates reflect data changes (e.g., member count updates, post appears in feed)

### 4.3 Data Integrity Validation
- **Uniqueness**: Verify unique constraints (username, Ring name) are enforced
- **Relationships**: Verify foreign key relationships are maintained
- **Cascading**: Verify related data is handled correctly (e.g., posts appear in News Feed after creation)

## 5. Error Handling and Negative Testing

### 5.1 Validation Error Testing
- Test all validation rules specified in functional requirements
- Verify exact error messages match specifications
- Test boundary conditions (minimum/maximum lengths, edge cases)
- Test invalid formats (username format, password format, image format)

### 5.2 Authorization Error Testing
- Test access to protected resources without authentication (should return 401)
- Test access to Rings user is not a member of (should return 403)
- Test operations on resources user doesn't own (where applicable)

### 5.3 Business Logic Error Testing
- Test duplicate operations (registering same username twice, creating Ring with existing name)
- Test operations on non-existent resources (login with non-existent username, add non-existent user to Ring)
- Test invalid state transitions (joining Ring already a member of, posting in Ring not a member of)

## 6. Performance and Timing

### 6.1 Response Time Validation
- News Feed loading: Must complete within 2 seconds
- Search operations: Must complete within 1 second
- General API calls: Must complete within 500ms
- Image uploads: Must complete within 2 seconds (excluding network transfer time)

### 6.2 Polling and Real-time Updates
- News Feed polling: Verify polling occurs every 30 seconds when screen is visible
- Ring Chat polling: Verify polling occurs every 30 seconds when screen is visible
- Verify new posts appear in News Feed after polling interval
- Verify new messages appear in Ring Chat after polling interval

## 7. Test Coverage Requirements

### 7.1 Happy Path Coverage
- All use cases must have at least one happy path test
- Happy path tests must cover the complete user journey from start to finish
- Critical path test must cover the complete end-to-end flow

### 7.2 Negative Case Coverage
- All validation rules must have negative test cases
- All error conditions must be tested
- All edge cases and boundary conditions must be tested

### 7.3 Edge Case Coverage
- Empty states (no Rings, no posts, no search results)
- Maximum values (5000 character messages, 10MB images, 100 character Ring names)
- Minimum values (1 character messages, 1 character Ring names, 3 character usernames)
- Special characters and unicode in text inputs

## 8. Test Isolation and Independence

### 8.1 Test Independence
- Each test must be independent and not rely on other tests
- Tests must not share state or data
- Tests must be executable in any order
- Tests must be executable individually or as part of a suite

### 8.2 Cleanup Requirements
- Tests that create data must clean up after themselves (or use test database that is reset)
- Tests must not leave the system in an invalid state
- Test data must not interfere with other tests

## 9. Browser and Device Testing

### 9.1 Browser Compatibility
- Tests must be executable in modern browsers (Chrome, Firefox, Safari, Edge)
- Tests must verify responsive design on mobile viewports (minimum 320px width)
- Tests must verify touch interactions on mobile devices

### 9.2 Accessibility
- Tests must verify keyboard navigation works correctly
- Tests must verify screen reader compatibility (where applicable)
- Tests must verify form labels and ARIA attributes are present

## 10. Documentation Standards

### 10.1 Test Descriptions
- Test descriptions must be clear and unambiguous
- Test steps must be detailed enough for manual execution or automation
- Expected results must be specific and measurable

### 10.2 Test Data Documentation
- All test data values must be explicitly documented
- Test data must be realistic and representative of real-world usage
- Test data must include both valid and invalid examples

## 11. Test Execution Tools

### 11.1 Recommended Tools
- **Playwright**: For browser automation and E2E testing
- **Jest**: For unit and integration testing (referenced for consistency)
- **Test Database**: Isolated PostgreSQL database for test execution

### 11.2 Test Execution Flow
1. Setup: Initialize test environment, reset database, prepare test data
2. Execution: Perform test steps and actions
3. Validation: Assert expected results and behaviors
4. Cleanup: Restore system state, clean up test data

## 12. Common Patterns

### 12.1 Authentication Pattern
```
1. Navigate to Login screen
2. Enter valid username and password
3. Click Login button
4. Verify redirect to Home screen
5. Verify authentication token is set
```

### 12.2 Registration Pattern
```
1. Navigate to Login screen
2. Switch to Register tab/section
3. Enter unique username and valid password
4. Click Register button
5. Verify redirect to Home screen
6. Verify user is automatically logged in
```

### 12.3 Post Creation Pattern
```
1. Navigate to Ring Chat screen
2. Enter message text in input field
3. Optionally upload image file
4. Click Post button
5. Verify post appears in Ring Chat immediately
6. Navigate to Home screen
7. Verify post appears in News Feed
```

### 12.4 Search Pattern
```
1. Navigate to screen with search functionality
2. Enter search query in search bar
3. Verify results filter in real-time
4. Clear search query
5. Verify full list is restored
```

## 13. Error Message Validation

All error messages in tests must match exactly the error messages specified in functional requirements:

- **Registration Errors**:
  - "Username already exists"
  - "Username must be 3-50 characters and contain only letters, numbers, and underscores"
  - "Password must be at least 8 characters and contain at least one letter and one number"

- **Login Errors**:
  - "Invalid username or password"

- **Ring Creation Errors**:
  - "Ring name already exists. Please choose a different name."
  - "Ring name must be between 1 and 100 characters."

- **Post Creation Errors**:
  - "You are not a member of this Ring."
  - "Message cannot be empty."
  - "Message must be 5000 characters or less."
  - "Image file is too large. Maximum size is 10MB."
  - "Unsupported image format. Please use JPEG, PNG, or GIF."

- **Add User Errors**:
  - "You are not a member of this Ring."
  - "User '[username]' not found."
  - "User '[username]' is already a member of this Ring."

- **Join Ring Errors**:
  - "You are already a member of this Ring."
  - "Unable to join Ring. Please try again."

- **General Errors**:
  - "Unable to load news feed. Please try again."
  - "Unable to load settings. Please try again."
  - "Unable to logout. Please try again."

## 14. Empty State Messages

All empty state messages in tests must match exactly the messages specified in functional requirements:

- News Feed: "No posts yet. Join or create a Ring to see posts here."
- My Rings: "You haven't joined any Rings yet. Create or find a Ring to get started."
- Ring Chat: "No messages yet. Be the first to post!"
- Search Results: "No posts found for '[search query]'" or "No Rings found matching '[search query]'"

## 15. Test Maintenance

### 15.1 Test Updates
- Tests must be updated when functional requirements change
- Tests must be updated when error messages change
- Tests must be updated when UI elements or navigation flow changes

### 15.2 Test Review
- All tests must be reviewed for completeness and accuracy
- Tests must be validated against current functional specifications
- Tests must be validated against current screen specifications
