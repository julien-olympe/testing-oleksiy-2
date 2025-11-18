# Rings Application

A messenger-social network application where users create and join Rings (group chatrooms) to post messages and pictures.

## Technology Stack

- **Backend**: Node.js with Fastify framework, TypeScript
- **Frontend**: React with Vite, TypeScript, react-router-dom
- **Database**: PostgreSQL with pg driver
- **Authentication**: Session-based with @fastify/cookie (HTTP-only cookies)
- **Password hashing**: bcrypt (10 salt rounds)
- **File uploads**: @fastify/multipart for image handling
- **CORS**: @fastify/cors

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm

## Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database:
```bash
createdb rings_db
```

2. Update the database connection string in `backend/.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/rings_db
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update `.env` with your database connection and session secret:
```
DATABASE_URL=postgresql://username:password@localhost:5432/rings_db
SESSION_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

5. Run database migration:
```bash
npm run migrate
```

6. Build the TypeScript code:
```bash
npm run build
```

7. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will be running on `http://localhost:3000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

### 4. Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Project Structure

```
/workspace
├── backend/
│   ├── src/
│   │   ├── database/        # Database connection and schema
│   │   ├── middleware/      # Authentication and rate limiting
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Application entry point
│   ├── uploads/            # Image uploads directory (created at runtime)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
└── specs/                  # Project specifications
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### News Feed
- `GET /api/news-feed?search=<ring-name>` - Get news feed posts

### Rings
- `GET /api/rings?search=<query>` - Get user's rings
- `POST /api/rings` - Create new ring
- `GET /api/rings/search?q=<query>` - Search all rings
- `POST /api/rings/:id/join` - Join a ring
- `GET /api/rings/:id` - Get ring details
- `GET /api/rings/:id/members` - Get member count
- `POST /api/rings/:id/members` - Add user to ring

### Posts
- `GET /api/rings/:id/posts` - Get ring posts
- `POST /api/rings/:id/posts` - Create post (multipart/form-data)

### Health Check
- `GET /api/health` - Health check endpoint

## Features

- User registration and authentication with session-based cookies
- Create and join Rings (group chatrooms)
- Post messages with optional images
- News Feed aggregating posts from all user's Rings
- Search functionality for Rings
- Add users to Rings
- Responsive design for mobile and desktop

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- HTTP-only session cookies
- Secure cookie settings (Secure in production, SameSite=strict)
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection (React auto-escaping)
- Rate limiting on all endpoints
- CORS configuration

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin

## Development

The application uses:
- TypeScript for type safety
- Fastify for high-performance backend
- React with Vite for fast frontend development
- PostgreSQL for data persistence
- Session-based authentication

## Notes

- Images are stored in `backend/uploads/images/`
- Database migrations are run via `npm run migrate`
- Frontend polls News Feed and Ring Chat every 30 seconds
- All API endpoints require authentication except `/api/auth/*` and `/api/health`
