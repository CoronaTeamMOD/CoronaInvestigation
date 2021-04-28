import { Router } from 'express';

import getAirlines from './getAirlines';

const router = Router();
router.get('/', getAirlines);

export default router;