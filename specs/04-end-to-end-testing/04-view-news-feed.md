# Test: View News Feed (3.3)

## Test Scenario Name
View News Feed - Positive and Negative Test Cases

## Description
This test validates the View News Feed use case (3.3) covering News Feed display, empty states, and post aggregation from multiple Rings.

## Prerequisites
- Application is running and accessible
- User `testuser_news_001` is registered and logged in
- Test data setup as needed for each test case

## Test Case 1: View News Feed with Posts

### Prerequisites
- User `testuser_news_001` is logged in
- User is a member of at least one Ring
- At least one Ring has posts

### Test Steps
1. Navigate to Home Screen (4.3 Home Screen)
2. Verify Home Screen displays:
   - Search bar at the top with placeholder "Search Rings..."
   - News Feed list below the search bar
   - Footer navigation at the bottom
3. Wait for News Feed to load (accounting for polling mechanism, maximum 30 seconds)
4. Verify News Feed displays at least one News Tile
5. Verify each News Tile displays:
   - Ring name (clickable, as per 4.3 Home Screen)
   - Post picture thumbnail (if post has an image, clickable to view full size)
   - First 100 characters of message text (truncated with ellipsis if longer)
   - Post timestamp (relative time, e.g., "2 hours ago")
   - Author username
6. Verify News Tiles are ordered newest first (reverse chronological order, as per 3.3 View News Feed)
7. Click on a News Tile
8. Verify user is navigated to the corresponding Ring Chat screen (4.5 Ring Chat Screen)

### Expected Results
- News Feed displays correctly with all required elements
- Posts are ordered newest first
- News Tiles are clickable and navigate to Ring Chat
- All post information is displayed correctly

## Test Case 2: View Empty News Feed (No Rings)

### Prerequisites
- User `testuser_news_002` is registered and logged in
- User is not a member of any Rings

### Test Steps
1. Navigate to Home Screen
2. Verify Home Screen displays with search bar and footer navigation
3. Wait for News Feed to load
4. Verify News Feed displays empty state message: "No posts yet. Join or create a Ring to see posts here." (3.3 View News Feed)
5. Verify no News Tiles are displayed

### Expected Results
- Empty state message is displayed
- No News Tiles are shown
- User can still navigate using footer buttons

## Test Case 3: View Empty News Feed (Rings with No Posts)

### Prerequisites
- User `testuser_news_003` is logged in
- User is a member of at least one Ring
- All user's Rings have no posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Verify News Feed displays empty state message: "No posts yet. Join or create a Ring to see posts here."
4. Verify no News Tiles are displayed

### Expected Results
- Empty state message is displayed when Rings exist but have no posts
- No News Tiles are shown

## Test Case 4: News Feed with Multiple Rings

### Prerequisites
- User `testuser_news_004` is logged in
- User is a member of at least 3 different Rings
- Each Ring has at least one post

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Verify News Feed displays News Tiles from multiple Rings
4. Verify News Tiles show different Ring names
5. Verify all News Tiles are ordered newest first (regardless of which Ring they belong to)
6. Verify posts from different Rings are interleaved chronologically
7. Verify each News Tile correctly displays the Ring name it belongs to

### Expected Results
- News Feed aggregates posts from all user's Rings
- Posts are ordered chronologically across all Rings
- Ring names are correctly displayed for each post

## Test Case 5: News Feed with Long Messages

### Prerequisites
- User `testuser_news_005` is logged in
- User is a member of a Ring
- Ring has a post with message text longer than 100 characters

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Find a News Tile with a long message (over 100 characters)
4. Verify the News Tile displays only the first 100 characters of the message text
5. Verify the message text is truncated with ellipsis (...) at the end (3.3 View News Feed)
6. Verify clicking on the News Tile navigates to Ring Chat where full message is displayed

### Expected Results
- Long messages are truncated to 100 characters in News Feed
- Ellipsis indicates truncation
- Full message is visible in Ring Chat

## Test Case 6: News Feed with Posts Containing Pictures

### Prerequisites
- User `testuser_news_006` is logged in
- User is a member of a Ring
- Ring has at least one post with a picture

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Find a News Tile for a post that contains a picture
4. Verify the News Tile displays:
   - Post picture thumbnail
   - Picture is clickable (as per 4.3 Home Screen)
5. Click on the picture thumbnail
6. Verify full-size image is displayed (implementation dependent: modal, new page, etc.)

### Expected Results
- Posts with pictures display thumbnails in News Feed
- Picture thumbnails are clickable
- Full-size image can be viewed

## Test Case 7: News Feed with Posts Without Pictures

### Prerequisites
- User `testuser_news_007` is logged in
- User is a member of a Ring
- Ring has at least one post without a picture (text only)

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Find a News Tile for a post that does not contain a picture
4. Verify the News Tile displays:
   - Ring name
   - Message text (first 100 characters)
   - Post timestamp
   - Author username
   - No picture thumbnail is displayed

### Expected Results
- Posts without pictures do not show picture thumbnails
- All other News Tile elements are displayed correctly

## Test Case 8: News Feed Loading Indicator

### Prerequisites
- User `testuser_news_008` is logged in

### Test Steps
1. Navigate to Home Screen
2. Immediately check for loading indicator (as per 4.3 Home Screen: "Loading indicator while fetching data")
3. Wait for News Feed to load
4. Verify loading indicator disappears when News Feed is loaded

### Expected Results
- Loading indicator is displayed while fetching News Feed
- Loading indicator disappears when data is loaded

## Test Case 9: News Feed Refresh (Polling)

### Prerequisites
- User `testuser_news_009` is logged in
- User is a member of a Ring
- Initial News Feed has N posts

### Test Steps
1. Navigate to Home Screen
2. Wait for News Feed to load
3. Count the number of News Tiles displayed
4. Create a new post in the Ring (from another user or in a new browser context)
5. Wait for polling mechanism to refresh (maximum 30 seconds as per 2.4 Main Development Constraints)
6. Verify News Feed updates to show the new post
7. Verify the new post appears at the top of the News Feed (newest first)

### Expected Results
- News Feed automatically refreshes via polling
- New posts appear in the News Feed
- New posts appear at the top (newest first)

## Test Case 10: News Feed Error Handling

### Prerequisites
- User `testuser_news_010` is logged in
- Simulate API failure (network error or server error)

### Test Steps
1. Navigate to Home Screen
2. Simulate API failure for News Feed endpoint
3. Verify error message is displayed: "Unable to load news feed. Please try again." (3.3 View News Feed)
4. Verify user can retry loading the News Feed

### Expected Results
- Error message is displayed when API request fails
- User can retry the operation
- Error message matches specification exactly

## UI Elements Referenced

- **Home Screen** (4.3): Search bar, News Feed list, News Tiles, footer navigation, loading indicator
- **Ring Chat Screen** (4.5): Referenced when clicking News Tiles

## Functional Requirements Referenced

- **3.3 View News Feed**: Complete News Feed viewing use case with aggregation, ordering, and display requirements
