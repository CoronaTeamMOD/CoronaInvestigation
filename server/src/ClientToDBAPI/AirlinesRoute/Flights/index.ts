import { Router } from 'express';

import getFlightsByAirlineId from './getFlightsByAirlineId';

const router = Router();
router.get('/:airlineId', getFlightsByAirlineId);

export default router;