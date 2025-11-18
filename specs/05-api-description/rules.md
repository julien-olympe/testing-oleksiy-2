# API Design Rules and Conventions

This document defines general rules, conventions, and patterns that apply to all APIs in the Rings application.

## 1. API Base Path

All API endpoints are prefixed with `/api/` to distinguish them from frontend routes.

**Example**: `/api/auth/login`, `/api/rings`, `/api/news-feed`

## 2. HTTP Methods

APIs follow RESTful conventions for HTTP methods:

- **GET**: Retrieve data (read operations)
- **POST**: Create new resources or perform actions
- **PUT**: Update existing resources (not used in initial version)
- **DELETE**: Delete resources (not used in initial version)

## 3. Request/Response Format

**Content-Type**: All API requests and responses use `application/json` unless specified otherwise (e.g., file uploads use `multipart/form-data`).

**Request Body**: JSON objects with camelCase field names.

**Response Body**: JSON objects with camelCase field names.

**Character Encoding**: UTF-8 for all text content.

## 4. Authentication

**Mechanism**: Session-based authentication using HTTP-only cookies with `@fastify/cookie` plugin.

**Cookie Configuration**:
- HTTP-only: `true` (prevents JavaScript access)
- Secure: `true` (HTTPS-only in production)
- SameSite: `strict` (CSRF protection)
- Expiration: 7 days of inactivity
- Path: `/`

**Session Validation**: All protected endpoints validate session on every request. Invalid or expired sessions return `401 Unauthorized`.

**Authentication Header**: Not used. All authentication is handled via session cookies.

## 5. Error Handling

**Error Response Format**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message"
  }
}
```

**HTTP Status Codes**:
- `200 OK`: Successful GET, PUT, DELETE requests
- `201 Created`: Successful POST request creating a new resource
- `400 Bad Request`: Invalid request data, validation errors
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized for the resource
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side errors

**Error Handling Pattern**:
- All endpoints wrap business logic in try-catch blocks
- Exceptions are caught and converted to appropriate HTTP error responses
- User-friendly error messages are returned (no technical details exposed)
- Technical error details are logged server-side only

**Error Logging**:
- All errors logged server-side with:
  - Timestamp
  - Error type
  - Error message
  - Stack trace
  - Request details (method, path, user ID if authenticated)
  - No sensitive data (passwords, tokens) in logs

## 6. Input Validation

**Validation Rules**:
- All input validation occurs server-side (client-side validation is for UX only)
- Validation errors return `400 Bad Request` with specific error messages
- Required fields must be present and non-empty
- String length limits are enforced
- Data types are validated (strings, numbers, UUIDs, etc.)
- File uploads validate file type and size

**Validation Error Response**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field-specific error message",
    "field": "fieldName"
  }
}
```

## 7. Response Structure

**Success Response**: Direct data object or array, no wrapper.

**Example**:
```json
{
  "id": "uuid",
  "name": "Ring Name",
  "memberCount": 15
}
```

**List Response**: Array of objects.

**Example**:
```json
[
  {
    "id": "uuid",
    "name": "Ring 1"
  },
  {
    "id": "uuid",
    "name": "Ring 2"
  }
]
```

## 8. Pagination

**Not Implemented**: Initial version does not implement pagination. All endpoints return complete result sets. Pagination may be added in future versions if performance requires it.

## 9. Rate Limiting

**Rate Limit Headers**: All responses include rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed in time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when rate limit resets

**Rate Limit Exceeded Response**: HTTP `429 Too Many Requests` with `Retry-After` header indicating seconds until retry is allowed.

**Rate Limit Rules** (per user/IP):
- Authentication endpoints: 5 requests per minute
- Post creation endpoints: 10 requests per minute
- Search endpoints: 20 requests per minute
- General API endpoints: 100 requests per minute

## 10. CORS Configuration

**CORS Policy**:
- Configured using `@fastify/cors` plugin
- Allowed origins: Specific domain(s) in production, `localhost` for development
- Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Allowed headers: `Content-Type`, `Authorization`, `Cookie`
- Credentials: `true` (cookies and authentication headers allowed)

## 11. Data Types

**UUID**: All IDs use UUID v4 format (e.g., `"550e8400-e29b-41d4-a716-446655440000"`).

**Timestamps**: ISO 8601 format (e.g., `"2024-01-15T10:30:00Z"`).

**Strings**: UTF-8 encoded, no null bytes.

**Numbers**: JSON numbers (integers or floats as appropriate).

**Booleans**: JSON boolean values (`true`/`false`).

## 12. File Uploads

**Content-Type**: `multipart/form-data` for file upload endpoints.

**File Validation**:
- File type validation (MIME type and file extension)
- File size validation (maximum 10MB for images)
- Supported formats: JPEG, PNG, GIF

**File Storage**: Images stored in local filesystem. Image URLs stored in database.

**File Response**: Image URLs returned as relative paths or absolute URLs depending on configuration.

## 13. Search and Filtering

**Query Parameters**: Search and filtering use query parameters (e.g., `?search=query`, `?q=query`).

**Search Behavior**:
- Case-insensitive partial matching
- Empty search query returns all results (no filtering)
- Search applies to relevant fields (e.g., Ring name)

## 14. Mockability

**Design Principle**: All APIs must be mockable for testing.

**Requirements**:
- No direct calls to external APIs
- All dependencies must be injectable/mockable
- Database access abstracted through repository/service layers
- File system access abstracted through service layers

## 15. Versioning

**Not Implemented**: Initial version does not implement API versioning. All endpoints use `/api/` prefix without version numbers. Versioning may be added in future versions if breaking changes are required.

## 16. Documentation Standards

**Endpoint Documentation Must Include**:
- HTTP method and full path
- Authentication requirements (protected/public)
- Request schema: field names, types, validation rules, required/optional status
- Response schema: field names, types, structure
- Status codes: all possible HTTP status codes
- Error responses: exact error message format
- Request/response examples in JSON format
- Rate limiting requirements

## 17. Testing Requirements

**API Documentation Must Support**:
- Test-driven development (TDD)
- No room for interpretation
- Exact field names and types specified
- All validation rules documented
- All error cases documented
- Request/response examples for all scenarios
