const API_BASE_URL = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Session expired, redirect to login
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  // Auth
  async register(username: string, password: string) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async login(username: string, password: string) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe() {
    return request('/auth/me');
  },

  // News Feed
  async getNewsFeed(search?: string) {
    const url = search ? `/news-feed?search=${encodeURIComponent(search)}` : '/news-feed';
    return request(url);
  },

  // Rings
  async getRings(search?: string) {
    const url = search ? `/rings?search=${encodeURIComponent(search)}` : '/rings';
    return request(url);
  },

  async createRing(name: string) {
    return request('/rings', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async searchRings(query: string) {
    return request(`/rings/search?q=${encodeURIComponent(query)}`);
  },

  async joinRing(ringId: string) {
    return request(`/rings/${ringId}/join`, {
      method: 'POST',
    });
  },

  async getRing(ringId: string) {
    return request(`/rings/${ringId}`);
  },

  async getRingMembers(ringId: string) {
    return request(`/rings/${ringId}/members`);
  },

  async addMember(ringId: string, username: string) {
    return request(`/rings/${ringId}/members`, {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  // Posts
  async getRingPosts(ringId: string) {
    return request(`/rings/${ringId}/posts`);
  },

  async createPost(ringId: string, messageText: string, imageFile?: File) {
    const formData = new FormData();
    formData.append('messageText', messageText);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/rings/${ringId}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'An error occurred');
    }

    return response.json();
  },
};
