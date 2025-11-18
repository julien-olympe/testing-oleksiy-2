export interface User {
  id: string;
  username: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Ring {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  isMember?: boolean;
}

export interface Post {
  id: string;
  ringId: string;
  ringName?: string;
  userId: string;
  username: string;
  messageText: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}
