import '@/index';
import App from '@/app';
import { IndexRoute, BookingRoute } from '@/routes';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new BookingRoute()]);

app.listen();
