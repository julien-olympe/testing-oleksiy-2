# 4. Screens - Part 2: Content Screens

This section describes the main content screens: Home (News Feed), My Rings, and Ring Chat.

## 4.3 Home Screen

**Screen Name**: Home Screen

**Purpose**: Displays the News Feed aggregating posts from all Rings the user is a member of.

**Layout**:
- Search bar at the top of the content area
- News Feed list below the search bar
- Footer navigation at the bottom

**Components**:

**Search Bar**:
- Text input field with placeholder "Search Rings..."
- Search icon or button
- Clear button (X) appears when text is entered
- Real-time or on-submit search functionality

**News Feed**:
- Scrollable list of News Tiles
- Each News Tile displays:
  - Ring name (clickable, navigates to Ring Chat)
  - Post picture thumbnail (if post has an image, clickable to view full size)
  - First 100 characters of message text (truncated with ellipsis if longer)
  - Post timestamp (relative time, e.g., "2 hours ago")
  - Author username (optional, can be shown)
- News Tiles are ordered newest first (reverse chronological)
- Empty state message when no posts are available
- Loading indicator while fetching data

**Footer Navigation**: Standard footer with all five buttons

**Related Use Cases**:
- View News Feed (3.3): Loading and displaying News Feed
- Search Rings in News Feed (3.4): Filtering News Feed by Ring name search
- View Ring Chat (3.8): Clicking on a News Tile navigates to that Ring's Chat

**Navigation**:
- Clicking a News Tile navigates to the corresponding Ring Chat screen
- Footer buttons navigate to respective screens

## 4.4 My Rings Screen

**Screen Name**: My Rings Screen

**Purpose**: Displays a list of all Rings the user is a member of, with search functionality.

**Layout**:
- Search bar at the top of the content area
- Rings list below the search bar
- Footer navigation at the bottom

**Components**:

**Search Bar**:
- Text input field with placeholder "Search my Rings..."
- Search icon or button
- Clear button (X) appears when text is entered
- Real-time or on-submit search functionality

**Rings List**:
- Scrollable list of Ring items
- Each Ring item displays:
  - Ring name (ellipsized to 20 characters, full name shown on hover/tooltip)
  - Member count (e.g., "15 members")
  - Clickable area (entire item is clickable)
- Ring items are ordered alphabetically by name or by most recent activity
- Empty state message when user has no Rings
- Loading indicator while fetching data

**Footer Navigation**: Standard footer with all five buttons

**Related Use Cases**:
- View My Rings List (3.6): Loading and displaying user's Rings
- Search My Rings (3.7): Filtering Rings list by name search
- View Ring Chat (3.8): Clicking on a Ring item navigates to that Ring's Chat

**Navigation**:
- Clicking a Ring item navigates to the corresponding Ring Chat screen
- Footer buttons navigate to respective screens

## 4.5 Ring Chat Screen

**Screen Name**: Ring Chat Screen

**Purpose**: Displays the chat interface for a specific Ring, allowing users to view message history and post new messages with optional pictures.

**Layout**:
- Ring name header at the top
- Chat messages area in the center (scrollable)
- Message input area at the bottom (above footer)
- Footer navigation at the bottom

**Components**:

**Ring Header**:
- Ring name displayed prominently
- Optional: Member count or "Add User" button/link

**Chat Messages Area**:
- Scrollable list of posts/messages
- Each message displays:
  - Author username
  - Message text (full text, not truncated)
  - Picture (if message includes one, displayed as image, clickable to view full size)
  - Timestamp (formatted as time or relative time)
- Messages are ordered oldest first (chronological order)
- New messages appear at the bottom
- Auto-scroll to bottom when new messages arrive
- Empty state message when Ring has no posts
- Loading indicator while fetching messages

**Message Input Area**:
- Text input field (multiline, expands as needed)
- Picture upload button/icon (opens file picker)
- Selected image preview (thumbnail, with remove option)
- Post button (enabled when message text is entered)
- Character count indicator (optional, showing remaining characters out of 5000)

**Add User Section** (optional, can be in header or as a button):
- "Add User" button or link
- Username input field (appears when Add User is clicked)
- Add button
- Cancel button

**Footer Navigation**: Standard footer with all five buttons

**Related Use Cases**:
- View Ring Chat (3.8): Loading and displaying Ring chat messages
- Post Message in Ring (3.9): Creating new posts with text and optional picture
- Add User to Ring (3.10): Adding other users to the Ring

**Navigation**:
- Footer buttons navigate to respective screens
- User remains on Ring Chat screen after posting (to see their new post)
