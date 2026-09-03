export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId?: string;
  email?: string;
  fullName?: string;
}

export interface JwtPayload {
  sub?: string;
  nameid?: string;
  email?: string;
  unique_name?: string;
  exp?: number;
  [key: string]: unknown;
}
