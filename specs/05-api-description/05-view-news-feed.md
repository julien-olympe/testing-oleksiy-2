# View News Feed

**Endpoint**: `GET /api/news-feed`

**Description**: Retrieves the News Feed for the authenticated user, displaying posts from all Rings the user is a member of. Posts are returned in reverse chronological order (newest first) as News Tiles.

**Authentication**: Required

**Query Parameters**:
- `ringName` (optional, string): Filter posts to only show posts from Rings whose names contain this query (case-insensitive partial matching). If not provided, returns all posts from user's Rings.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface NewsFeedResponse {
  posts: Array<{
    id: string; // UUID
    ring_id: string; // UUID
    ring_name: string;
    user_id: string; // UUID
    author_username: string;
    message_text: string; // First 100 characters, truncated with ellipsis if longer
    image_url: string | null; // URL or file path, null if no image
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "posts": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "ring_id": "770e8400-e29b-41d4-a716-446655440000",
      "ring_name": "Tech Talk",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "author_username": "johndoe",
      "message_text": "This is a post message that might be longer than 100 characters and will be truncated...",
      "image_url": "/uploads/images/post-123.jpg",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: News Feed retrieved successfully (may be empty array)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Error Responses**:
- `500 Internal Server Error`: `{ "error": "Unable to load news feed. Please try again." }` - API request failed

**Processing**:
1. Validate user authentication token/session
2. Retrieve all Rings where user is a member (Membership records)
3. If `ringName` query parameter provided, filter Rings by name (case-insensitive partial matching)
4. Retrieve all Posts from those Rings, ordered by creation timestamp descending
5. For each Post, retrieve author username
6. Format each Post as News Tile:
   - Include full post data
   - Truncate message_text to first 100 characters with ellipsis if longer
   - Include ring_name
7. Return News Feed data

**Empty State**: If user has no Rings or Rings have no posts, returns empty array `{ "posts": [] }`. Frontend displays: "No posts yet. Join or create a Ring to see posts here."

**Performance Target**: 2 seconds (for users with up to 50 Rings and up to 1000 posts total)
