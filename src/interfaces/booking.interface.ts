enum RoomType {
  PresidentialSuite = 'Presidential Suite',
}

export interface Booking {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  roomType: RoomType;
}
