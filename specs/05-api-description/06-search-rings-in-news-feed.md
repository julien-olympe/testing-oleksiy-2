# Search Rings in News Feed

**Endpoint**: `GET /api/news-feed?ringName=<query>`

**Description**: Searches for posts in the News Feed by filtering to show only posts from Rings whose names match the search query. This is the same endpoint as View News Feed but with the `ringName` query parameter.

**Authentication**: Required

**Query Parameters**:
- `ringName` (required, string): Search query to filter Ring names (case-insensitive partial matching). Minimum 1 character.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`): Same as View News Feed

**Status Codes**:
- `200 OK`: Filtered News Feed retrieved successfully (may be empty array)
- `400 Bad Request`: Invalid query parameter
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Search query must be at least 1 character" }` - Empty search query
- `500 Internal Server Error`: `{ "error": "Unable to load news feed. Please try again." }` - API request failed

**Processing**:
1. Validate user authentication token/session
2. Validate search query is not empty (minimum 1 character)
3. Perform case-insensitive partial matching on Ring names
4. Retrieve all Rings where user is a member AND Ring name contains search query
5. Retrieve all Posts from matching Rings, ordered by creation timestamp descending
6. Format Posts as News Tiles (same format as View News Feed)
7. Return filtered News Feed data

**Empty State**: If no Rings match or matching Rings have no posts, returns empty array. Frontend displays: "No posts found for '[search query]'"

**Performance Target**: 1 second
