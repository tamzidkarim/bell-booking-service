export enum RoomType {
  PresidentialSuite = 'presidential suite',
}

export enum BookingStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

export interface Booking {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  checkIn: number;
  checkOut: number;
  totalGuests: number;
  roomType: RoomType;
  status: BookingStatus;
}

export interface CreateBookingResponse {
  id: string;
  cancelLink: string;
  detailsLink: string;
}

export interface ViewBookingResponse extends Omit<Booking, 'checkIn' | 'checkOut'> {
  checkIn: string;
  checkOut: string;
}
