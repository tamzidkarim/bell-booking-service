import request from 'supertest';
import App from '../app';
import { BookingRoute } from '../routes';
import { CreateBookingDto } from '../dtos/booking.dto';
import dayjs from 'dayjs';
import { RoomType, BookingStatus } from '../interfaces/booking.interface';

const bookingData: CreateBookingDto = {
  email: 'a@a.com',
  firstName: 'John',
  lastName: 'Doe',
  checkIn: dayjs('2023-01-21').toDate(),
  checkOut: dayjs('2023-01-23').toDate(),
  totalGuests: 3,
  roomType: RoomType.PresidentialSuite,
};

describe('Testing Bookings', () => {
  const bookingRoute = new BookingRoute();
  const app = new App([bookingRoute]);

  describe('Create a Booking || [POST] /api/v1.0/bookings', () => {
    it('should create a new booking', async () => {
      const createBooking = await request(app.getServer()).post('/api/v1.0/bookings').send(bookingData);

      expect(createBooking.statusCode).toBe(201);
      expect(createBooking.body.data).toHaveProperty('id');
      expect(createBooking.body.data).toHaveProperty('cancelLink');
      expect(createBooking.body.data).toHaveProperty('detailsLink');
    });

    it('should return 400 and error message if total guests is more than 3', async () => {
      const createBooking = await request(app.getServer())
        .post('/api/v1.0/bookings')
        .send({ ...bookingData, totalGuests: 4 });

      expect(createBooking.statusCode).toBe(400);
      expect(createBooking.body).toHaveProperty('message');
      expect(createBooking.body.message).toBe('Maximum guests is 3');
    });

    it('should return 400 and error message if checkin or checkout dates are past dates', async () => {
      const createBooking = await request(app.getServer())
        .post('/api/v1.0/bookings')
        .send({ ...bookingData, checkIn: dayjs('2022-01-21').toDate() });

      expect(createBooking.statusCode).toBe(400);
      expect(createBooking.body).toHaveProperty('message');
      expect(createBooking.body.message).toBe('Check in and check out dates must be in the future');
    });

    it('should return 400 and error message if duration is more than 3 days', async () => {
      const createBooking = await request(app.getServer())
        .post('/api/v1.0/bookings')
        .send({ ...bookingData, checkIn: dayjs('2023-01-21').toDate(), checkOut: dayjs('2023-01-28').toDate() });

      expect(createBooking.statusCode).toBe(400);
      expect(createBooking.body).toHaveProperty('message');
      expect(createBooking.body.message).toBe('Maximum stay is 3 days');
    });
  });

  describe('Retrieve Booking Information || [GET] /api/v1.0/bookings/:id', () => {
    it('should return booking information', async () => {
      const createBooking = await request(app.getServer()).post('/api/v1.0/bookings').send(bookingData);

      const findBooking = await request(app.getServer()).get(`/api/v1.0/bookings/${createBooking.body.data.id}`);

      expect(findBooking.statusCode).toBe(200);
      expect(findBooking.body.data).toHaveProperty('id');
      expect(findBooking.body.data).toHaveProperty('status');
      expect(findBooking.body.data).toHaveProperty('email');
      expect(findBooking.body.data.roomType).toBe(RoomType.PresidentialSuite);
      expect(findBooking.body.data.status).toBe(BookingStatus.Confirmed);
    });

    it('should return 404 if booking does not exist', async () => {
      const findBooking = await request(app.getServer()).get(`/api/v1.0/bookings/123`);

      expect(findBooking.statusCode).toBe(404);
    });
  });

  describe('Cancel A Booking || [GET] /api/v1.0/bookings/:id/cancel', () => {
    it('should cancel a booking', async () => {
      const createBooking = await request(app.getServer()).post('/api/v1.0/bookings').send(bookingData);

      const findBooking = await request(app.getServer()).get(`/api/v1.0/bookings/${createBooking.body.data.id}/cancel`);

      expect(findBooking.statusCode).toBe(200);
      expect(findBooking.body.data).toHaveProperty('id');
      expect(findBooking.body.data).toHaveProperty('status');
      expect(findBooking.body.data.status).toBe(BookingStatus.Cancelled);
    });
    it('should return 404 if booking does not exist', async () => {
      const findBooking = await request(app.getServer()).get(`/api/v1.0/bookings/123/cancel`);

      expect(findBooking.statusCode).toBe(404);
    });
  });
});
