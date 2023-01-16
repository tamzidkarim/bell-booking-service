import { Router } from 'express';
import BookingController from '@controllers/booking.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateBookingDto } from '@dtos/booking.dto';

class BookingRoute implements Routes {
  public path = '/booking';
  public router = Router();
  public bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.bookingController.index);
    this.router.post(`${this.path}`, validationMiddleware(CreateBookingDto, 'body'), this.bookingController.createBooking);
  }
}

export default BookingRoute;
