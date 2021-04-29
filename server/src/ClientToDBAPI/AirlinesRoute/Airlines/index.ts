import { Router } from 'express';
import UseCache from '../../../middlewares/useCache';

import getAirlines from './getAirlines';

const router = Router();
router.get('/', UseCache, getAirlines);

export default router;