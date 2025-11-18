# End-to-End Testing Rules

This document defines general rules and guidelines that apply to all end-to-end test cases for the Rings platform.

## Testing Framework

All end-to-end tests are written for **Playwright** framework. Tests should use Playwright's browser automation API, page object model, and assertion capabilities.

## Test Structure

Each test file should follow this structure:
- **Test Scenario Name**: Clear, descriptive name
- **Description**: Overview of what the test validates
- **Prerequisites**: Required state before test execution
- **Test Steps**: Detailed, step-by-step instructions with no room for interpretation
- **Expected Results**: Specific outcomes for each step
- **UI Elements**: References to specific UI components from screen specifications
- **Error Cases**: Negative test scenarios (where applicable)

## Test Data Requirements

- Tests must use isolated test data to avoid dependencies between tests
- Test users, Rings, and posts should be created and cleaned up within test execution
- Use unique identifiers (timestamps, UUIDs) to avoid naming conflicts
- Test data should be realistic but clearly identifiable as test data

## Authentication and Session Management

- Tests must handle authentication state properly
- Login/registration steps should be explicit in test scenarios
- Session tokens should be validated where relevant
- Logout should clear all session data

## UI Element References

- All UI elements must reference specific components from screen specifications:
  - `04-01-general-layout-and-authentication.md`
  - `04-02-content-screens.md`
  - `04-03-discovery-and-settings.md`
- Use exact field names, button labels, and placeholder text as specified
- Reference specific screen layouts and component positions

## Navigation and Routing

- Tests must validate navigation flows between screens
- Footer navigation buttons must be tested for correct routing
- Deep linking to specific Rings should be validated
- Browser back/forward button behavior should be considered

## Error Handling

- All error messages must match exact text from functional specifications
- Error states must be validated (empty states, no results, validation errors)
- Network error scenarios should be tested where applicable
- Invalid input validation must be comprehensive

## Real-time Updates

- Tests should account for polling mechanisms (30-second maximum interval)
- News Feed updates should be validated after post creation
- Chat updates should be validated after new messages
- Consider timing when validating real-time content

## Image Upload Testing

- Test image uploads with valid formats (JPEG, PNG, GIF)
- Test file size limits (10MB maximum)
- Test invalid file formats
- Validate image display in posts and News Feed
- Test image preview functionality

## Search Functionality

- All search operations use case-insensitive partial matching
- Search should work in real-time as user types
- Empty search queries should restore full lists
- No results states must be validated

## Data Validation

- Username validation: 3-50 characters, alphanumeric and underscores only
- Password validation: minimum 8 characters, at least one letter and one number
- Ring name validation: 1-100 characters
- Message text validation: 1-5000 characters
- All validation error messages must match specifications exactly

## Test Execution Environment

- Tests should be executable in isolated environments
- Database state should be reset between test runs
- File system should be cleaned up after image upload tests
- Tests should not depend on external services or network conditions

## Assertions and Validations

- Every test step must have a corresponding assertion
- UI visibility and content must be validated
- API responses should be validated where applicable
- Data persistence must be verified (create, read, update operations)

## Test Independence

- Each test should be independent and executable in isolation
- Tests should not rely on execution order
- Shared test data should be created within each test
- Cleanup should be performed even if tests fail

## Performance Considerations

- Tests should validate performance requirements where applicable:
  - News Feed loads within 2 seconds
  - Search operations return within 1 second
- Timeouts should be configured appropriately
- Loading indicators should be validated

## Accessibility and Responsiveness

- Tests should validate UI elements are accessible
- Responsive design should be tested on different viewport sizes
- Touch interactions should be validated for mobile scenarios

## Test Documentation

- Test steps must be detailed enough for implementation without interpretation
- All references to functional requirements must include section numbers (e.g., "3.1 User Registration")
- Screen layout references must include section numbers (e.g., "4.2 Login Screen")
- Expected behaviors must be unambiguous

## Negative Test Cases

- All use cases (except critical path) must include both positive and negative test cases
- Negative cases should cover:
  - Invalid input validation
  - Unauthorized access attempts
  - Duplicate resource creation
  - Non-existent resource access
  - Boundary conditions
  - Error message validation

## Critical Path Test

- The critical path test (01-critical-path.md) covers ONLY the happy path
- No negative test cases should be included in the critical path
- The critical path validates the complete user journey from registration to content consumption
