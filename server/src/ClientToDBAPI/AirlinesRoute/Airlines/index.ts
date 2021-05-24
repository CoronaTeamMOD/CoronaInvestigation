import { Router } from 'express';
import UseCache from '../../../middlewares/UseCache';

import getAirlines from './getAirlines';
import addAirline from './addAirline';

const router = Router();
router.get('/', getAirlines);
router.post('/airline', addAirline);

export default router;