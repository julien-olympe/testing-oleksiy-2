# Screens

## General Layout and Navigation

The Rings application uses a consistent layout structure across all screens:

**Header Area:**
- Application title/logo (implementation detail)
- User context information when applicable

**Main Content Area:**
- Screen-specific content displayed here
- Scrollable when content exceeds viewport

**Footer Navigation:**
- Fixed footer bar containing navigation buttons
- Buttons: Home, My Rings, Find Ring, Create Ring, Settings
- Always visible and accessible from all authenticated screens
- Footer navigation is not displayed on Login/Register screen

**Navigation Flow:**
- Users navigate between screens using footer buttons
- Ring Chat screen is accessed by clicking Ring items from My Rings screen
- All navigation maintains user session and authentication state

## Screen Specifications

### Login/Register Screen

**Purpose:** Provides user authentication functionality for both new user registration and existing user login.

**Layout:**
- Centered authentication form
- Toggle or tabs to switch between Register and Login modes
- Form fields: Username, Password, Email (for registration if required)
- Submit button for Register or Login action
- Error message display area below form

**Components:**
- Username input field (text input)
- Password input field (password input, masked)
- Email input field (text input, shown only in Register mode)
- Register button (shown in Register mode)
- Login button (shown in Login mode)
- Mode toggle/tabs (Register/Login switch)

**User Interactions:**
- User enters credentials and submits form
- System validates input and processes authentication
- On success: redirects to Home screen
- On error: displays error message in error area

**Related Use Cases:**
- Register User
- Login User

**Navigation:**
- No footer navigation on this screen (user not authenticated)
- Successful authentication redirects to Home screen

### Home Screen

**Purpose:** Displays the aggregated News Feed showing posts from all Rings the user is a member of.

**Layout:**
- Search bar at the top of the main content area
- News Feed tiles displayed below search bar in chronological order (newest first)
- Footer navigation bar at bottom

**Components:**
- Search bar (text input with search icon/button)
- News Feed container (scrollable list of post tiles)
- Post tiles showing:
  - Ring name (text label)
  - Photo thumbnail (if post contains image, otherwise no image displayed)
  - First 100 characters of message text (text label, truncated with ellipsis if longer)
- Footer navigation: Home, My Rings, Find Ring, Create Ring, Settings buttons

**User Interactions:**
- User can enter Ring name in search bar to filter News Feed
- User can scroll through News Feed tiles
- User can click footer buttons to navigate to other screens
- Clicking a post tile (implementation detail: may navigate to Ring Chat for that Ring)

**Related Use Cases:**
- View News Feed
- Filter News Feed by Ring
- Navigate to Home
- Navigate to My Rings
- Navigate to Find Ring
- Navigate to Create Ring
- Navigate to Settings

**Navigation:**
- Footer buttons navigate to respective screens
- Home button is active/highlighted on this screen

### My Rings Screen

**Purpose:** Displays a list of all Rings the user is a member of, allowing navigation to Ring Chat screens.

**Layout:**
- Search bar at the top of the main content area
- Ring list displayed below search bar
- Footer navigation bar at bottom

**Components:**
- Search bar (text input with search icon/button)
- Ring list container (scrollable list of Ring items)
- Ring items showing:
  - Ring name (text label, ellipsized to 20 characters if longer)
  - Member count (text label showing number of members)
  - Clickable area (entire item is clickable)
- Footer navigation: Home, My Rings, Find Ring, Create Ring, Settings buttons

**User Interactions:**
- User can enter Ring name in search bar to filter the Ring list
- User can scroll through Ring list
- User can click a Ring item to navigate to Ring Chat screen for that Ring
- User can click footer buttons to navigate to other screens

**Related Use Cases:**
- View My Rings
- Search Rings
- Navigate to My Rings
- Navigate to Ring Chat
- Navigate to Home
- Navigate to Find Ring
- Navigate to Create Ring
- Navigate to Settings

**Navigation:**
- Clicking Ring item navigates to Ring Chat screen for that Ring
- Footer buttons navigate to respective screens
- My Rings button is active/highlighted on this screen

### Ring Chat Screen

**Purpose:** Displays message history for a specific Ring and provides interface for posting new messages with optional images.

**Layout:**
- Message history area (scrollable, displays all posts in chronological order)
- Input area at bottom: text input field, image upload button, send button
- Add user button (for adding members to Ring)
- Footer navigation bar at bottom

**Components:**
- Message history container (scrollable list of messages)
- Message items showing:
  - Username of post creator (text label)
  - Message text (text label)
  - Image (if post contains image, displayed as thumbnail or full image)
  - Timestamp (text label, implementation detail)
- Text input field (multi-line text area for message composition)
- Image upload button (file picker button)
- Send button (submits post)
- Add user button (opens interface to add users to Ring)
- Footer navigation: Home, My Rings, Find Ring, Create Ring, Settings buttons

**User Interactions:**
- User can scroll through message history
- User can type message text in input field
- User can click image upload button to select and attach image file
- User can click send button to post message (with or without image)
- User can click add user button to add other registered users to Ring
- User can click footer buttons to navigate to other screens

**Related Use Cases:**
- Post Message (Text Only)
- Post Message with Picture
- Add User to Ring
- View Ring Members (may be displayed when adding users)
- Navigate to Ring Chat
- Navigate to Home
- Navigate to My Rings
- Navigate to Find Ring
- Navigate to Create Ring
- Navigate to Settings

**Navigation:**
- Footer buttons navigate to respective screens
- No specific active state for Ring Chat in footer (not a footer button destination)

