import request from 'supertest';
import App from '@/app';
import { BookingRoute } from '@/routes';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const bookingRoute = new BookingRoute();
      const app = new App([bookingRoute]);

      return request(app.getServer()).get('/api/v1.0/bookings').expect(200);
    });
  });
});
