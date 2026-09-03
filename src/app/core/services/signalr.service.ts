import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservation, Room } from '../models';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private readonly tokenService = inject(TokenService);
  private connection: HubConnection | null = null;

  private readonly reservationCreatedSubject = new Subject<Reservation>();
  private readonly reservationCancelledSubject = new Subject<{ id: number }>();
  private readonly roomUpdatedSubject = new Subject<Room>();

  readonly reservationCreated$ = this.reservationCreatedSubject.asObservable();
  readonly reservationCancelled$ = this.reservationCancelledSubject.asObservable();
  readonly roomUpdated$ = this.roomUpdatedSubject.asObservable();

  async connect(): Promise<void> {
    const token = this.tokenService.getToken();
    if (!token) {
      return;
    }

    if (this.connection?.state === HubConnectionState.Connected) {
      return;
    }

    if (this.connection) {
      await this.connection.stop();
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(environment.signalRHubUrl, {
        accessTokenFactory: () => this.tokenService.getToken() ?? ''
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.registerHandlers();

    try {
      await this.connection.start();
    } catch (err) {
      console.error('SignalR connection failed:', err);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  private registerHandlers(): void {
    if (!this.connection) {
      return;
    }

    this.connection.off('reservationCreated');
    this.connection.off('reservationCancelled');
    this.connection.off('roomUpdated');

    this.connection.on('reservationCreated', (reservation: Reservation) => {
      this.reservationCreatedSubject.next(reservation);
    });

    this.connection.on('reservationCancelled', (payload: { id: number }) => {
      this.reservationCancelledSubject.next(payload);
    });

    this.connection.on('roomUpdated', (room: Room) => {
      this.roomUpdatedSubject.next(room);
    });
  }
}
