# Post Message in Ring

**Endpoint**: `POST /api/rings/:id/posts`

**Description**: Creates a new post in a Ring the authenticated user is a member of. The post contains message text and optionally includes a picture. Once posted, the post immediately appears in the Ring Chat and in the News Feed for all members of that Ring.

**Authentication**: Required

**Path Parameters**:
- `id` (required, string, UUID): The Ring ID to post in

**Request Schema**:
```typescript
// Request uses multipart/form-data for file uploads
interface PostMessageRequest {
  message_text: string; // 1-5000 characters, required
  image?: File; // Optional image file (JPEG, PNG, GIF, max 10MB)
}
```

**Request Body**: `multipart/form-data` with fields:
- `message_text`: Text string (required)
- `image`: File upload (optional)

**Response Schema** (Status: `201 Created`):
```typescript
interface PostMessageResponse {
  post: {
    id: string; // UUID
    ring_id: string; // UUID
    user_id: string; // UUID
    author_username: string;
    message_text: string; // Full text
    image_url: string | null; // URL or file path, null if no image
    created_at: string; // ISO 8601 timestamp
  };
}
```

**Response Body Example**:
```json
{
  "post": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "ring_id": "770e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "author_username": "johndoe",
    "message_text": "This is a new post message.",
    "image_url": "/uploads/images/post-123.jpg",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `201 Created`: Post created successfully
- `400 Bad Request`: Validation error (see error messages below)
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: User is not a member of this Ring
- `404 Not Found`: Ring does not exist
- `500 Internal Server Error`: Server error

**Error Responses**:
- `400 Bad Request`: `{ "error": "Message cannot be empty." }` - Message text is empty
- `400 Bad Request`: `{ "error": "Message must be 5000 characters or less." }` - Message exceeds length limit
- `400 Bad Request`: `{ "error": "Image file is too large. Maximum size is 10MB." }` - Image exceeds size limit
- `400 Bad Request`: `{ "error": "Unsupported image format. Please use JPEG, PNG, or GIF." }` - Invalid image format
- `403 Forbidden`: `{ "error": "You are not a member of this Ring." }` - User tries to post in Ring they don't belong to
- `404 Not Found`: `{ "error": "Ring not found." }` - Ring ID does not exist

**Input Validation Rules**:
- Message text: Required, 1-5000 characters, cannot be empty
- Image file: Optional, maximum 10MB, supported formats: JPEG, PNG, GIF
- File type validation must occur before file processing
- File size validation must occur before file storage attempt

**Processing**:
1. Validate user authentication token/session
2. Validate Ring ID format (UUID)
3. Retrieve Ring record from database
4. If Ring does not exist, return 404
5. Verify user is a member of the specified Ring (check Membership record)
6. If user is not a member, return 403
7. Validate message text is not empty and meets length requirements
8. If picture is provided:
   - Validate file type (JPEG, PNG, GIF)
   - Validate file size (max 10MB)
   - Upload image file to local filesystem storage
   - Generate image URL/path
9. Create new Post record in database with ring_id, user_id, message_text, image_url (if provided), creation timestamp (within transaction)
10. Retrieve author username
11. Return success response with new Post data

**Performance Target**: 
- Text-only post: 500ms
- Post with image: 2 seconds (includes image upload and processing)
