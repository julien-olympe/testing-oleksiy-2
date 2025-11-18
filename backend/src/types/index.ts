export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface Ring {
  id: string;
  name: string;
  creatorId: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  ringId: string;
  userId: string;
  messageText: string;
  imageUrl: string | null;
  createdAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  ringId: string;
  joinedAt: Date;
}

export interface SessionData {
  userId: string;
  username: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}
