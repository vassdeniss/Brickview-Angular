import { Set } from './setType';

export interface User {
  username: String;
  email: String;
  image: String;
  sets: Set[];
}
