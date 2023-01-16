import { Router } from 'express';
import BookingController from '@controllers/booking.controller';
import { Routes } from '@interfaces/routes.interface';

class BookingRoute implements Routes {
  public path = '/booking';
  public router = Router();
  public bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.bookingController.index);
  }
}

export default BookingRoute;
