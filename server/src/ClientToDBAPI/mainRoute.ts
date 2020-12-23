import { Router } from 'express';

import addressRoute from './Address/mainRoute';
import usersRoute from './UsersRoute/mainRoute';
import desksRoute from './DesksRoute/mainRoute';
import educationRoute from './Education/mainRoute';
import exposureRoute from './ExposureRoute/mainRoute';
import countiesRoute from './CountiesRoute/mainRoute';
import authMiddleware from '../middlewares/Authentication';
import landingPageRoute from './LandingPageRoute/mainRoute';
import investigationInfo from './InvestigationInfo/mainRoute';
import contactedPeopleRoute from './ContactedPeople/mainRoute';
import intersectionsRoute from './IntersectionsRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';
import groupedInvestigationsRoute from './GroupedInvestigationsRoute/mainRoute';

const clientToDBRouter = Router();
clientToDBRouter.use(authMiddleware);
clientToDBRouter.use('/desks', desksRoute);
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
clientToDBRouter.use('/groupedInvestigations', groupedInvestigationsRoute)
clientToDBRouter.use('/education', educationRoute)

export default clientToDBRouter;
