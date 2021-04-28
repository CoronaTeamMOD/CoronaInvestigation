import { Router } from 'express';

import Routes from './routes';
import flushController from './flush';

const router = Router();
//router.use(Routes.cache , logController);
router.use(Routes.flush, flushController);

export default router;