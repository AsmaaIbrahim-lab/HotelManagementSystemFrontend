export interface TopRoomReport {
  roomNumber: string;
  roomType: string;
  reservationCount: number;
  totalRevenue: number;
}

export interface RoomTypeRevenue {
  roomType: string;
  totalReservations: number;
  totalNights: number;
  totalRevenue: number;
}

export interface RevenueReport {
  totalReservations: number;
  totalNights: number;
  totalRevenue: number;
  byRoomType: RoomTypeRevenue[];
}

export interface OccupancyReportItem {
  roomNumber: string;
  roomType: string;
  bookedNights: number;
  availableNights: number;
  occupancyPercentage: number;
}

export interface DateRangeQuery {
  from?: string;
  to?: string;
}
