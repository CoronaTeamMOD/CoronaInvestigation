import { Router } from 'express';

import exposureRoute from './ExposureRoute/mainRoute';
import landingPageRoute from './LandingPageRoute/mainRoute';
import investigationInfo from './InvestigationInfo/mainRoute';
import contactEventRoute from './ContactEventsRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';
import authMiddleware from '../middlewares/Authentication';

const clientToDBRouter = Router();

clientToDBRouter.use('/exposure',authMiddleware, exposureRoute);
clientToDBRouter.use('/landingPage',authMiddleware, landingPageRoute);
clientToDBRouter.use('/contactEvents',authMiddleware, contactEventRoute);
clientToDBRouter.use('/investigationInfo',authMiddleware, investigationInfo);
clientToDBRouter.use('/personalDetails',authMiddleware, personalDetailsRoute);
clientToDBRouter.use('/clinicalDetails',authMiddleware, clinicalDetailsRoute);

export default clientToDBRouter;