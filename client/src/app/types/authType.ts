import { User } from './userType';
import { JwtTokens } from './tokenType';

export interface AuthData {
  user: User;
  tokens: JwtTokens;
  image?: string;
}
