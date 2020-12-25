import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import EducationGrade from '../../Models/Education/EducationGrade';
import { GET_ALL_EDUCATION_GRADES } from '../../DBService/Education/Query';
import logger from '../../Logger/Logger';
import { Severity } from '../../Models/Logger/types';

const educationRoute = Router();

educationRoute.get('/grades', (request: Request, response: Response) => {
  const allEducationGradesLogger = logger.setup({
    workflow: 'Query all education grades',
    investigation: response.locals.epidemiologynumber,
    user: response.locals.user.id
  });
  allEducationGradesLogger.info('launching server request', Severity.LOW);
  graphqlRequest(GET_ALL_EDUCATION_GRADES, response.locals)
  .then((result: any) => {
    const grades: EducationGrade[] = result?.data?.allEducationGrades?.nodes;
    if (grades) {
      allEducationGradesLogger.info('the query got valid response from db', Severity.LOW);
      response.send(grades);
    } else {
      const errorMessage = result?.errors ? result.errors[0]?.message : undefined;
      allEducationGradesLogger.info(`the query got invalid response from db due to ${errorMessage}`, Severity.HIGH);
      response.send(errorMessage);
    }
  })
  .catch(error => {
    allEducationGradesLogger.info(`the query got invalid response from db due to ${error}`, Severity.HIGH);
    response.send(error);
  });
});

export default educationRoute;