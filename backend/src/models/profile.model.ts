//import type { ProfileContext } from "./profile.model"; // Self-import for correctness in IDEs
// But for cross-reference use import type { User } from "./users.model";

export interface Profile {
  id: number;
  name: string;
  userId: number;
  contexts?: ProfileContext[];
}

export interface ProfileContext {
  id: number;
  profileId: number;
  contextId: number;
  displayName?: string;
  visibility: 'public' | 'private' | 'context-members';
}
