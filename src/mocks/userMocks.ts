// ===== USER MOCKS =====
// Mock user data for Single-User-Mode (pre-login development)

import { User } from '@/types/user';

/**
 * Mock User - Simuliert eingeloggten User
 * 
 * Später ersetzt durch:
 * - Auth-Service (Login/Register)
 * - API-Call für User-Daten
 * - Token-basierte Authentifizierung
 */
export const mockUser: User = {
  id: 'user-001',
  name: 'Max Mustermann',
  email: 'max.mustermann@example.com',
  avatar: undefined, // Später: Profilbild-URL
  createdAt: new Date('2024-01-15'),
};

/**
 * Mock Users für Testing (später)
 */
export const mockUsers: User[] = [
  mockUser,
  {
    id: 'user-002',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@example.com',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-003',
    name: 'Tom Weber',
    email: 'tom.weber@example.com',
    createdAt: new Date('2024-03-10'),
  },
];
