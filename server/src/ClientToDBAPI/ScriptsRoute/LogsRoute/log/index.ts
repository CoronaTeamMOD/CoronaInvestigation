import { Router } from 'express';

import getLog from './getLog';
import postLog from './postLog';

const router = Router();

router.get('/', getLog);
router.post('/', postLog);

export default router;

