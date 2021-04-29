import { Router } from 'express';

import Routes from './routes';
import flightsController from './Flights';
import airlineController from './Airlines';

const router = Router();
router.use(Routes.airlines, airlineController);
router.use(Routes.flights, flightsController);

export default router;