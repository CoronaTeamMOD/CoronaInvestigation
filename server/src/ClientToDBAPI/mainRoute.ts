import { Router } from 'express';

import addressRoute from './Address/mainRoute';
import usersRoute from './UsersRoute/mainRoute';
import desksRoute from './DesksRoute/mainRoute';
import scriptsRoute from './ScriptsRoute/mainRoute';
import exposureRoute from './ExposureRoute/mainRoute';
import airlinesRoute from './AirlinesRoute/mainRoute';
import countiesRoute from './CountiesRoute/mainRoute';
import educationRoute from './EducationRoute/mainRoute';
import AuthorityRoute from './AuthorityRoute/mainRoute';
import districtsRoute from './DistrictsRoute/mainRoute';
import authMiddleware from '../middlewares/Authentication';
import landingPageRoute from './LandingPageRoute/mainRoute';
import investigationInfo from './InvestigationInfo/mainRoute';
import contactedPeopleRoute from './ContactedPeople/mainRoute';
import intersectionsRoute from './IntersectionsRoute/mainRoute';
import personalDetailsRoute from './PersonalDetailsRoute/mainRoute';
import clinicalDetailsRoute from './ClinicalDetailsRoute/mainRoute';
import groupedInvestigationsRoute from './GroupedInvestigationsRoute/mainRoute';
import rulerRoute from './RulerRoute/mainRoutes';

const clientToDBRouter = Router();
clientToDBRouter.use('/ruler', rulerRoute);
clientToDBRouter.use(authMiddleware);
clientToDBRouter.use('/users', usersRoute);
clientToDBRouter.use('/desks', desksRoute);
clientToDBRouter.use('/counties', countiesRoute);
clientToDBRouter.use('/exposure', exposureRoute);
clientToDBRouter.use('/education', educationRoute);
clientToDBRouter.use('/districts', districtsRoute);
clientToDBRouter.use('/authorities', AuthorityRoute);
clientToDBRouter.use('/addressDetails', addressRoute);
clientToDBRouter.use('/landingPage', landingPageRoute);
clientToDBRouter.use('/intersections', intersectionsRoute);
clientToDBRouter.use('/investigationInfo', investigationInfo);
clientToDBRouter.use('/personalDetails', personalDetailsRoute);
clientToDBRouter.use('/clinicalDetails', clinicalDetailsRoute);
clientToDBRouter.use('/contactedPeople', contactedPeopleRoute);
clientToDBRouter.use('/groupedInvestigations', groupedInvestigationsRoute);
clientToDBRouter.use('/scripts', scriptsRoute);
clientToDBRouter.use('/airlines', airlinesRoute);

export default clientToDBRouter;