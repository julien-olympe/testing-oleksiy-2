# View Ring Chat

**Endpoint**: `GET /api/rings/:id/chat`

**Description**: Retrieves all posts in a specific Ring's chat for the authenticated user. Posts are returned in chronological order (oldest first). The user must be a member of the Ring to access the chat.

**Authentication**: Required

**Path Parameters**:
- `id` (required, string, UUID): The Ring ID to view chat for

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface RingChatResponse {
  ring: {
    id: string; // UUID
    name: string;
    created_at: string; // ISO 8601 timestamp
  };
  posts: Array<{
    id: string; // UUID
    user_id: string; // UUID
    author_username: string;
    message_text: string; // Full text, not truncated
    image_url: string | null; // URL or file path, null if no image
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "ring": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Talk",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "posts": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "author_username": "johndoe",
      "message_text": "This is a full post message that is not truncated.",
      "image_url": "/uploads/images/post-123.jpg",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Ring Chat retrieved successfully (may have empty posts array)
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: User is not a member of this Ring
- `404 Not Found`: Ring does not exist
- `500 Internal Server Error`: Server error

**Error Responses**:
- `403 Forbidden`: `{ "error": "You are not a member of this Ring." }` - User tries to access Ring they don't belong to
- `404 Not Found`: `{ "error": "Ring not found." }` - Ring ID does not exist

**Processing**:
1. Validate user authentication token/session
2. Validate Ring ID format (UUID)
3. Retrieve Ring record from database
4. If Ring does not exist, return 404
5. Verify user is a member of the specified Ring (check Membership record)
6. If user is not a member, return 403
7. Retrieve Ring details (name, creation date)
8. Retrieve all Posts for that Ring, ordered by creation timestamp ascending (oldest first)
9. For each Post, retrieve author username
10. Format each Post with full message text (not truncated), picture URL, author username, creation timestamp
11. Return Ring Chat data

**Empty State**: If Ring has no posts, returns empty array `{ "posts": [] }`. Frontend displays: "No messages yet. Be the first to post!"

**Performance Target**: 500ms
