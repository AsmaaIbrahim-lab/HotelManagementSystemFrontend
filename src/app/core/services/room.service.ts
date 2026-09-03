import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AvailableRoomsQuery,
  CreateRoomRequest,
  Room,
  UpdateRoomRequest
} from '../models';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiUrl}/Rooms`);
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(`${environment.apiUrl}/Rooms/${id}`);
  }

  create(request: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(`${environment.apiUrl}/Rooms/Create`, request);
  }

  update(id: number, request: UpdateRoomRequest): Observable<Room> {
    return this.http.put<Room>(`${environment.apiUrl}/Rooms/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Rooms/${id}`);
  }

  searchAvailable(query: AvailableRoomsQuery): Observable<Room[]> {
    let params = new HttpParams();
    if (query.roomType) params = params.set('RoomType', query.roomType);
    if (query.minPrice != null) params = params.set('MinPrice', query.minPrice.toString());
    if (query.maxPrice != null) params = params.set('MaxPrice', query.maxPrice.toString());
    if (query.checkInDate) params = params.set('CheckInDate', query.checkInDate);
    if (query.checkOutDate) params = params.set('CheckOutDate', query.checkOutDate);
    return this.http.get<Room[]>(`${environment.apiUrl}/Rooms/available`, { params });
  }
}
