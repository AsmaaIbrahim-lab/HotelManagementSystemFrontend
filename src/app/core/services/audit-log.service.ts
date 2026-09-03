import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLog, AuditLogSearchQuery, PagedResult } from '../models';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<PagedResult<AuditLog> | AuditLog[]> {
    
    return this.http.get<PagedResult<AuditLog> | AuditLog[]>(`${environment.apiUrl}/AuditLog`);
  }
}
