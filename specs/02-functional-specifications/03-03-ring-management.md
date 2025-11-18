# 3. Functional Requirements - Part 3: Ring Management

This section details Ring creation, discovery, membership, and management use cases for the Rings platform. Each use case follows a structured format describing the name, description, actors, inputs, processing, and outputs.

## 3.5 Create Ring

**Name**: Create Ring

**Description**: The authenticated user creates a new Ring by providing a unique Ring name. Upon creation, the user automatically becomes a member of the new Ring and can immediately post in it.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Ring name: Text input from user (required, minimum 1 character, maximum 100 characters)
- Create button click: User action

**Processing/Actions**:
1. System validates user authentication token
2. System validates Ring name is not empty and meets length requirements
3. System checks if Ring name already exists in database
4. If Ring name exists, creation fails with error message
5. System creates new Ring record in database with name and creator user_id
6. System creates Membership record linking user to the new Ring
7. System returns success response with new Ring data
8. Frontend redirects user to the new Ring's Chat screen

**Outputs**:
- Success: User is redirected to Ring Chat screen for the newly created Ring
- Error: "Ring name already exists. Please choose a different name." - displayed if Ring name is taken
- Error: "Ring name must be between 1 and 100 characters." - displayed if name length is invalid

## 3.6 View My Rings List

**Name**: View My Rings List

**Description**: The authenticated user views a list of all Rings they are a member of. Each Ring item displays the Ring name (ellipsized to 20 characters if longer) and the member count. The list is displayed on the My Rings screen.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- User authentication token: From session
- Navigation to My Rings screen: User clicks "My Rings" button in footer

**Processing/Actions**:
1. System validates user authentication token
2. System retrieves all Rings where user is a member (Membership records)
3. For each Ring, system counts total members (Membership records for that Ring)
4. System formats each Ring with:
   - Ring id
   - Ring name (truncated to 20 characters with ellipsis if longer)
   - Member count
5. System returns Rings list data to frontend
6. Frontend displays Rings as a scrollable list

**Outputs**:
- Success: My Rings list displays with all user's Rings showing name and member count
- Empty State: "You haven't joined any Rings yet. Create or find a Ring to get started." - displayed if user has no Rings

## 3.7 Search My Rings

**Name**: Search My Rings

**Description**: The user searches for a specific Ring within their My Rings list using the search bar. The list filters to show only Rings whose names match the search query. If search query is cleared, the full list is restored.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Search query: Text input from user in My Rings search bar (optional, can be empty)
- Search submission or real-time search: User typing or pressing enter

**Processing/Actions**:
1. System receives search query from frontend
2. If search query is empty or cleared, system returns full My Rings list (same as View My Rings List)
3. If search query provided, system performs case-insensitive partial matching on Ring names
4. System retrieves all Rings where user is a member AND Ring name contains search query
5. For each matching Ring, system counts total members
6. System formats Rings with name (ellipsized to 20 chars) and member count
7. System returns filtered Rings list to frontend
8. Frontend updates My Rings display with filtered results

**Outputs**:
- Success: My Rings list displays filtered Rings matching search query
- No Results: "No Rings found matching '[search query]'" - displayed if no Rings match
- Empty Query: Full My Rings list is restored when search is cleared

## 3.10 Add User to Ring

**Name**: Add User to Ring

**Description**: The authenticated user adds another registered user to a Ring they are a member of. The added user immediately becomes a member and gains access to view and post in that Ring. The added user will see posts from this Ring in their News Feed.

**Actors Involved**:
- Registered User (the one adding)
- Registered User (the one being added)
- System

**Inputs and Sources**:
- Ring id: From current Ring Chat screen context
- Username to add: Text input from user (required, must be an existing registered username)
- Add user button click: User action

**Processing/Actions**:
1. System validates user authentication token (for the user doing the adding)
2. System verifies the adding user is a member of the specified Ring
3. If adding user is not a member, operation fails
4. System retrieves User record for the username to be added
5. If username does not exist, operation fails
6. System checks if the user to be added is already a member of the Ring
7. If user is already a member, operation fails (or succeeds silently)
8. System creates new Membership record linking the user to the Ring
9. System returns success response
10. Frontend displays confirmation message

**Outputs**:
- Success: "User '[username]' has been added to the Ring." - confirmation message displayed
- Error: "You are not a member of this Ring." - displayed if adding user is not a member
- Error: "User '[username]' not found." - displayed if username does not exist
- Error: "User '[username]' is already a member of this Ring." - displayed if user is already a member

## 3.11 Find Ring (Search)

**Name**: Find Ring (Search)

**Description**: The authenticated user searches for Rings by name using the Find Ring screen search bar. The system returns a list of Rings whose names match the search query. The user can see which Rings they are already members of and which they can join.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Search query: Text input from user in Find Ring search bar (required, minimum 1 character)
- Search submission: User typing and pressing enter or clicking search button

**Processing/Actions**:
1. System validates user authentication token
2. System validates search query is not empty
3. System performs case-insensitive partial matching on Ring names
4. System retrieves all Rings whose names contain the search query
5. For each matching Ring, system checks if user is a member (checks Membership record)
6. System formats each Ring with:
   - Ring id
   - Ring name
   - Member count
   - Membership status (is user a member: true/false)
7. System returns search results to frontend
8. Frontend displays Rings list with "Join" button for Rings user is not a member of

**Outputs**:
- Success: Search results display showing matching Rings with Join buttons for non-member Rings
- No Results: "No Rings found matching '[search query]'" - displayed if no Rings match
- Error: "Please enter a search query." - displayed if search is submitted empty

## 3.12 Join Ring (Apply for Membership)

**Name**: Join Ring (Apply for Membership)

**Description**: The authenticated user joins a Ring they are not currently a member of by clicking the "Join" button on the Find Ring screen. Upon joining, the user immediately becomes a member and gains access to view and post in that Ring. The Join button disappears for that Ring.

**Actors Involved**:
- Registered User
- System

**Inputs and Sources**:
- Ring id: From user clicking "Join" button on a Ring in Find Ring search results
- User authentication token: From session

**Processing/Actions**:
1. System validates user authentication token
2. System verifies user is not already a member of the specified Ring
3. If user is already a member, operation fails (or succeeds silently)
4. System creates new Membership record linking user to the Ring
5. System returns success response with updated Ring data (now showing user as member)
6. Frontend updates the Ring item to remove "Join" button
7. Frontend displays confirmation message

**Outputs**:
- Success: "You have joined '[Ring name]'." - confirmation message displayed, Join button removed
- Error: "You are already a member of this Ring." - displayed if user tries to join Ring they're already in
- Error: "Unable to join Ring. Please try again." - displayed if API request fails
