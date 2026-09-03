import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateReservationRequest,
  Reservation,
  ReservationSearchQuery
} from '../models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);
  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${environment.apiUrl}/Reservation/All`);
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${environment.apiUrl}/Reservation/${id}`);
  }

  search(query: ReservationSearchQuery): Observable<Reservation[]> {
    let params = new HttpParams();
    if (query.guestName) params = params.set('guestName', query.guestName);
    if (query.roomNumber) params = params.set('roomNumber', query.roomNumber);
    if (query.checkInDate) params = params.set('checkInDate', query.checkInDate);
    if (query.checkOutDate) params = params.set('checkOutDate', query.checkOutDate);
    if (query.status) params = params.set('status', query.status);
    return this.http.get<Reservation[]>(`${environment.apiUrl}/Reservation/search`, { params });
  }

  create(request: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${environment.apiUrl}/Reservation/Create`, request);
  }

  cancel(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${environment.apiUrl}/Reservation/cancel/${id}`, {});
  }
}
