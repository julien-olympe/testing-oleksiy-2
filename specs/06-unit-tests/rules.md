# Unit Testing Rules and Conventions

This document defines general rules, conventions, mocking patterns, and test structure that apply to all unit tests in the Rings application.

## 1. General Testing Principles

### 1.1 Test Isolation
- All unit tests must be completely isolated from external dependencies
- Tests must not depend on real database connections, file system, or network calls
- Each test must be able to run independently and in any order
- Tests must not share state between test cases
- All external dependencies must be mocked

### 1.2 Test Naming Conventions
- Test files: Use `.test.ts` or `.spec.ts` suffix (e.g., `user-registration.test.ts`)
- Test suites: Use `describe()` blocks with descriptive names matching the function/component being tested
- Test cases: Use `test()` or `it()` with clear descriptions in the format: "should [expected behavior] when [condition]"
- Example: `test('should return error when username is already taken', ...)`

### 1.3 Test Structure (AAA Pattern)
All tests must follow the Arrange-Act-Assert pattern:
- **Arrange**: Set up test data, mocks, and preconditions
- **Act**: Execute the function/API being tested
- **Assert**: Verify expected outcomes and behaviors

### 1.4 Test Coverage Requirements
- Minimum code coverage: 80% for all business logic functions
- All error paths must be tested
- All edge cases and boundary conditions must be tested
- All validation rules must be tested
- Happy paths and failure scenarios must both be covered

## 2. Mocking Patterns

### 2.1 Database Mocking
- **Database Connection**: Mock the PostgreSQL connection pool using Jest mocks
- **Query Results**: Mock query results to return controlled test data
- **Transaction Mocking**: Mock transaction begin, commit, and rollback operations
- **Error Simulation**: Mock database errors (connection failures, constraint violations, query errors)

**Example Pattern**:
```typescript
const mockQuery = jest.fn();
const mockPool = {
  query: mockQuery,
  connect: jest.fn(),
  end: jest.fn()
};
jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool)
}));
```

### 2.2 Authentication Mocking
- **Token Validation**: Mock authentication middleware to simulate authenticated/unauthenticated states
- **Session Management**: Mock session storage and validation
- **Password Hashing**: Mock bcrypt functions (hash, compare) with controlled results
- **User Lookup**: Mock user retrieval from database for authentication

**Example Pattern**:
```typescript
jest.mock('bcrypt', () => ({
  hash: jest.fn((password, saltRounds, callback) => callback(null, 'hashed_password')),
  compare: jest.fn((password, hash, callback) => callback(null, true))
}));
```

### 2.3 File System Mocking
- **File Upload**: Mock multipart file parsing and file stream handling
- **File Storage**: Mock file system write operations
- **File Validation**: Mock file type and size validation
- **File Errors**: Mock file system errors (disk full, permission denied)

**Example Pattern**:
```typescript
jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
  unlink: jest.fn(),
  existsSync: jest.fn(() => true)
}));
```

### 2.4 HTTP Request/Response Mocking
- **Fastify Request**: Mock Fastify request objects with headers, body, params, query
- **Fastify Reply**: Mock Fastify reply objects (status, send, code methods)
- **Cookie Handling**: Mock cookie parsing and setting
- **Multipart Parsing**: Mock multipart form data parsing for file uploads

**Example Pattern**:
```typescript
const mockRequest = {
  headers: { authorization: 'Bearer token' },
  body: { username: 'testuser', password: 'password123' },
  params: { id: 'ring-uuid' },
  cookies: { sessionId: 'session-uuid' }
};
const mockReply = {
  code: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  setCookie: jest.fn()
};
```

### 2.5 External Service Mocking
- **Rate Limiting**: Mock rate limit checking and tracking
- **Logging**: Mock logging functions to avoid console output in tests
- **Time/Date**: Mock Date and timestamp functions for consistent test results

## 3. Test Data Management

### 3.1 Test Data Factories
- Use factory functions or fixtures to create consistent test data
- Test data must be realistic but clearly identifiable as test data
- Avoid hardcoding test data in individual tests; use shared fixtures

**Example Pattern**:
```typescript
const createTestUser = (overrides = {}) => ({
  id: 'user-uuid-1',
  username: 'testuser',
  password_hash: 'hashed_password',
  created_at: new Date('2024-01-01'),
  ...overrides
});
```

### 3.2 Mock Data Setup
- Each test should set up its own mock data
- Use `beforeEach()` to reset mocks between tests
- Use `afterEach()` to clean up test data and reset mocks
- Mock data should match expected database schema structure

### 3.3 Test Data Cleanup
- All test data must be cleaned up after tests complete
- Mocks must be reset between tests to prevent test interference
- No test data should persist between test runs

## 4. Assertion Patterns

### 4.1 Success Assertions
- Verify correct return values and response structures
- Verify correct database operations were called
- Verify correct HTTP status codes (200, 201)
- Verify response data matches expected format

### 4.2 Error Assertions
- Verify correct error messages are returned
- Verify correct HTTP status codes for errors (400, 401, 403, 404, 500)
- Verify error handling does not expose sensitive information
- Verify database rollback on errors (for transactions)

### 4.3 Side Effect Assertions
- Verify database queries were called with correct parameters
- Verify file operations were performed correctly
- Verify authentication/session operations were executed
- Verify no unintended side effects occurred

## 5. Edge Cases and Boundary Testing

### 5.1 Boundary Value Testing
All boundary conditions must be tested:
- **Minimum values**: Test values at the lower boundary (e.g., username 3 chars, password 8 chars)
- **Maximum values**: Test values at the upper boundary (e.g., username 50 chars, message 5000 chars)
- **Below minimum**: Test values just below minimum (e.g., username 2 chars, password 7 chars)
- **Above maximum**: Test values just above maximum (e.g., username 51 chars, message 5001 chars)
- **Empty values**: Test empty strings, null, undefined
- **Zero values**: Test zero counts, empty arrays

### 5.2 Input Validation Testing
- Test all invalid input formats
- Test missing required fields
- Test incorrect data types
- Test SQL injection attempts (should be safely handled)
- Test XSS attempts (should be sanitized)

### 5.3 Database Constraint Testing
- Test unique constraint violations (duplicate username, duplicate ring name)
- Test foreign key constraint violations (invalid user_id, invalid ring_id)
- Test NOT NULL constraint violations
- Test database connection failures
- Test transaction rollback scenarios

## 6. Error Condition Testing

### 6.1 Authentication Errors
- Invalid or missing authentication tokens
- Expired sessions
- Invalid credentials (wrong username/password)
- Unauthorized access attempts

### 6.2 Validation Errors
- Invalid input formats
- Missing required fields
- Field length violations
- Invalid data types

### 6.3 Database Errors
- Connection failures
- Query execution errors
- Constraint violations
- Transaction failures

### 6.4 File System Errors
- File upload failures
- Invalid file types
- File size limit exceeded
- Disk space errors

## 7. Performance and Limit Testing

### 7.1 Concurrent User Testing
- Test maximum concurrent users (1000)
- Test database connection pool limits (20-100 connections)
- Test rate limiting boundaries
- Test concurrent request handling

### 7.2 File Size Limits
- Test maximum file size (10MB images)
- Test file size validation at boundaries (9.9MB, 10MB, 10.1MB)
- Test multiple file uploads

### 7.3 Text Length Limits
- Test maximum message length (5000 characters)
- Test maximum ring name length (100 characters)
- Test maximum username length (50 characters)
- Test text truncation at boundaries

### 7.4 Database Query Limits
- Test queries with large result sets
- Test pagination (if implemented)
- Test query performance with indexes

## 8. Test Organization

### 8.1 Test File Structure
```
src/
  __tests__/
    unit/
      auth/
        user-registration.test.ts
        user-login.test.ts
        logout.test.ts
      rings/
        create-ring.test.ts
        view-my-rings.test.ts
        join-ring.test.ts
      posts/
        post-message.test.ts
        view-ring-chat.test.ts
      news-feed/
        view-news-feed.test.ts
        search-news-feed.test.ts
```

### 8.2 Test Suite Organization
- Group related tests in `describe()` blocks
- Use nested `describe()` blocks for different scenarios
- Use `beforeAll()` for one-time setup
- Use `beforeEach()` for per-test setup
- Use `afterEach()` for per-test cleanup
- Use `afterAll()` for one-time cleanup

### 8.3 Test Categories
- **Happy Path Tests**: Test successful execution of normal use cases
- **Error Tests**: Test error handling and error responses
- **Edge Case Tests**: Test boundary conditions and edge cases
- **Validation Tests**: Test input validation and business rules
- **Integration Tests**: Test interaction between multiple functions (still isolated with mocks)

## 9. Mock Requirements Summary

### 9.1 Required Mocks for All Tests
- Database connection pool (pg.Pool)
- Authentication middleware
- File system operations (if applicable)
- HTTP request/response objects
- External service calls

### 9.2 Mock Reset Requirements
- All mocks must be reset in `beforeEach()` or `afterEach()`
- Mock implementations must be cleared between tests
- Mock call counts must be reset
- Mock return values must be reset

### 9.3 Mock Verification
- Verify mocks were called with correct parameters
- Verify mocks were called the expected number of times
- Verify mocks were not called when they shouldn't be
- Verify mock return values are used correctly

## 10. Test Execution Requirements

### 10.1 Test Speed
- Unit tests must complete in under 5 seconds total
- Individual tests should complete in milliseconds
- No real I/O operations (database, file system, network)

### 10.2 Test Reliability
- Tests must be deterministic (same input = same output)
- Tests must not depend on external state
- Tests must not have race conditions
- Tests must be repeatable

### 10.3 Test Independence
- Tests must not depend on execution order
- Tests must not share mutable state
- Each test must be able to run in isolation
- Tests must be able to run in parallel

## 11. Special Test Cases

### 11.1 Health Check Test
- Simple test that always passes
- Used to verify test framework is working
- No mocks required
- Minimal implementation

### 11.2 Transaction Tests
- Test transaction begin, commit, rollback
- Test transaction isolation
- Test rollback on errors
- Test nested transactions (if applicable)

### 11.3 Concurrent Operation Tests
- Test race conditions in membership creation
- Test concurrent post creation
- Test concurrent ring creation
- Use proper synchronization in mocks

## 12. Documentation Requirements

### 12.1 Test Documentation
- Each test must have a clear description
- Complex test logic must have comments
- Test data must be clearly labeled
- Mock setup must be documented

### 12.2 Test Specification Format
Each test specification must include:
- Test name and description
- Function/API being tested
- Test setup and mock data
- Test steps with specific inputs
- Expected outputs/assertions
- Edge cases and error scenarios
- Mock requirements

## 13. Best Practices

### 13.1 Test Maintainability
- Keep tests simple and focused
- Avoid complex test logic
- Use helper functions for common test operations
- Refactor tests when code changes

### 13.2 Test Readability
- Use descriptive test names
- Use clear variable names
- Group related assertions
- Add comments for complex scenarios

### 13.3 Test Efficiency
- Reuse test data factories
- Minimize mock setup code
- Use shared test utilities
- Avoid redundant test cases
