import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { TokenService } from './token.service';
import { SignalRService } from './signalr.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly signalRService = inject(SignalRService);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, request).pipe(
      tap((response) => {
        this.tokenService.setToken(response.token, response.expiresAt);
        void this.signalRService.connect();
      })
    );
  }

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Auth/register`, request);
  }

  logout(): void {
    void this.signalRService.disconnect();
    this.tokenService.clear();
    void this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken() && !this.tokenService.isTokenExpired();
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getCurrentUserId(): string | null {
    return this.tokenService.getUserId();
  }

  initializeSession(): void {
    if (this.isAuthenticated()) {
      void this.signalRService.connect();
    }
  }
}
