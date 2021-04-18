import { Router } from 'express';

import HandleDeveloperRequest from '../../middlewares/HandleDeveloperRequest';

import Routes from './routes';
import logController from './log';

const router = Router();
router.use(HandleDeveloperRequest);
router.use(Routes.log , logController);

export default router;