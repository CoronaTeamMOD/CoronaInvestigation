import { Router } from 'express';

import addAirline from './addAirline';
import getAirlines from './getAirlines';
import { adminMiddleWare } from '../../../middlewares/Authentication';

const router = Router();
router.get('/', getAirlines);
router.post('/airline',adminMiddleWare, addAirline);

export default router;