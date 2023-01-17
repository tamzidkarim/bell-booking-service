import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { CreateBookingDto } from '@dtos/booking.dto';
import { HttpException } from '@exceptions/HttpException';
import { Booking, BookingStatus, CreateBookingResponse, ViewBookingResponse } from '@interfaces/booking.interface';
import bookingModel from '@models/booking.model';
import { isEmpty } from '@utils/util';

class BookingService {
  public bookings = bookingModel;

  public async createBooking(bookingData: CreateBookingDto): Promise<CreateBookingResponse> {
    if (isEmpty(bookingData)) throw new HttpException(400, 'No booking data provided');

    const today = dayjs();
    const checkInDate = dayjs(bookingData.checkIn);
    const checkOutDate = dayjs(bookingData.checkOut);

    const findBooking = this.bookings.find(booking => {
      if (
        ((booking.checkIn >= checkInDate.unix() && booking.checkIn <= checkOutDate.unix()) ||
          (booking.checkOut >= checkInDate.unix() && booking.checkOut <= checkOutDate.unix())) &&
        booking.status === BookingStatus.Confirmed
      )
        return true;
    });

    if (findBooking) throw new HttpException(409, `The room is already booked for the selected dates`);

    if (checkInDate.isBefore(today) || checkOutDate.isBefore(today))
      throw new HttpException(400, 'Check in and check out dates must be in the future');

    const duration = checkOutDate.diff(checkInDate, 'day');

    if (duration > 3) throw new HttpException(400, 'Maximum stay is 3 days');

    const createBookingData: Booking = {
      id: uuidv4(),
      name: bookingData.firstName + ' ' + bookingData.lastName,
      ...bookingData,
      checkIn: checkInDate.unix(),
      checkOut: checkOutDate.unix(),
      status: BookingStatus.Confirmed,
    };
    this.bookings = [...this.bookings, createBookingData];

    const responseData = {
      id: createBookingData.id,
      cancelLink: `http://localhost:3000/api/v1.0/bookings/${createBookingData.id}/cancel`,
      detailsLink: `http://localhost:3000/api/v1.0/bookings/${createBookingData.id}`,
    };

    return responseData;
  }

  public async viewBooking(bookingId: string): Promise<ViewBookingResponse> {
    if (isEmpty(bookingId)) throw new HttpException(400, 'No booking id provided');

    const findBooking: Booking = this.bookings.find(booking => booking.id === bookingId);

    if (!findBooking) throw new HttpException(404, 'Booking not found');

    return {
      ...findBooking,
      checkIn: dayjs.unix(findBooking.checkIn).format('YYYY-MM-DD'),
      checkOut: dayjs.unix(findBooking.checkOut).format('YYYY-MM-DD'),
    };
  }

  public async cancelBooking(bookingId: string): Promise<ViewBookingResponse> {
    if (isEmpty(bookingId)) throw new HttpException(400, 'No booking id provided');

    const findBooking: Booking = this.bookings.find(booking => booking.id === bookingId);

    if (!findBooking) throw new HttpException(404, 'Booking not found');

    findBooking.status = BookingStatus.Cancelled;

    return {
      ...findBooking,
      checkIn: dayjs.unix(findBooking.checkIn).format('YYYY-MM-DD'),
      checkOut: dayjs.unix(findBooking.checkOut).format('YYYY-MM-DD'),
    };
  }
}

export default BookingService;
