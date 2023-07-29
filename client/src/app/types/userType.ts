import { Set } from './setType';

export interface User {
  username: string;
  email: string;
  image?: string;
  sets: Set[];
}
