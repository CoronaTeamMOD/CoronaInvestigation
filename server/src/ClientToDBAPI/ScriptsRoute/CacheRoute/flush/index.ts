import { Router } from 'express';
import getFlush from './getFlush';
const router = Router();

router.get('/', getFlush);

export default router;

