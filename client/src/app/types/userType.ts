import { Set } from './setType';

export interface User {
  _id: string;
  username: string;
  email: string;
  image?: string;
  sets: Set[];
}
