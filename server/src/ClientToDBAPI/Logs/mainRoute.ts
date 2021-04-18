import { Router } from 'express';

import Routes from './routes';
import logController from './Log';

const router = Router();
router.use(Routes.log , logController);

export default router;