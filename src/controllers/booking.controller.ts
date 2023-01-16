import { CreateBookingDto } from '@dtos/booking.dto';
import { Booking } from '@interfaces/booking.interface';
import BookingService from '@services/booking.service';
import { NextFunction, Request, Response } from 'express';

class BookingController {
  public bookingService = new BookingService();

  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingData: CreateBookingDto = req.body;
      const createBookingData: Booking = await this.bookingService.createBooking(bookingData);

      res.status(201).json({ data: createBookingData, message: 'Your booking was successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default BookingController;
