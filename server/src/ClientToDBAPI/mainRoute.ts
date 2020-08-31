import { Router } from 'express'

import exposureRoute from './ExposureRoute/mainRoute';
import landingPageRoute from './LandingPageRoute/mainRoute';
import intersectionsRoute from './IntersectionsRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';

const clientToDBRouter = Router();

clientToDBRouter.use('/exposure', exposureRoute);
clientToDBRouter.use('/landingPage', landingPageRoute);
clientToDBRouter.use('/intersections', intersectionsRoute);
clientToDBRouter.use('/clinicalDetails', clinicalDetailsRoute);
clientToDBRouter.use('/personalDetails', personalDetailsRoute);

export default clientToDBRouter;