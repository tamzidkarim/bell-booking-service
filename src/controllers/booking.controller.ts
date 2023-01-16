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
      const createBookingData = await this.bookingService.createBooking(bookingData);

      res.status(201).json({ data: createBookingData, message: 'Your booking was successful' });
    } catch (error) {
      next(error);
    }
  };

  public viewBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const bookingData: Booking = await this.bookingService.viewBooking(id);

      res.status(200).json({ data: bookingData, message: 'Booking details' });
    } catch (error) {
      next(error);
    }
  };

  public cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const bookingData: Booking = await this.bookingService.cancelBooking(id);

      res.status(200).json({ data: bookingData, message: 'Your booking was cancelled' });
    } catch (error) {
      next(error);
    }
  };
}

export default BookingController;
