import { Router } from 'express';

import Routes from './routes';
import logsRouter from './LogsRoute/mainRoute';
import cacheRouter from './CacheRoute/mainRoute';
import HandleDeveloperRequest from '../../middlewares/HandleDeveloperRequest';

const router = Router();

router.use(HandleDeveloperRequest);
router.use(Routes.logs, logsRouter);
router.use(Routes.cache, cacheRouter);

export default router;