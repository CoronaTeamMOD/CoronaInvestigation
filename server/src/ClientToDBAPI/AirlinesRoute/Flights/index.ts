import { Router } from 'express';

import addFlight from './addFlight';
import getFlightsByAirlineId from './getFlightsByAirlineId';

const router = Router();
router.get('/:airlineId', getFlightsByAirlineId);
router.post('/flight', addFlight);

export default router;