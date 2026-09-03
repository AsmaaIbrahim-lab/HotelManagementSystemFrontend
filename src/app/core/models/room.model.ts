export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  isAvailable: boolean;
}

export interface CreateRoomRequest {
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
}

export interface UpdateRoomRequest extends CreateRoomRequest {}

export interface AvailableRoomsQuery {
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  checkInDate?: string;
  checkOutDate?: string;
}
