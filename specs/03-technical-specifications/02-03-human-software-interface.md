# 2.3 Human/Software Interface

This document defines the user interface layout, components, error messages, and user manual for the Rings application.

## 2.3.1 User Interface Layout

**General Layout Structure**:
- All authenticated screens share consistent footer navigation
- Main content area is scrollable and occupies center of viewport
- Footer navigation is fixed at bottom of screen
- No persistent header on most screens

**Footer Navigation**:
- Fixed position at bottom of viewport
- Five buttons arranged horizontally: Home, My Rings, Find Ring, Create Ring, Settings
- Active screen button is visually highlighted
- Buttons are touch-friendly on mobile (minimum 44px height)
- Footer remains visible on all authenticated screens

**Responsive Design**:
- Desktop: Content centered with maximum width constraints (1200px)
- Mobile: Content uses full viewport width
- Breakpoint: 768px width for mobile/desktop transition
- Touch targets minimum 44x44px on mobile

## 2.3.2 Screen-Specific Layouts

**Login Screen**:
- Centered form container
- Two sections: Login and Register (tabs or separate forms)
- Form fields: Username input, Password input, Submit button
- Error messages displayed below form fields
- No footer navigation

**Home Screen**:
- Search bar at top of content area
- News Feed list below search bar
- Each News Tile shows: Ring name, post picture (if any), first 100 characters of message, timestamp
- Footer navigation at bottom

**My Rings Screen**:
- Search bar at top of content area
- Rings list below search bar
- Each Ring item shows: Ring name (ellipsized to 20 chars), member count
- Footer navigation at bottom

**Ring Chat Screen**:
- Ring name header at top
- Scrollable chat messages area in center
- Message input area at bottom (above footer)
- Input area includes: Text field, picture upload button, post button
- Footer navigation at bottom

**Find Ring Screen**:
- Search bar at top of content area
- Search results list below search bar
- Each result shows: Ring name, member count, Join button (if not member)
- Footer navigation at bottom

**Create Ring Screen**:
- Centered form container
- Ring name input field
- Create button
- Character count indicator
- Footer navigation at bottom

**Settings Screen**:
- Centered content area
- Username display
- Logout button
- Footer navigation at bottom

## 2.3.3 User Interface Components

**Buttons**:
- Primary buttons: Solid background, high contrast text
- Secondary buttons: Outlined style
- Disabled state: Reduced opacity, non-interactive
- Hover state: Visual feedback on interactive elements
- Loading state: Spinner or disabled state during API calls

**Input Fields**:
- Text inputs: Border, padding, focus state with outline
- Password inputs: Masked characters, show/hide toggle (optional)
- File inputs: Custom styled button triggering file picker
- Validation errors: Red text below input field
- Placeholder text: Light gray, descriptive

**Lists and Cards**:
- News Tiles: Card-based layout with shadow, rounded corners
- Ring items: List item style with hover state
- Scrollable containers: Vertical scrolling, scrollbar styling
- Empty states: Centered message with icon or illustration

**Navigation**:
- Footer buttons: Icon and/or text labels
- Active state: Different color or background
- Click/tap feedback: Visual response on interaction

## 2.3.4 Error Messages

**Authentication Errors**:
- "Username already exists" - Registration with duplicate username
- "Invalid username or password" - Login with incorrect credentials
- "Username must be 3-50 characters and contain only letters, numbers, and underscores" - Invalid username format
- "Password must be at least 8 characters and contain at least one letter and one number" - Invalid password format

**Ring Errors**:
- "Ring name already exists. Please choose a different name." - Duplicate ring name
- "Ring name must be between 1 and 100 characters." - Invalid ring name length
- "You are not a member of this Ring." - Accessing ring without membership
- "You are already a member of this Ring." - Attempting to join ring already member of

**Post Errors**:
- "Message cannot be empty." - Posting without message text
- "Message must be 5000 characters or less." - Message exceeds length limit
- "Image file is too large. Maximum size is 10MB." - Image exceeds size limit
- "Unsupported image format. Please use JPEG, PNG, or GIF." - Invalid image format

**User Management Errors**:
- "User '[username]' not found." - Adding non-existent user to ring
- "User '[username]' is already a member of this Ring." - Adding existing member

**System Errors**:
- "Unable to load news feed. Please try again." - API failure loading news feed
- "Unable to load settings. Please try again." - API failure loading settings
- "Unable to logout. Please try again." - API failure during logout
- "Unable to join Ring. Please try again." - API failure joining ring

**Empty States**:
- "No posts yet. Join or create a Ring to see posts here." - Empty news feed
- "No messages yet. Be the first to post!" - Empty ring chat
- "You haven't joined any Rings yet. Create or find a Ring to get started." - No rings
- "No posts found for '[search query]'" - No search results in news feed
- "No Rings found matching '[search query]'" - No search results in ring search

## 2.3.5 User Manual Description

**Getting Started**:
1. User navigates to application URL in web browser
2. User sees Login screen with Register and Login options
3. New users click Register, enter username (3-50 chars, alphanumeric/underscores) and password (8+ chars, letter and number)
4. Existing users enter username and password, click Login
5. After authentication, user is redirected to Home screen (News Feed)

**Using the News Feed**:
1. Home screen displays posts from all user's Rings, newest first
2. Each post shows Ring name, picture (if any), first 100 characters of message
3. User can search for specific Ring using search bar to filter posts
4. Clicking a post navigates to that Ring's Chat screen

**Managing Rings**:
1. Click "My Rings" in footer to see all Rings user is member of
2. Search bar filters Rings by name
3. Clicking a Ring navigates to Ring Chat
4. Click "Find Ring" to search for Rings by name
5. Click "Join" button on search results to join a Ring
6. Click "Create Ring" to create new Ring with unique name

**Posting Messages**:
1. Navigate to Ring Chat (from My Rings or News Feed)
2. Enter message text in input field (1-5000 characters)
3. Optionally click picture upload button to select image (JPEG, PNG, GIF, max 10MB)
4. Click Post button
5. Message appears immediately in Ring Chat and in News Feed for all Ring members

**Adding Users to Rings**:
1. In Ring Chat screen, click "Add User" button or link
2. Enter username of registered user
3. Click Add button
4. User is added to Ring and gains immediate access

**Account Settings**:
1. Click "Settings" in footer
2. View username
3. Click "Logout" to end session and return to Login screen
