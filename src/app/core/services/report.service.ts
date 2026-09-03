import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DateRangeQuery,
  OccupancyReportItem,
  RevenueReport,
  TopRoomReport,
  RoomTypeRevenue


} from '../models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);

  getTopRooms(take = 5): Observable<TopRoomReport[]> {
    return this.http.get<TopRoomReport[]>(`${environment.apiUrl}/Reports/top-rooms`, {
      params: { take: take.toString() }
    });
  }

  getRevenue(query: DateRangeQuery): Observable<RevenueReport> {
    let params = new HttpParams();
    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);
    return this.http.get<RevenueReport>(`${environment.apiUrl}/Reports/revenue`, { params });
  }

  getOccupancy(query: DateRangeQuery): Observable<OccupancyReportItem[]> {
    let params = new HttpParams();
    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);
    return this.http.get<OccupancyReportItem[]>(`${environment.apiUrl}/Reports/occupancy`, { params });
  }
}
