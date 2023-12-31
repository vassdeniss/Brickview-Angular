export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  image?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
