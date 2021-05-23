import { Router } from 'express';
import UseCache from '../../../middlewares/UseCache';

import getAirlines from './getAirlines';
import addAirline from './addAirline';

const router = Router();
router.get('/', UseCache, getAirlines);
router.post('/airline', addAirline);

export default router;