# View My Rings List

**Endpoint**: `GET /api/rings`

**Description**: Retrieves a list of all Rings the authenticated user is a member of. Each Ring includes the name (ellipsized to 20 characters if longer) and the member count.

**Authentication**: Required

**Query Parameters**:
- `search` (optional, string): Filter Rings by name (case-insensitive partial matching). If not provided, returns all user's Rings.

**Request Schema**: No request body required

**Response Schema** (Status: `200 OK`):
```typescript
interface MyRingsResponse {
  rings: Array<{
    id: string; // UUID
    name: string; // Truncated to 20 characters with ellipsis if longer
    member_count: number;
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
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "name": "Very Long Ring Name Th...",
      "member_count": 8,
      "created_at": "2024-01-14T09:20:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Rings list retrieved successfully (may be empty array)
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Processing**:
1. Validate user authentication token/session
2. Retrieve all Rings where user is a member (Membership records)
3. If `search` query parameter provided, filter Rings by name (case-insensitive partial matching)
4. For each Ring, count total members (Membership records for that Ring)
5. Format each Ring:
   - Include Ring id, name, member_count, created_at
   - Truncate name to 20 characters with ellipsis if longer
6. Return Rings list data

**Empty State**: If user has no Rings, returns empty array `{ "rings": [] }`. Frontend displays: "You haven't joined any Rings yet. Create or find a Ring to get started."

**Performance Target**: 500ms
