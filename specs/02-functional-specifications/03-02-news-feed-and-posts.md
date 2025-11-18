# 3. Functional Requirements - Part 2: News Feed and Posts

This section details News Feed viewing and post creation use cases for the Rings platform. Each use case follows a structured format describing the name, description, actors, inputs, processing, and outputs.

## 3.3 View News Feed

**Name**: View News Feed

**Description**: The authenticated user views the News Feed on the Home screen, which displays posts from all Rings the user is a member of. Posts are displayed in reverse chronological order (newest first) as News Tiles showing Ring name, post picture (if any), and first 100 characters of message text.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- User authentication token: From session
- Page load or refresh: User action or automatic polling

**Processing/Actions**:
1. System validates user authentication token
2. System retrieves all Rings where user is a member (Membership records)
3. System retrieves all Posts from those Rings, ordered by creation timestamp descending
4. System formats each Post as a News Tile with:
   - Ring name
   - Post picture URL (if post has an image)
   - First 100 characters of message text (truncated with ellipsis if longer)
   - Post creation timestamp
5. System returns News Feed data to frontend
6. Frontend displays News Tiles in a scrollable list

**Outputs**:
- Success: News Feed displays with News Tiles showing posts from user's Rings
- Empty State: "No posts yet. Join or create a Ring to see posts here." - displayed if user has no Rings or Rings have no posts
- Error: "Unable to load news feed. Please try again." - displayed if API request fails

## 3.4 Search Rings in News Feed

**Name**: Search Rings in News Feed

**Description**: The user searches for a specific Ring by name in the News Feed search bar. The News Feed filters to show only posts from Rings whose names match the search query. If search query is cleared, the full News Feed is restored.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Search query: Text input from user in News Feed search bar (optional, can be empty)
- Real-time search: System searches as user types

**Processing/Actions**:
1. System receives search query from frontend
2. If search query is empty or cleared, system returns full News Feed (same as View News Feed)
3. If search query provided, system performs case-insensitive partial matching on Ring names
4. System retrieves all Rings where user is a member AND Ring name contains search query
5. System retrieves all Posts from matching Rings, ordered by creation timestamp descending
6. System formats Posts as News Tiles (same format as View News Feed)
7. System returns filtered News Feed data to frontend
8. Frontend updates News Feed display with filtered results

**Outputs**:
- Success: News Feed displays filtered News Tiles showing only posts from matching Rings
- No Results: "No posts found for '[search query]'" - displayed if search matches Rings but they have no posts, or if no Rings match
- Empty Query: Full News Feed is restored when search is cleared

## 3.8 View Ring Chat

**Name**: View Ring Chat

**Description**: The authenticated user views the Chat interface for a specific Ring they are a member of. The Chat displays all posts in that Ring in chronological order, showing the message text, picture (if any), author username, and timestamp. The user can see the input field to add new messages.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Ring id: From user clicking on a Ring item in My Rings list or from navigation
- User authentication token: From session

**Processing/Actions**:
1. System validates user authentication token
2. System verifies user is a member of the specified Ring (checks Membership record)
3. If user is not a member, access is denied
4. System retrieves Ring details (name, creation date)
5. System retrieves all Posts for that Ring, ordered by creation timestamp ascending (oldest first)
6. For each Post, system retrieves author username
7. System formats each Post with:
   - Message text (full text, not truncated)
   - Picture URL (if present)
   - Author username
   - Creation timestamp
8. System returns Ring Chat data to frontend
9. Frontend displays Chat interface with message history and input field

**Outputs**:
- Success: Ring Chat displays with all posts in chronological order
- Access Denied: "You are not a member of this Ring." - displayed if user tries to access Ring they don't belong to (should not happen through normal navigation)
- Empty State: "No messages yet. Be the first to post!" - displayed if Ring has no posts

## 3.9 Post Message in Ring

**Name**: Post Message in Ring

**Description**: The authenticated user creates a new post in a Ring they are a member of. The post contains message text and optionally includes a picture. Once posted, the post immediately appears in the Ring Chat and in the News Feed for all members of that Ring.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Ring id: From current Ring Chat screen context
- Message text: Text input from user (required, minimum 1 character, maximum 5000 characters)
- Picture file: Optional file upload from user (image file, maximum 10MB, supported formats: JPEG, PNG, GIF)
- Post button click: User action

**Processing/Actions**:
1. System validates user authentication token
2. System verifies user is a member of the specified Ring
3. If user is not a member, posting fails
4. System validates message text is not empty and meets length requirements
5. If picture is provided:
   - System validates file type and size
   - System uploads image file to storage (file system or cloud storage)
   - System stores image URL in database
6. System creates new Post record in database with:
   - ring_id
   - user_id (author)
   - message text
   - image URL (if picture was uploaded)
   - creation timestamp
7. System returns success response with new Post data
8. Frontend updates Ring Chat to show new post
9. Frontend triggers News Feed refresh for all Ring members (via polling)

**Outputs**:
- Success: New post appears in Ring Chat immediately, and will appear in News Feed for all Ring members
- Error: "You are not a member of this Ring." - displayed if user tries to post in Ring they don't belong to
- Error: "Message cannot be empty." - displayed if message text is empty
- Error: "Message must be 5000 characters or less." - displayed if message exceeds length limit
- Error: "Image file is too large. Maximum size is 10MB." - displayed if image exceeds size limit
- Error: "Unsupported image format. Please use JPEG, PNG, or GIF." - displayed if image format is invalid
