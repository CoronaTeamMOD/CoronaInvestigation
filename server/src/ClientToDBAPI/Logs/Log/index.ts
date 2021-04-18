import { Router } from 'express';

import getLog from './getLog';

const router = Router();

router.get('/', getLog);

export default router;

