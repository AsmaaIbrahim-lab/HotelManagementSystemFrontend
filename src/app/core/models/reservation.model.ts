export enum ReservationStatus {
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled'
}

export interface Reservation {
  id: number;
  guestName: string;
  roomId: number;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: ReservationStatus | string;
  createdAt?: string;
}

export interface CreateReservationRequest {
  roomId: number;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface ReservationSearchQuery {
  guestName?: string;
  roomNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  status?: string;
}
