import { Router } from 'express';

import Routes from './routes';
import logsRouter from './LogsRoute/mainRoute';

const router = Router();
router.use(Routes.logs, logsRouter);

export default router;