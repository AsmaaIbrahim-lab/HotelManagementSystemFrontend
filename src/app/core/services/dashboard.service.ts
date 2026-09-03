import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OccupancySummary } from '../models';
import { Reservation } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getOccupancySummary(): Observable<OccupancySummary> {
    return this.http.get<OccupancySummary>(`${environment.apiUrl}/GetDashboardSummary/dashboard/summary`);
  }

  getRecentReservations(take = 10): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${environment.apiUrl}/GetDashboardSummary/recent`, {
      params: { take: take.toString() }
    });
  }
}
