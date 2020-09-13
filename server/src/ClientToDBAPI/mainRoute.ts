import { Router } from 'express';

import addressRoute from './Address/mainRoute';
import exposureRoute from './ExposureRoute/mainRoute';
import landingPageRoute from './LandingPageRoute/mainRoute';
import investigationInfo from './InvestigationInfo/mainRoute';
import intersectionsRoute from './IntersectionsRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';
import callRoute from './CallRoute/mainRoute'
import authMiddleware from '../middlewares/Authentication';

const clientToDBRouter = Router();
clientToDBRouter.use(authMiddleware);
clientToDBRouter.use('/call',authMiddleware, callRoute);
clientToDBRouter.use('/exposure', exposureRoute);
clientToDBRouter.use('/landingPage', landingPageRoute);
clientToDBRouter.use('/intersections', intersectionsRoute);
clientToDBRouter.use('/investigationInfo', investigationInfo);
clientToDBRouter.use('/personalDetails', personalDetailsRoute);
clientToDBRouter.use('/clinicalDetails', clinicalDetailsRoute);
clientToDBRouter.use('/addressDetails', addressRoute);

export default clientToDBRouter;