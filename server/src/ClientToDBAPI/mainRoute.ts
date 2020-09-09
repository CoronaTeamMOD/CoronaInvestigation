import { Router } from 'express';

import exposureRoute from './ExposureRoute/mainRoute';
import landingPageRoute from './LandingPageRoute/mainRoute';
import investigationInfo from './InvestigationInfo/mainRoute';
import intersectionsRoute from './ContactEventRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';
import authMiddleware from '../middlewares/Authentication';

const clientToDBRouter = Router();

clientToDBRouter.use('/exposure',authMiddleware, exposureRoute);
clientToDBRouter.use('/landingPage',authMiddleware, landingPageRoute);
clientToDBRouter.use('/intersections',authMiddleware, intersectionsRoute);
clientToDBRouter.use('/investigationInfo',authMiddleware, investigationInfo);
clientToDBRouter.use('/personalDetails',authMiddleware, personalDetailsRoute);
clientToDBRouter.use('/clinicalDetails',authMiddleware, clinicalDetailsRoute);

export default clientToDBRouter;