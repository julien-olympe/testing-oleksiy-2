# Find Ring (Search)

**Endpoint**: `GET /api/rings/search?q=<query>`

**Description**: Searches for Rings by name across the entire platform. Returns a list of Rings whose names match the search query, indicating which Rings the user is already a member of.

**Authentication**: Required

**Query Parameters**:
- `q` (required, string): Search query to match Ring names (case-insensitive partial matching). Minimum 1 character.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface FindRingResponse {
  rings: Array<{
    id: string; // UUID
    name: string;
    member_count: number;
    is_member: boolean; // Whether the authenticated user is a member
    created_at: string; // ISO 8601 timestamp
  }>;
}
```

**Response Body Example**:
```json
{
  "rings": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Talk",
      "member_count": 15,
      "is_member": true,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "990e8400-e29b-41d4-a716-446655440002",
      "name": "Tech News",
      "member_count": 42,
      "is_member": false,
      "created_at": "2024-01-10T08:15:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Search results retrieved successfully (may be empty array)
- `400 Bad Request`: Invalid query parameter
- `401 Unauthorized`: Missing or invalid authentication
- `429 Too Many Requests`: Rate limit exceeded (20 requests per minute per user)
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Please enter a search query." }` - Search query is empty

**Processing**:
1. Validate user authentication token/session
2. Validate search query is not empty (minimum 1 character)
3. Perform case-insensitive partial matching on Ring names
4. Retrieve all Rings whose names contain the search query
5. For each matching Ring:
   - Count total members
   - Check if user is a member (check Membership record)
6. Format each Ring with id, name, member_count, is_member flag, created_at
7. Return search results

**Empty State**: If no Rings match, returns empty array. Frontend displays: "No Rings found matching '[search query]'"

**Performance Target**: 1 second
