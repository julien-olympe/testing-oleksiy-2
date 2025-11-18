# Logout

**Endpoint**: `POST /api/auth/logout`

**Description**: Logs out the authenticated user by invalidating their session. The session cookie is cleared and the user must authenticate again to access the platform.

**Authentication**: Required

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface LogoutResponse {
  message: string;
}
```

**Response Body Example**:
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200 OK`: Logout successful, session cookie cleared
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error during logout

**Error Responses**:
- `500 Internal Server Error`: `{ "error": "Unable to logout. Please try again." }` - API request failed (user is still logged out on client side)

**Processing**:
1. Validate user authentication token/session
2. Invalidate the user's session on server
3. Clear session data on server
4. Clear session cookie on client
5. Return success response

**Performance Target**: 500ms
