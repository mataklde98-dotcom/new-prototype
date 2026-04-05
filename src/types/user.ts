// ===== USER TYPES =====
// TypeScript interfaces for user data

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  // Später erweitern mit:
  // settings?: UserSettings;
  // subscription?: SubscriptionType;
  // etc.
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  language?: string;
}
