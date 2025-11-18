# Search My Rings

**Endpoint**: `GET /api/rings?search=<query>`

**Description**: Searches for Rings within the user's My Rings list by filtering to show only Rings whose names match the search query. This is the same endpoint as View My Rings List but with the `search` query parameter.

**Authentication**: Required

**Query Parameters**:
- `search` (optional, string): Search query to filter Ring names (case-insensitive partial matching). If empty or not provided, returns full My Rings list.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`): Same as View My Rings List

**Status Codes**:
- `200 OK`: Filtered Rings list retrieved successfully (may be empty array)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Processing**:
1. Validate user authentication token/session
2. If search query is empty or not provided, return full My Rings list (same as View My Rings List)
3. If search query provided, perform case-insensitive partial matching on Ring names
4. Retrieve all Rings where user is a member AND Ring name contains search query
5. For each matching Ring, count total members
6. Format Rings with name (ellipsized to 20 chars) and member count
7. Return filtered Rings list

**Empty State**: If no Rings match, returns empty array. Frontend displays: "No Rings found matching '[search query]'"

**Performance Target**: 1 second
