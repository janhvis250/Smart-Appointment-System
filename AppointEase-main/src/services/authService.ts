interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const STORAGE_KEY = 'appointment_system_user';

// Mock auth functions for frontend development
// These would be replaced with actual API calls in a real application

export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes - in a real app, this would be an API call
  if (email === 'admin@example.com' && password === 'password') {
    const adminUser = {
      id: 'admin-123',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
    return adminUser;
  } else if (email === 'user@example.com' && password === 'password') {
    const regularUser = {
      id: 'user-456',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user' as const
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regularUser));
    return regularUser;
  }
  
  throw new Error('Invalid email or password');
};

export const mockRegister = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  if (email === 'admin@example.com' || email === 'user@example.com') {
    throw new Error('Email already in use');
  }
  
  // Create a new user
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: 'user' as const
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

export const mockLogout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const mockCheckAuth = async (): Promise<User> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const storedUser = localStorage.getItem(STORAGE_KEY);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  
  throw new Error('Not authenticated');
};