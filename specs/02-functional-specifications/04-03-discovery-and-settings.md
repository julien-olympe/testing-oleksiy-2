# 4. Screens - Part 3: Discovery and Settings

This section describes the Ring discovery screens (Find Ring, Create Ring) and the Settings screen, along with screen relationships and navigation flow.

## 4.6 Find Ring Screen

**Screen Name**: Find Ring Screen

**Purpose**: Allows users to search for Rings by name and join Rings they are not members of.

**Layout**:
- Search bar at the top of the content area
- Search results list below the search bar
- Footer navigation at the bottom

**Components**:

**Search Bar**:
- Text input field with placeholder "Search for Rings..."
- Search icon or button
- Clear button (X) appears when text is entered
- Minimum 1 character required to search

**Search Results List**:
- Scrollable list of Ring items
- Each Ring item displays:
  - Ring name
  - Member count (e.g., "15 members")
  - "Join" button (only shown if user is not a member)
  - Status indicator or no button (if user is already a member, shows "Member" or similar)
- Results are ordered by relevance or alphabetically
- Empty state message when no search has been performed or no results found
- Loading indicator while fetching search results

**Footer Navigation**: Standard footer with all five buttons

**Related Use Cases**:
- Find Ring (Search) (3.11): Searching for Rings by name
- Join Ring (Apply for Membership) (3.12): Joining a Ring by clicking Join button

**Navigation**:
- After joining a Ring, user is automatically redirected to that Ring's Chat screen
- Footer buttons navigate to respective screens

## 4.7 Create Ring Screen

**Screen Name**: Create Ring Screen

**Purpose**: Allows users to create a new Ring by providing a Ring name.

**Layout**:
- Centered form container
- Footer navigation at the bottom

**Components**:

**Create Ring Form**:
- Ring name input field (text, required, placeholder "Enter Ring name...")
- Character count indicator (showing remaining characters out of 100)
- Create button (enabled when Ring name is entered and valid)
- Validation error messages displayed below input field
- Help text displayed below the input field explaining what a Ring is (e.g., "A Ring is a private group where members can share messages and pictures")

**Footer Navigation**: Standard footer with all five buttons

**Related Use Cases**:
- Create Ring (3.5): Creating a new Ring with specified name

**Navigation**:
- After successful creation, user is automatically redirected to the new Ring's Chat screen
- Footer buttons navigate to respective screens (Create button is disabled or shows current screen indicator)

## 4.8 Settings Screen

**Screen Name**: Settings Screen

**Purpose**: Displays user account information and provides logout functionality.

**Layout**:
- Centered content area
- Footer navigation at the bottom

**Components**:

**User Information Section**:
- Username label and display (read-only)
- User profile information (if expanded in future, currently just username)

**Account Actions Section**:
- Logout button (prominent, styled as primary action)
- Confirmation dialog appears when logout is clicked, asking "Are you sure you want to logout?" with "Cancel" and "Logout" options

**Footer Navigation**: Standard footer with all five buttons

**Related Use Cases**:
- View Settings (3.13): Loading and displaying user settings
- Logout (3.14): Logging out of the platform

**Navigation**:
- After logout, user is redirected to Login screen
- Footer buttons navigate to respective screens (Settings button is disabled or shows current screen indicator)

## 4.9 Screen Relationships and Navigation Flow

**Authentication Flow**:
- Unauthenticated users see only Login Screen
- After successful login/registration, users are redirected to Home Screen
- All authenticated screens include footer navigation

**Primary Navigation**:
- Footer navigation provides quick access to all main sections
- Users can navigate between Home, My Rings, Find Ring, Create Ring, and Settings from any authenticated screen

**Contextual Navigation**:
- From Home Screen (News Feed): Clicking a News Tile navigates to Ring Chat
- From My Rings Screen: Clicking a Ring item navigates to Ring Chat
- From Find Ring Screen: After joining, user can navigate to the joined Ring's Chat
- From Create Ring Screen: After creation, user is automatically navigated to the new Ring's Chat

**Navigation State**:
- Current screen is indicated in footer (active state on corresponding button)
- Browser back/forward buttons work for navigation history
- Deep linking to specific Rings is supported (Ring Chat URLs include Ring id)
