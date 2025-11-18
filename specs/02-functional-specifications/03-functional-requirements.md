# Functional Requirements

This section details all use cases organized by functionality groups. Each use case follows a standardized template.

## Authentication Use Cases

**Use Case: Register User**
- **Description:** A new user creates an account in the Rings application by providing registration credentials. The system validates the input and creates a new user account, enabling the user to authenticate and access the application.
- **Actors Involved:** Unregistered User (primary actor)
- **Inputs and Their Sources:**
  - Username (from user input via registration form)
  - Password (from user input via registration form)
  - Email address (from user input via registration form, if required)
- **Processing / Actions:**
  1. System receives registration form submission
  2. System validates username uniqueness
  3. System validates password strength requirements
  4. System validates email format (if email is required)
  5. System creates new user record in PostgreSQL database
  6. System stores hashed password (never plain text)
  7. System creates user session
  8. System redirects user to Home screen
- **Outputs:**
  - Success: User account created, session established, redirect to Home screen
  - Error: "Username already exists" message if username is taken
  - Error: "Invalid password format" message if password doesn't meet requirements
  - Error: "Invalid email format" message if email format is invalid

**Use Case: Login User**
- **Description:** A registered user authenticates to the Rings application by providing valid credentials. The system verifies the credentials and establishes an authenticated session.
- **Actors Involved:** Registered User (primary actor)
- **Inputs and Their Sources:**
  - Username (from user input via login form)
  - Password (from user input via login form)
- **Processing / Actions:**
  1. System receives login form submission
  2. System queries PostgreSQL database for user by username
  3. System verifies password hash matches stored hash
  4. System creates authenticated session
  5. System stores session token/cookie
  6. System redirects user to Home screen
- **Outputs:**
  - Success: Session established, redirect to Home screen
  - Error: "Invalid username or password" message if credentials are incorrect
  - Error: "Account not found" message if username doesn't exist

**Use Case: Logout User**
- **Description:** An authenticated user terminates their active session, logging out of the Rings application. The system invalidates the session and redirects to the login screen.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Logout request (from user clicking logout button on Settings screen)
- **Processing / Actions:**
  1. System receives logout request
  2. System invalidates current session token/cookie
  3. System clears session data from server
  4. System redirects user to Login/Register screen
- **Outputs:**
  - Success: Session terminated, redirect to Login/Register screen
  - No error conditions (logout always succeeds for authenticated users)

## Ring Management Use Cases

**Use Case: Create Ring**
- **Description:** An authenticated user creates a new Ring with a unique name. The system validates the name, creates the Ring, and automatically adds the creator as a member.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Ring name (from user input via Create Ring screen form)
- **Processing / Actions:**
  1. System receives Ring creation request from Create Ring screen
  2. System validates Ring name is not empty
  3. System validates Ring name uniqueness (no duplicate names allowed)
  4. System creates new Ring record in PostgreSQL database
  5. System creates Membership record linking creator to the new Ring
  6. System redirects user to Ring Chat screen for the newly created Ring
- **Outputs:**
  - Success: Ring created, membership established, redirect to Ring Chat screen
  - Error: "Ring name is required" message if name is empty
  - Error: "Ring name already exists" message if name is duplicate

**Use Case: Find Ring**
- **Description:** An authenticated user searches for Rings by name. The system queries the database and returns matching Rings, indicating which ones the user is already a member of.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Search query (Ring name or partial name from user input via Find Ring screen search bar)
- **Processing / Actions:**
  1. System receives search query from Find Ring screen
  2. System queries PostgreSQL database for Rings matching the search query (case-insensitive partial match)
  3. System checks user's membership status for each matching Ring
  4. System returns list of matching Rings with membership indicators
  5. System displays results on Find Ring screen
- **Outputs:**
  - Success: List of matching Rings displayed with join buttons for non-member Rings
  - Success: Empty list if no matches found (no error, just empty results)
  - No error conditions for valid search queries

**Use Case: Join Ring**
- **Description:** An authenticated user requests membership in a Ring they discovered through search. The system creates a membership record, granting the user access to the Ring.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Ring ID (from user clicking join button on Find Ring screen for a specific Ring)
- **Processing / Actions:**
  1. System receives join request from Find Ring screen
  2. System verifies user is not already a member of the Ring
  3. System creates Membership record linking user to Ring in PostgreSQL database
  4. System updates Find Ring screen to remove join button for that Ring
  5. System adds Ring to user's "My Rings" list
- **Outputs:**
  - Success: Membership created, join button removed, Ring added to My Rings
  - Error: "Already a member" message if user is already a member (should not occur in normal flow)
  - Error: "Ring not found" message if Ring ID is invalid

**Use Case: View My Rings**
- **Description:** An authenticated user views a list of all Rings they are a member of. The system queries the database and displays the Rings with their names and member counts.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - User ID (from authenticated session)
- **Processing / Actions:**
  1. System receives request to display My Rings screen
  2. System queries PostgreSQL database for all Rings where user has Membership
  3. System counts members for each Ring
  4. System formats Ring names (ellipsize to 20 characters if longer)
  5. System displays list on My Rings screen
- **Outputs:**
  - Success: List of Rings displayed with names (ellipsized to 20 chars) and member counts
  - Success: Empty list if user has no Rings (no error, just empty list)
  - No error conditions for authenticated users

**Use Case: Search Rings**
- **Description:** An authenticated user filters their "My Rings" list by searching for a specific Ring name. The system filters the displayed list to show only matching Rings.
- **Actors Involved:** Authenticated User (primary actor)
- **Inputs and Their Sources:**
  - Search query (Ring name or partial name from user input via My Rings screen search bar)
- **Processing / Actions:**
  1. System receives search query from My Rings screen search bar
  2. System filters the user's Rings list to match the search query (case-insensitive partial match)
  3. System updates the displayed list on My Rings screen
  4. System maintains full list in memory for clearing search
- **Outputs:**
  - Success: Filtered list of matching Rings displayed
  - Success: Empty filtered list if no matches (no error, just no results)
  - No error conditions for valid search queries
