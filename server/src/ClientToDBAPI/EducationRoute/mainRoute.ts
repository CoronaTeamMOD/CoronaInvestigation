import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import UseCache, { setToCache } from '../../middlewares/useCache';
import EducationGrade from '../../Models/Education/EducationGrade';
import { GET_ALL_EDUCATION_GRADES } from '../../DBService/Education/Query';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const educationRoute = Router();

educationRoute.get('/grades', UseCache, (request: Request, response: Response) => {
  const allEducationGradesLogger = logger.setup({
    workflow: 'query all education grades',
    investigation: response.locals.epidemiologynumber,
    user: response.locals.user.id
  });
  allEducationGradesLogger.info(launchingDBRequestLog(), Severity.LOW);
  graphqlRequest(GET_ALL_EDUCATION_GRADES, response.locals)
  .then((result: any) => {
    allEducationGradesLogger.info(validDBResponseLog, Severity.LOW);
    const data = result.data.allEducationGrades.nodes;
    setToCache(request.originalUrl, data);
    response.send(data);
  })
  .catch(error => {
    allEducationGradesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
    response.send(error);
  });
});

export default educationRoute;