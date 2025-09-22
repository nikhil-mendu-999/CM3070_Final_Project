import type { Profile } from "./profile.model";

export interface User {
  id: number;
  email: string;
  passwordHash?: string;
  profiles?: Profile[];
  contexts?: UserContext[];
  linkedAccounts?: UserLinkedAccount[];
  legalName?: string;
  legalNameVariants?: Record<string, string>;
  preferredName?: string;
  preferredNameVariants?: Record<string, string>;
  username?: string;
  nickname?: string;
  stageName?: string;
  religiousName?: string;
  gender?: string;
  genderVariants?: Record<string, string>;
  pronouns?: string;
  pronounsVariants?: Record<string, string>;
  dateOfBirth?: Date;
  locale?: string;
  profilePhoto?: string;
  fieldVisibilities?: Record<string, 'public' | 'private' | 'context-members'>;
}

export interface UserLinkedAccount {
  id: number;
  provider: string;
  providerId: string;
  displayName?: string;
  avatar?: string;
  profileUrl?: string;
  userId: number;
}

export interface UserContext {
  id: number;
  userId: number;
  contextId: number;
  role: 'member' | 'admin';
}
