import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { CreateBookingDto } from '@dtos/booking.dto';
import { HttpException } from '@exceptions/HttpException';
import { Booking, BookingStatus } from '@interfaces/booking.interface';
import bookingModel from '@models/booking.model';
import { isEmpty } from '@utils/util';

class BookingService {
  public bookings = bookingModel;

  public async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    if (isEmpty(bookingData)) throw new HttpException(400, 'No booking data provided');

    const today = dayjs();
    const checkInDate = dayjs(bookingData.checkIn);
    const checkOutDate = dayjs(bookingData.checkOut);

    if (checkInDate.isBefore(today) || checkOutDate.isBefore(today))
      throw new HttpException(400, 'Check in and check out dates must be in the future');

    const duration = checkOutDate.diff(checkInDate, 'day');

    if (duration <= 0) throw new HttpException(400, 'Check out date must be after check in date');
    if (duration > 3) throw new HttpException(400, 'Maximum stay is 3 days');

    dayjs(bookingData.checkIn).diff(dayjs(bookingData.checkOut), 'day');
    const createBookingData: Booking = {
      id: uuidv4(),
      name: bookingData.firstName + ' ' + bookingData.lastName,
      ...bookingData,
      status: BookingStatus.Confirmed,
    };
    this.bookings = [...this.bookings, createBookingData];

    return createBookingData;
  }
}

export default BookingService;
