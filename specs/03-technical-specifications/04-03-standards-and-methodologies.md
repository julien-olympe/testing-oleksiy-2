# 4.3 Standards and Methodologies

This document defines development standards, methodologies, and best practices for the Rings application.

## 4.3.1 Programming Language and Type Safety

**TypeScript**:
- All code must be written in TypeScript (both frontend and backend)
- Type definitions must be defined for all data structures
- API request/response types must be defined using TypeScript interfaces
- Database models must have TypeScript type definitions
- No use of `any` type except where absolutely necessary (with justification)
- Strict TypeScript compiler options enabled: strict mode, no implicit any

## 4.3.2 API Design Standards

**RESTful API Design**:
- All API endpoints must follow RESTful conventions
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- URL structure: /api/v1/resource or /api/resource (e.g., /api/rings, /api/posts)
- Resource naming: Plural nouns (rings, posts, users, memberships)
- Status codes: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- Response format: JSON for all responses
- Error responses: JSON with error message field

**API Endpoint Examples**:
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/news-feed - Get news feed
- GET /api/rings - Get user's rings
- POST /api/rings - Create ring
- GET /api/rings/:id/chat - Get ring chat messages
- POST /api/rings/:id/posts - Create post in ring
- GET /api/rings/search?q=query - Search rings
- POST /api/rings/:id/members - Add user to ring
- POST /api/rings/:id/join - Join ring

## 4.3.3 Database Standards

**PostgreSQL Relational Database**:
- All data must be stored in PostgreSQL database
- Database schema must be normalized (third normal form minimum)
- Foreign key constraints must be enforced at database level
- Unique constraints must be enforced at database level
- Indexes must be created for all foreign keys and frequently queried fields
- Database migrations must be version-controlled and reversible

**Database Naming Conventions**:
- Table names: Plural, lowercase, snake_case (users, rings, posts, memberships)
- Column names: Singular, lowercase, snake_case (id, username, password_hash, created_at)
- Primary keys: Always named `id`, type UUID
- Foreign keys: Named as `{referenced_table}_id` (e.g., user_id, ring_id)
- Indexes: Named as `idx_{table}_{column}` or `idx_{table}_{columns}`

## 4.3.4 Version Control

**Git Version Control**:
- All code must be version-controlled using Git
- Commit messages must be descriptive and follow conventional commit format
- Feature branches must be used for development
- Main/master branch must always be in deployable state
- No direct commits to main/master branch (use pull requests)

## 4.3.5 Code Quality and Formatting

**ESLint**:
- ESLint must be configured for both frontend and backend
- ESLint rules must enforce code quality standards
- ESLint must be run as part of pre-commit hooks or CI/CD pipeline
- Code must pass ESLint checks before commit

**Prettier**:
- Prettier must be configured for code formatting
- Prettier must format TypeScript, JavaScript, JSON, and Markdown files
- Prettier configuration must be consistent across frontend and backend
- Code must be formatted with Prettier before commit

**Code Review**:
- All code changes must be reviewed before merging
- Code reviews must check for: Security issues, performance problems, code quality, test coverage

## 4.3.6 Testing Standards

**Jest Unit Testing**:
- All business logic must have unit tests
- Unit tests must cover: User registration, authentication, Ring creation, Post creation, Membership management
- Test coverage target: Minimum 80% code coverage
- Unit tests must be fast (complete in under 5 seconds)
- Unit tests must be isolated (no external dependencies)

**Playwright End-to-End Testing**:
- Critical user flows must have E2E tests
- E2E tests must cover: User registration and login, Ring creation, Posting messages, Joining Rings, News Feed viewing
- E2E tests must run in headless browser mode
- E2E tests must use test data that is cleaned up after tests

**Test Organization**:
- Unit tests: Co-located with source files or in `__tests__` directories
- E2E tests: Located in `e2e` or `tests/e2e` directory
- Test files: Named with `.test.ts` or `.spec.ts` suffix
- Test data: Use factories or fixtures for consistent test data creation
