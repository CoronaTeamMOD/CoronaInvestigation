import { Router } from 'express';

import addressRoute from './Address/mainRoute';
import usersRoute from './UsersRoute/mainRoute';
import exposureRoute from './ExposureRoute/mainRoute';
import authMiddleware from '../middlewares/Authentication';
import landingPageRoute from './LandingPageRoute/mainRoute';
import investigationInfo from './InvestigationInfo/mainRoute';
import contactedPeopleRoute from './ContactedPeople/mainRoute';
import intersectionsRoute from './IntersectionsRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';
import countiesRoute from './CountiesRoute/mainRoute';
import districtsRoute from './DistrictsRoute/mainRoute'

const clientToDBRouter = Router();
clientToDBRouter.use(authMiddleware);
clientToDBRouter.use('/exposure', exposureRoute);
clientToDBRouter.use('/landingPage', landingPageRoute);
clientToDBRouter.use('/intersections', intersectionsRoute);
clientToDBRouter.use('/investigationInfo', investigationInfo);
clientToDBRouter.use('/personalDetails', personalDetailsRoute);
clientToDBRouter.use('/clinicalDetails', clinicalDetailsRoute);
clientToDBRouter.use('/addressDetails', addressRoute);
clientToDBRouter.use('/contactedPeople', contactedPeopleRoute);
clientToDBRouter.use('/users', usersRoute);
clientToDBRouter.use('/counties', countiesRoute);
clientToDBRouter.use('/districts', districtsRoute);

export default clientToDBRouter;
