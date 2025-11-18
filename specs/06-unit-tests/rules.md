# Unit Test Rules and Guidelines

This document defines general rules and guidelines that apply to all unit test cases in the Rings application.

## 1. Testing Framework

**Framework**: Jest (latest version)
- All tests must be written using Jest testing framework
- Tests must use Jest's `describe()`, `test()`, and `expect()` APIs
- Test files must follow naming convention: `*.test.ts` or `*.spec.ts`
- Test files should be co-located with source code or in dedicated `__tests__` directories

## 2. Test Structure

**Test Organization**:
- Each test file must contain a `describe()` block for the feature/functionality being tested
- Individual test cases must use `test()` or `it()` functions
- Tests must be organized into logical groups using nested `describe()` blocks when appropriate
- Test names must be descriptive and clearly indicate what is being tested

**Test Naming Convention**:
- Test names must follow pattern: "should [expected behavior] when [condition]"
- Example: "should return user data when valid credentials are provided"
- Test names must be in English and use present tense

## 3. Test Setup and Teardown

**Setup Requirements**:
- Each test file must include proper setup using `beforeAll()`, `beforeEach()`, `afterAll()`, `afterEach()` hooks
- Database connections must be mocked or use test database
- Authentication tokens must be mocked or generated for test scenarios
- Test data must be isolated and not interfere with other tests
- Each test must be independent and able to run in isolation

**Teardown Requirements**:
- All test data must be cleaned up after each test
- Database transactions must be rolled back after each test
- Mock functions must be reset between tests
- File system changes (image uploads) must be cleaned up

## 4. Test Data

**Test Data Guidelines**:
- Test data must follow data structure specifications from `03-technical-specifications/01-data-structure-specification.md`
- Test data must be realistic and representative of production scenarios
- Test data must include valid boundary cases (minimum, maximum lengths)
- Test data must include invalid cases (empty, too long, invalid formats)
- UUIDs must be valid UUID v4 format
- Timestamps must be valid ISO 8601 format

**Mock Data**:
- Database operations must be mocked using Jest mocks
- External services must be mocked
- File system operations must be mocked
- Authentication tokens must be mocked or generated for testing

## 5. Test Coverage Requirements

**Coverage Types**:
- **Happy Path Tests**: Test successful execution of use cases with valid inputs
- **Boundary Tests**: Test minimum and maximum values, edge cases
- **Validation Tests**: Test input validation rules (length, format, required fields)
- **Error Tests**: Test error handling, exception scenarios, failure cases
- **Security Tests**: Test authentication, authorization, input sanitization
- **Integration Tests**: Test interactions between components (when applicable)

**Coverage Requirements**:
- All use cases from functional specifications must have corresponding tests
- All API endpoints must have tests for success and error scenarios
- All validation rules must be tested
- All error conditions must be tested
- All security requirements must be tested

## 6. Assertions

**Assertion Requirements**:
- All tests must include explicit assertions using `expect()`
- Assertions must verify both success and failure scenarios
- Assertions must check response status codes, response bodies, and data structures
- Assertions must verify error messages match specifications
- Assertions must verify database state when applicable

**Assertion Patterns**:
- Use `expect().toBe()` for primitive value equality
- Use `expect().toEqual()` for object/array equality
- Use `expect().toMatchObject()` for partial object matching
- Use `expect().toThrow()` for error testing
- Use `expect().toHaveLength()` for array/string length
- Use `expect().toBeTruthy()` / `expect().toBeFalsy()` for boolean checks

## 7. Mocking Guidelines

**What to Mock**:
- Database operations (queries, transactions)
- File system operations (image uploads, file storage)
- External API calls (if any)
- Authentication/session management
- Time-dependent operations (use Jest fake timers)

**What NOT to Mock**:
- Business logic functions (test actual implementation)
- Data transformation functions
- Validation functions (test actual validation logic)

**Mock Implementation**:
- Use `jest.mock()` for module mocking
- Use `jest.spyOn()` for function spying
- Use `jest.fn()` for function mocking
- Mocks must return realistic data structures matching specifications

## 8. Error Testing

**Error Test Requirements**:
- All error conditions from functional specifications must be tested
- Error responses must match specified HTTP status codes (400, 401, 403, 404, 500)
- Error messages must match specifications exactly
- Error handling from `04-01-reliability-and-fault-tolerance.md` must be tested
- Database constraint violations must be tested
- Validation failures must be tested

**Error Test Patterns**:
- Test invalid input formats
- Test missing required fields
- Test boundary violations (too short, too long)
- Test duplicate values (usernames, ring names)
- Test non-existent resources
- Test unauthorized access attempts
- Test authentication failures

## 9. Security Testing

**Security Test Requirements**:
- Password hashing must be tested (bcrypt with 10+ salt rounds)
- Authentication token validation must be tested
- Authorization checks must be tested (users can only access their own data)
- Input validation must be tested (SQL injection, XSS prevention)
- Session management must be tested
- CORS configuration must be tested (when applicable)

**Security Test Patterns**:
- Test password is never stored in plain text
- Test authentication tokens are validated
- Test unauthorized access returns 401/403
- Test input sanitization prevents injection attacks
- Test session expiration and invalidation

## 10. Performance Considerations

**Performance Test Requirements**:
- Tests must execute quickly (individual tests should complete in < 1 second)
- Database operations must use mocks or in-memory databases
- File operations must use mocks or temporary directories
- Tests must not make actual network requests
- Tests must not block on I/O operations unnecessarily

## 11. Test Documentation

**Documentation Requirements**:
- Each test must have a clear description in the test name
- Complex test scenarios must include comments explaining the test purpose
- Test data must be clearly labeled and documented
- Expected results must be documented in assertions

## 12. Test Execution

**Execution Requirements**:
- All tests must be executable independently
- Tests must not depend on execution order
- Tests must not have side effects on other tests
- Tests must be deterministic (same input always produces same output)
- Tests must be repeatable

## 13. Test Maintenance

**Maintenance Guidelines**:
- Tests must be updated when specifications change
- Tests must be refactored when code is refactored
- Failing tests must be fixed or removed (with documentation)
- Tests must follow DRY (Don't Repeat Yourself) principles
- Common test utilities should be extracted to shared test helpers

## 14. Test Data Cleanup

**Cleanup Requirements**:
- All test data must be removed after test execution
- Database test records must be deleted or rolled back
- Temporary files must be deleted
- Mock functions must be reset
- Test isolation must be maintained

## 15. Reference Documents

When creating tests, reference the following specification documents:
- `02-functional-specifications/` - For use case requirements and expected behaviors
- `03-technical-specifications/01-data-structure-specification.md` - For data structures and constraints
- `03-technical-specifications/04-01-reliability-and-fault-tolerance.md` - For error handling requirements
- `03-technical-specifications/04-02-security.md` - For security requirements
- `03-technical-specifications/02-02-software-software-interface.md` - For API and framework details
