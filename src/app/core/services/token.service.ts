import { Injectable } from '@angular/core';
import { JwtPayload } from '../models';

const TOKEN_KEY = 'hotel_auth_token';
const EXPIRY_KEY = 'hotel_auth_expiry';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private memoryToken: string | null = null;
  private memoryExpiry: string | null = null;

  setToken(token: string, expiresAt: string): void {
    this.memoryToken = token;
    this.memoryExpiry = expiresAt;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, expiresAt);
  }

  getToken(): string | null {
    if (this.memoryToken) {
      return this.memoryToken;
    }
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      this.memoryToken = stored;
    }
    return this.memoryToken;
  }

  getExpiry(): string | null {
    if (this.memoryExpiry) {
      return this.memoryExpiry;
    }
    const stored = localStorage.getItem(EXPIRY_KEY);
    if (stored) {
      this.memoryExpiry = stored;
    }
    return this.memoryExpiry;
  }

  isTokenExpired(): boolean {
    const expiry = this.getExpiry();
    if (!expiry) {
      return true;
    }
    return new Date(expiry).getTime() <= Date.now();
  }

  clear(): void {
    this.memoryToken = null;
    this.memoryExpiry = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  }

  decodePayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    const payload = this.decodePayload();
    if (!payload) {
      return null;
    }
    const id = payload.sub ?? payload.nameid ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return typeof id === 'string' ? id : null;
  }
}
