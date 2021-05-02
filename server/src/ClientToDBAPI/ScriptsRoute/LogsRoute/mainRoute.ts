import { Router } from 'express';

import Routes from './routes';
import logController from './log';
import dirController from './dir';

const router = Router();
router.use(Routes.directory, dirController);
router.use(Routes.log , logController);

export default router;