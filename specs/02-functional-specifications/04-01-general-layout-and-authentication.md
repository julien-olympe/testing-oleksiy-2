# 4. Screens - Part 1: General Layout and Authentication

This section describes the general layout structure and authentication screen for the Rings platform.

## 4.1 General Layout

All authenticated screens in Rings follow a consistent layout structure:

**Header**: No persistent header is displayed on most screens. Screen-specific content appears at the top.

**Main Content Area**: The primary content area occupies the center of the screen and is scrollable when content exceeds viewport height.

**Footer Navigation**: A persistent footer navigation bar is fixed at the bottom of all authenticated screens (except Login screen). The footer contains five navigation buttons arranged horizontally:

1. **Home**: Navigates to Home screen (News Feed)
2. **My Rings**: Navigates to My Rings screen
3. **Find Ring**: Navigates to Find Ring screen
4. **Create Ring**: Navigates to Create Ring screen
5. **Settings**: Navigates to Settings screen

The footer remains visible and accessible on all screens, allowing users to quickly navigate between main sections of the application.

**Responsive Design**: The layout adapts to different screen sizes:
- Desktop: Content area is centered with maximum width constraints
- Mobile: Content area uses full width, footer buttons are appropriately sized for touch interaction

## 4.2 Login Screen

**Screen Name**: Login Screen

**Purpose**: Provides user authentication interface for both registration and login.

**Layout**:
- Centered form container on the page
- Two tabs or sections: "Login" and "Register"
- No footer navigation (user is not authenticated)

**Components**:

**Registration Form** (when Register tab/section is active):
- Username input field (text, required)
- Password input field (password type, required)
- Register button
- Validation error messages displayed below form fields

**Login Form** (when Login tab/section is active):
- Username input field (text, required)
- Password input field (password type, required)
- Login button
- Validation error messages displayed below form fields

**Related Use Cases**:
- User Registration (3.1): Registration form submission
- User Login (3.2): Login form submission

**Navigation**:
- After successful registration or login, user is automatically redirected to Home screen
- No navigation to other screens until authentication is complete
