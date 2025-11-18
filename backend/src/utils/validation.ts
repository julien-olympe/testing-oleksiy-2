export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < 3 || username.length > 50) {
    return { valid: false, error: 'Username must be 3-50 characters and contain only letters, numbers, and underscores' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username must be 3-50 characters and contain only letters, numbers, and underscores' };
  }
  
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters and contain at least one letter and one number' };
  }
  
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must be at least 8 characters and contain at least one letter and one number' };
  }
  
  return { valid: true };
}

export function validateRingName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Ring name is required' };
  }
  
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 100) {
    return { valid: false, error: 'Ring name must be between 1 and 100 characters.' };
  }
  
  return { valid: true };
}

export function validateMessageText(text: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Message cannot be empty.' };
  }
  
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty.' };
  }
  
  if (trimmed.length > 5000) {
    return { valid: false, error: 'Message must be 5000 characters or less.' };
  }
  
  return { valid: true };
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateImageFile(mimetype: string, filename: string, size: number): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (size > maxSize) {
    return { valid: false, error: 'Image file is too large. Maximum size is 10MB.' };
  }
  
  if (!allowedMimeTypes.includes(mimetype)) {
    return { valid: false, error: 'Unsupported image format. Please use JPEG, PNG, or GIF.' };
  }
  
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: 'Unsupported image format. Please use JPEG, PNG, or GIF.' };
  }
  
  return { valid: true };
}
