# Screens (Continued)

### Find Ring Screen

**Purpose:** Allows users to search for Rings by name and join Rings they are not members of.

**Layout:**
- Search bar at the top of the main content area
- Search results list displayed below search bar
- Footer navigation bar at bottom

**Components:**
- Search bar (text input with search icon/button)
- Search results container (scrollable list of Ring results)
- Ring result items showing:
  - Ring name (text label)
  - Join button (displayed only for Rings user is not a member of)
  - Membership indicator (implementation detail: may show "Member" label if user is already a member)
- Footer navigation: Home, My Rings, Find Ring, Create Ring, Settings buttons

**User Interactions:**
- User can enter Ring name in search bar to search for Rings
- User can view search results
- User can click join button to join a Ring (button disappears after joining)
- User can click footer buttons to navigate to other screens

**Related Use Cases:**
- Find Ring
- Join Ring
- Navigate to Find Ring
- Navigate to Home
- Navigate to My Rings
- Navigate to Create Ring
- Navigate to Settings

**Navigation:**
- Footer buttons navigate to respective screens
- Find Ring button is active/highlighted on this screen

### Create Ring Screen

**Purpose:** Allows users to create new Rings by providing a unique Ring name.

**Layout:**
- Ring creation form in main content area
- Footer navigation bar at bottom

**Components:**
- Ring name input field (text input)
- Create button (submits Ring creation)
- Error message display area (below form if validation fails)
- Footer navigation: Home, My Rings, Find Ring, Create Ring, Settings buttons

**User Interactions:**
- User can enter Ring name in input field
- User can click create button to create Ring
- System validates name and creates Ring
- On success: redirects to Ring Chat screen for newly created Ring
- On error: displays error message
- User can click footer buttons to navigate to other screens

**Related Use Cases:**
- Create Ring
- Navigate to Create Ring
- Navigate to Ring Chat (after successful creation)
- Navigate to Home
- Navigate to My Rings
- Navigate to Find Ring
- Navigate to Settings

**Navigation:**
- Footer buttons navigate to respective screens
- Create Ring button is active/highlighted on this screen
- Successful Ring creation redirects to Ring Chat screen

### Settings Screen

**Purpose:** Displays user information and provides logout functionality.

**Layout:**
- User information section in main content area
- Logout button
- Footer navigation bar at bottom

**Components:**
- Username display (text label showing current user's username)
- Logout button (triggers logout action)
- Footer navigation: Home, My Rings, Find Ring, Create Ring, Settings buttons

**User Interactions:**
- User can view their username
- User can click logout button to log out
- On logout: session terminated, redirects to Login/Register screen
- User can click footer buttons to navigate to other screens (except logout clears session)

**Related Use Cases:**
- Logout User
- Navigate to Settings
- Navigate to Home
- Navigate to My Rings
- Navigate to Find Ring
- Navigate to Create Ring

**Navigation:**
- Footer buttons navigate to respective screens
- Settings button is active/highlighted on this screen
- Logout redirects to Login/Register screen (no footer navigation there)
