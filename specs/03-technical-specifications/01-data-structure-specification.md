# 1. Data Structure Specification

This document defines the complete data structure for the Rings application, including all entities, their attributes, relationships, and cardinalities.

## 1.1 User Entity

**Entity Name**: User

**Purpose and Essence**: Represents a registered user account on the Rings platform. Users authenticate with username and password, create and join Rings, and post messages. Each user has a unique identifier and maintains authentication credentials.

**Attributes**:
- `id`: UUID (Primary Key) - Unique identifier for the user
- `username`: VARCHAR(50) (Unique, Not Null) - User's chosen username, 3-50 characters, alphanumeric and underscores only
- `password_hash`: VARCHAR(255) (Not Null) - Bcrypt hashed password, minimum 8 characters with at least one letter and one number
- `created_at`: TIMESTAMP (Not Null) - Timestamp when user account was created
- `last_login_at`: TIMESTAMP (Nullable) - Timestamp of user's most recent login

**Relationships**:
- User to Membership: One-to-many (one user has many memberships)
- User to Post: One-to-many (one user creates many posts)
- User to Ring: Many-to-many through Membership (users join multiple rings, rings have multiple users)

**Constraints**:
- Username must be unique across all users
- Username must be between 3 and 50 characters
- Username must contain only alphanumeric characters and underscores
- Password hash is required and cannot be null

## 1.2 Ring Entity

**Entity Name**: Ring

**Purpose and Essence**: Represents a group chatroom where users post messages and pictures. Each Ring has a unique name, is created by a user, and contains multiple members through memberships. Rings aggregate posts from their members.

**Attributes**:
- `id`: UUID (Primary Key) - Unique identifier for the ring
- `name`: VARCHAR(100) (Unique, Not Null) - Ring name, 1-100 characters, must be unique across all rings
- `creator_id`: UUID (Foreign Key to User.id, Not Null) - User who created the ring
- `created_at`: TIMESTAMP (Not Null) - Timestamp when ring was created

**Relationships**:
- Ring to Membership: One-to-many (one ring has many memberships)
- Ring to Post: One-to-many (one ring contains many posts)
- Ring to User (creator): Many-to-one (many rings created by one user)
- Ring to User (members): Many-to-many through Membership (rings have multiple members, users join multiple rings)

**Constraints**:
- Ring name must be unique across all rings
- Ring name must be between 1 and 100 characters
- Creator ID must reference a valid user

## 1.3 Post Entity

**Entity Name**: Post

**Purpose and Essence**: Represents a message entry created by a user within a Ring. Posts contain text content and optionally include an image. Posts appear in the Ring Chat and in the News Feed for all members of that Ring.

**Attributes**:
- `id`: UUID (Primary Key) - Unique identifier for the post
- `ring_id`: UUID (Foreign Key to Ring.id, Not Null) - Ring where the post was created
- `user_id`: UUID (Foreign Key to User.id, Not Null) - User who created the post
- `message_text`: TEXT (Not Null) - Post message text, 1-5000 characters, cannot be empty
- `image_url`: VARCHAR(500) (Nullable) - URL or file path to uploaded image, maximum 10MB, formats: JPEG, PNG, GIF
- `created_at`: TIMESTAMP (Not Null) - Timestamp when post was created

**Relationships**:
- Post to Ring: Many-to-one (many posts belong to one ring)
- Post to User: Many-to-one (many posts created by one user)

**Constraints**:
- Message text must be between 1 and 5000 characters
- Message text cannot be empty
- Ring ID must reference a valid ring
- User ID must reference a valid user
- Image URL is optional but must be valid if provided
- Posts are permanent and not automatically deleted

## 1.4 Membership Entity

**Entity Name**: Membership

**Purpose and Essence**: Represents the relationship between a User and a Ring, indicating that the user is a member of that Ring. Membership grants access to view and post in the Ring's chat, and to see posts from that Ring in the News Feed.

**Attributes**:
- `id`: UUID (Primary Key) - Unique identifier for the membership
- `user_id`: UUID (Foreign Key to User.id, Not Null) - User who is a member
- `ring_id`: UUID (Foreign Key to Ring.id, Not Null) - Ring the user is a member of
- `joined_at`: TIMESTAMP (Not Null) - Timestamp when user joined the ring

**Relationships**:
- Membership to User: Many-to-one (many memberships belong to one user)
- Membership to Ring: Many-to-one (many memberships belong to one ring)

**Constraints**:
- Combination of user_id and ring_id must be unique (user cannot join same ring twice)
- User ID must reference a valid user
- Ring ID must reference a valid ring
- Joined timestamp is automatically set when membership is created

## 1.5 Entity Relationships Summary

**User ↔ Membership**: One-to-many relationship
- One User has many Memberships
- Each Membership belongs to exactly one User
- Cardinality: 1:N

**Ring ↔ Membership**: One-to-many relationship
- One Ring has many Memberships
- Each Membership belongs to exactly one Ring
- Cardinality: 1:N

**User ↔ Post**: One-to-many relationship
- One User creates many Posts
- Each Post is created by exactly one User
- Cardinality: 1:N

**Ring ↔ Post**: One-to-many relationship
- One Ring contains many Posts
- Each Post belongs to exactly one Ring
- Cardinality: 1:N

**User ↔ Ring**: Many-to-many relationship through Membership
- One User can be a member of many Rings
- One Ring can have many User members
- Cardinality: M:N (implemented through Membership junction table)

## 1.6 Database Schema Implementation

**Primary Keys**: All entities use UUID as primary key for distributed system compatibility and security.

**Foreign Keys**: All foreign key relationships are enforced at the database level with referential integrity constraints.

**Indexes**:
- User.username: Unique index for fast username lookup during authentication
- Ring.name: Unique index for fast ring name lookup and uniqueness validation
- Post.ring_id: Index for efficient retrieval of posts by ring
- Post.user_id: Index for efficient retrieval of posts by user
- Post.created_at: Index for efficient chronological ordering of posts
- Membership.user_id: Index for efficient retrieval of user's rings
- Membership.ring_id: Index for efficient retrieval of ring's members
- Membership(user_id, ring_id): Composite unique index to prevent duplicate memberships

**Data Types**:
- UUID: PostgreSQL UUID type for all primary and foreign keys
- VARCHAR: Variable-length strings with specified maximum lengths
- TEXT: Unlimited length text for message content
- TIMESTAMP: PostgreSQL TIMESTAMP type for all date/time fields
