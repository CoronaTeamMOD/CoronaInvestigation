import { Router } from 'express';

import postDir from './postDir';

const router = Router();

router.post('/', postDir);

export default router;

