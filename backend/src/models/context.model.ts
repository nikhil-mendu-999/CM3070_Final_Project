import type { ProfileContext } from "./profile.model";
import type { UserContext } from "./users.model";

export interface Context {
  id: number;
  name: string;
  profiles?: ProfileContext[];
  members?: UserContext[];
}
