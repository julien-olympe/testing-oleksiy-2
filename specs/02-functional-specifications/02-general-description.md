# 2. General Description

## 2.1 System Environment

Rings is a full-stack web and mobile application that combines messenger and social networking capabilities. The system architecture consists of:

- **Frontend Application**: A React-based single-page application (SPA) built with Vite, providing the user interface for web browsers and mobile devices. The frontend communicates with the backend via RESTful API calls.

- **Backend API**: A Node.js server application built with Fastify framework, implementing RESTful endpoints for all business operations. The backend handles authentication, authorization, data validation, and business logic.

- **Database**: A PostgreSQL relational database that stores all persistent data including users, Rings, posts, memberships, and images.

- **Image Storage**: Image files uploaded by users are stored in the file system or cloud storage, with references stored in the database.

- **Real-time Updates**: The system uses polling mechanisms to update the News Feed and Chat interfaces with new posts and messages.

### System Actors

The system involves two primary actors:

1. **Registered User**: An authenticated user who has completed registration and login. Registered Users can:
   - View and interact with the News Feed
   - Create new Rings
   - Join existing Rings
   - Post messages and pictures in Rings they are members of
   - Add other users to Rings they are members of
   - Search for Rings
   - Manage their account settings

2. **System**: The automated system components that:
   - Authenticate users and manage sessions
   - Process and store posts, Rings, and memberships
   - Aggregate News Feed content from multiple Rings
   - Handle search operations
   - Manage image uploads and storage
   - Enforce business rules and data validation

### Actor Interactions

- Registered Users interact with the System through the frontend interface, which sends HTTP requests to the backend API
- The System processes requests, validates data, performs database operations, and returns responses
- The frontend displays responses to the Registered User and updates the UI accordingly
- The System automatically updates News Feeds when new posts are created in Rings

## 2.2 Conceptual Model

Rings is organized around five main functional areas:

### 2.2.1 User Management

Handles user registration, authentication, and session management. Users must register with a username and password to access the platform. Once authenticated, users maintain a session that allows access to all platform features.

**Key Entities**: User (username, password hash, session token)

### 2.2.2 Ring Management

Enables creation, discovery, and membership management of Rings. Users create Rings with unique names. Other users can search for and join Rings. Ring creators and members can add additional users to Rings.

**Key Entities**: Ring (id, name, creation date, creator), Membership (user_id, ring_id, join date)

### 2.2.3 Post Management

Handles creation and storage of posts within Rings. Posts contain text messages and optionally include images. Posts are associated with a specific Ring and are visible to all members of that Ring.

**Key Entities**: Post (id, ring_id, user_id, message text, image URL, creation timestamp)

### 2.2.4 News Feed

Aggregates posts from all Rings where the current user is a member. The News Feed displays posts in chronological order (newest first). Users can filter the News Feed by searching for a specific Ring name, which shows only posts from that Ring.

**Key Entities**: News Feed (aggregated from Posts where user is a Member)

### 2.2.5 Search

Provides functionality to search for Rings by name. Search is available in three contexts:
- News Feed search: Filters the News Feed to show posts from matching Rings
- My Rings search: Filters the user's Rings list
- Find Ring search: Discovers Rings the user can join

**Key Entities**: Search results (filtered Rings based on name matching)

### Entity Relationships

- **User ↔ Ring**: Many-to-many relationship through Membership. A User can be a member of multiple Rings, and a Ring contains multiple Users.
- **User ↔ Post**: One-to-many relationship. A User creates multiple Posts, and each Post belongs to one User.
- **Ring ↔ Post**: One-to-many relationship. A Ring contains multiple Posts, and each Post belongs to one Ring.
- **User ↔ Membership**: One-to-many relationship. A User has multiple Memberships (one per Ring they belong to).

## 2.3 User Characteristics

Rings serves two primary user segments:

**Regular Users**: Users who access the platform daily or weekly. These users actively create Rings, post messages, and engage with content. They understand the platform's core features and use them frequently. Regular users expect fast performance, reliable notifications, and seamless content discovery.

**Occasional Users**: Users who access the platform less frequently (monthly or sporadically). These users may join Rings created by others, view News Feeds, and occasionally post content. They require intuitive interfaces and clear navigation to quickly understand available features.

**Technical Proficiency**: All users are assumed to have basic computer and mobile device knowledge. They can:
- Navigate web browsers or mobile apps
- Enter text in forms
- Click/tap buttons and links
- Upload images from their device
- Understand basic social media concepts (posts, feeds, groups)

**Device Access**: Users access Rings through:
- Modern web browsers (Chrome, Firefox, Safari, Edge) on desktop and laptop computers
- Mobile web browsers on smartphones and tablets
- Mobile applications (future consideration, not in current scope)

## 2.4 Main Development Constraints

The following technical constraints must be followed during development:

**Technology Stack**:
- **Package Manager**: npm for dependency management
- **Runtime**: Node.js for backend execution
- **Build Tool**: Vite for frontend development and building
- **Containerization**: Docker for deployment and environment consistency
- **Language**: TypeScript for both frontend and backend, ensuring type safety
- **Backend Framework**: Fastify for RESTful API implementation
- **Frontend Framework**: React for user interface components
- **Database**: PostgreSQL for data persistence
- **Testing**: Jest for unit and integration testing, Playwright for end-to-end testing

**Architectural Constraints**:
- RESTful API patterns must be followed for all backend endpoints
- TypeScript types must be defined for all data structures and API contracts
- Database schema must be normalized and follow relational database best practices
- Frontend must be a single-page application (SPA) with client-side routing
- Authentication must use secure session management (tokens or cookies)
- Image uploads must validate file types and sizes before storage

**Performance Constraints**:
- News Feed must load within 2 seconds for users with up to 50 Rings
- Search operations must return results within 1 second
- Image uploads must support files up to 10MB
- Real-time updates use polling with a maximum interval of 30 seconds

**Security Constraints**:
- All user passwords must be hashed using secure algorithms (bcrypt or similar)
- API endpoints must validate user authentication for protected resources
- Users can only access Rings they are members of
- Users can only add posts to Rings they are members of
- Input validation must prevent SQL injection and XSS attacks

## 2.5 Working Assumptions

The following assumptions are made about the operating environment and user context:

**Connectivity**:
- Users have reliable internet connectivity when using the platform
- Network latency is acceptable for real-time interactions (under 500ms for API calls)
- Users understand that offline functionality is not supported

**Devices and Browsers**:
- Users access the platform using modern browsers that support ES6+ JavaScript, CSS3, and HTML5
- Mobile devices have sufficient screen resolution (minimum 320px width) and processing power
- Browsers support file upload functionality for image selection

**User Behavior**:
- Users provide valid email addresses or usernames during registration (validation handled by system)
- Users remember their login credentials or use password recovery mechanisms (if implemented)
- Users understand that joining a Ring grants access to all posts in that Ring
- Users expect that posts they create are immediately visible to other Ring members

**Technical Assumptions**:
- PostgreSQL database is available and properly configured
- File system or cloud storage is available for image storage
- Server infrastructure can handle concurrent users (scaling considerations are out of scope)
- Real-time updates use polling rather than WebSockets or Server-Sent Events
- Image processing and optimization are handled by the backend before storage

**Business Assumptions**:
- Ring names are unique across the platform (enforced by system)
- Users can be members of an unlimited number of Rings
- There are no restrictions on the number of members per Ring
- Posts are permanent and not deleted automatically (deletion features are out of scope)
- All Ring members have equal permissions (no admin/moderator roles in initial version)
