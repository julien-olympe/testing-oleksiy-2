# Functional Requirements (Continued)

## Messaging Use Cases

**Use Case: Post Message (Text Only)**
- **Description:** An authenticated user creates a text-only post within a Ring they are a member of. The system validates the input, creates the post, and makes it visible in the Ring Chat and News Feed.
- **Actors Involved:** Authenticated User (primary actor), Ring (secondary actor)
- **Inputs and Their Sources:**
  - Message text (from user input via Ring Chat screen text input field)
  - Ring ID (from current Ring Chat screen context)
  - User ID (from authenticated session)
- **Processing / Actions:**
  1. System receives post submission from Ring Chat screen
  2. System validates user is a member of the Ring
  3. System validates message text is not empty
  4. System creates Post record in PostgreSQL database with text content
  5. System associates Post with Ring and User
  6. System updates Ring Chat screen to display new post
  7. System makes post available for News Feed aggregation
- **Outputs:**
  - Success: Post created, displayed in Ring Chat, available in News Feed
  - Error: "You are not a member of this Ring" message if user lacks membership
  - Error: "Message cannot be empty" message if text is empty

**Use Case: Post Message with Picture**
- **Description:** An authenticated user creates a post with both text and an image attachment within a Ring they are a member of. The system validates inputs, stores the image on local filesystem, creates the post with image reference, and makes it visible in Ring Chat and News Feed.
- **Actors Involved:** Authenticated User (primary actor), Ring (secondary actor)
- **Inputs and Their Sources:**
  - Message text (from user input via Ring Chat screen text input field, optional)
  - Image file (from user file selection via Ring Chat screen image upload button)
  - Ring ID (from current Ring Chat screen context)
  - User ID (from authenticated session)
- **Processing / Actions:**
  1. System receives post submission with image from Ring Chat screen
  2. System validates user is a member of the Ring
  3. System validates image file format (JPEG, PNG, GIF)
  4. System saves image file to local filesystem storage
  5. System generates unique filename and stores file path reference
  6. System creates Post record in PostgreSQL database with text (if provided) and image file path
  7. System associates Post with Ring and User
  8. System updates Ring Chat screen to display new post with image
  9. System makes post available for News Feed aggregation
- **Outputs:**
  - Success: Post with image created, displayed in Ring Chat, available in News Feed
  - Error: "You are not a member of this Ring" message if user lacks membership
  - Error: "Invalid image format" message if file is not a supported image type
  - Error: "Image upload failed" message if filesystem write fails

**Use Case: View News Feed**
- **Description:** An authenticated user views the aggregated news feed showing posts from all Rings they are a member of. The system queries posts from all user's Rings, orders them chronologically, and displays them as tiles.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - User ID (from authenticated session)
- **Processing / Actions:**
  1. System receives request to display Home screen
  2. System queries PostgreSQL database for all Rings where user has Membership
  3. System queries all Posts from those Rings, ordered by creation timestamp (newest first)
  4. System formats each post as a tile showing: Ring name, photo (if post has image), first 100 characters of message text
  5. System displays tiles on Home screen News Feed
- **Outputs:**
  - Success: News Feed displayed with post tiles showing Ring name, photo (if any), and first 100 chars of message
  - Success: Empty feed if user has no Rings or no posts exist (no error, just empty feed)
  - No error conditions for authenticated users

**Use Case: Filter News Feed by Ring**
- **Description:** An authenticated user filters the News Feed to show only posts from a specific Ring by entering the Ring name in the search bar. The system filters the displayed posts accordingly.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Search query (Ring name from user input via Home screen search bar)
- **Processing / Actions:**
  1. System receives search query from Home screen search bar
  2. System queries PostgreSQL database for Ring matching the search query (case-insensitive partial match)
  3. System verifies user is a member of the matching Ring
  4. System filters News Feed to show only posts from that Ring
  5. System updates Home screen to display filtered posts
  6. System maintains full feed in memory for clearing search
- **Outputs:**
  - Success: Filtered News Feed displayed showing only posts from matching Ring
  - Success: Empty filtered feed if no matching Ring found or Ring has no posts (no error, just no results)
  - Error: "Ring not found" message if search doesn't match any Ring user is member of

## User Management Use Cases

**Use Case: Add User to Ring**
- **Description:** An authenticated user who is a member of a Ring adds another registered user to that Ring. The system validates the target user exists, creates a membership record, and grants the new member access to the Ring.
- **Actors Involved:** Authenticated User (primary actor), Target User (secondary actor), Ring (secondary actor)
- **Inputs and Their Sources:**
  - Target username (from user input via Ring Chat screen add user functionality)
  - Ring ID (from current Ring Chat screen context)
  - User ID (from authenticated session)
- **Processing / Actions:**
  1. System receives add user request from Ring Chat screen
  2. System validates requesting user is a member of the Ring
  3. System queries PostgreSQL database for target user by username
  4. System verifies target user is not already a member of the Ring
  5. System creates Membership record linking target user to Ring
  6. System updates Ring Chat screen to reflect new member
  7. System makes Ring visible in target user's "My Rings" list
  8. System makes existing posts in Ring visible to new member in their News Feed
- **Outputs:**
  - Success: User added to Ring, membership created, Ring accessible to new member
  - Error: "User not found" message if target username doesn't exist
  - Error: "User is already a member" message if target user already belongs to Ring
  - Error: "You are not a member of this Ring" message if requesting user lacks membership

**Use Case: View Ring Members**
- **Description:** An authenticated user views the list of all members belonging to a specific Ring. The system queries the database and displays member information.
- **Actors Involved:** Authenticated User (primary actor), Ring (secondary actor)
- **Inputs and Their Sources:**
  - Ring ID (from current Ring Chat screen context)
  - User ID (from authenticated session)
- **Processing / Actions:**
  1. System receives request to view Ring members
  2. System validates user is a member of the Ring
  3. System queries PostgreSQL database for all Users with Membership in the Ring
  4. System retrieves user information (usernames)
  5. System displays member list (implementation detail: may be shown in Ring Chat screen or separate view)
- **Outputs:**
  - Success: List of Ring members displayed with usernames
  - Success: Empty list if Ring has no members (should not occur as creator is always a member)
  - Error: "You are not a member of this Ring" message if user lacks membership

## Navigation Use Cases

**Use Case: Navigate to Home**
- **Description:** An authenticated user navigates to the Home screen to view the News Feed. The system displays the Home screen with aggregated posts from all user's Rings.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Navigation request (from user clicking Home button in footer navigation)
- **Processing / Actions:**
  1. System receives navigation request from footer Home button
  2. System loads Home screen
  3. System triggers View News Feed use case
  4. System displays Home screen with News Feed and search bar
- **Outputs:**
  - Success: Home screen displayed with News Feed
  - No error conditions for authenticated users

**Use Case: Navigate to My Rings**
- **Description:** An authenticated user navigates to the My Rings screen to view all Rings they belong to. The system displays the My Rings screen with the user's Ring list.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Navigation request (from user clicking My Rings button in footer navigation)
- **Processing / Actions:**
  1. System receives navigation request from footer My Rings button
  2. System loads My Rings screen
  3. System triggers View My Rings use case
  4. System displays My Rings screen with search bar and Ring list
- **Outputs:**
  - Success: My Rings screen displayed with user's Rings list
  - No error conditions for authenticated users

**Use Case: Navigate to Find Ring**
- **Description:** An authenticated user navigates to the Find Ring screen to search for and join Rings. The system displays the Find Ring screen with search functionality.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Navigation request (from user clicking Find Ring button in footer navigation)
- **Processing / Actions:**
  1. System receives navigation request from footer Find Ring button
  2. System loads Find Ring screen
  3. System displays Find Ring screen with search bar
  4. System initializes empty search results list
- **Outputs:**
  - Success: Find Ring screen displayed with search bar
  - No error conditions for authenticated users

**Use Case: Navigate to Create Ring**
- **Description:** An authenticated user navigates to the Create Ring screen to create a new Ring. The system displays the Create Ring screen with name input and create button.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Navigation request (from user clicking Create Ring button in footer navigation)
- **Processing / Actions:**
  1. System receives navigation request from footer Create Ring button
  2. System loads Create Ring screen
  3. System displays Create Ring screen with name input field and create button
- **Outputs:**
  - Success: Create Ring screen displayed with form
  - No error conditions for authenticated users

**Use Case: Navigate to Settings**
- **Description:** An authenticated user navigates to the Settings screen to view their username and logout. The system displays the Settings screen with user information and logout button.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Navigation request (from user clicking Settings button in footer navigation)
- **Processing / Actions:**
  1. System receives navigation request from footer Settings button
  2. System loads Settings screen
  3. System retrieves current user's username from session
  4. System displays Settings screen with username and logout button
- **Outputs:**
  - Success: Settings screen displayed with username and logout button
  - No error conditions for authenticated users

