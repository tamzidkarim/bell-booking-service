import { Router } from 'express';
import BookingController from '@controllers/booking.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateBookingDto } from '@dtos/booking.dto';

class BookingRoute implements Routes {
  public path = '/bookings';
  public router = Router();
  public bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(CreateBookingDto, 'body'), this.bookingController.createBooking);
    this.router.get(`${this.path}/:id`, this.bookingController.viewBooking);
    this.router.get(`${this.path}/:id/cancel`, this.bookingController.cancelBooking);
  }
}

export default BookingRoute;
