import { Router } from 'express';

import addFlight from './addFlight';
import getFlightsByAirlineId from './getFlightsByAirlineId';
import { adminMiddleWare } from '../../../middlewares/Authentication';

const router = Router();
router.get('/:airlineId', getFlightsByAirlineId);
router.post('/flight', adminMiddleWare, addFlight);

export default router;