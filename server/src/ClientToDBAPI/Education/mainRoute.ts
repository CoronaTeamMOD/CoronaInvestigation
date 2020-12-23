import { Router, Request, Response } from 'express';

import EducationGrade from '../../Models/Education/EducationGrade';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_ALL_CITIES, GET_CITY_STREETS, GET_ALL_COUNTRIES} from '../../DBService/Address/Query';

const educationRoute = Router();

educationRoute.get('/grades', (request: Request, response: Response) => {
  graphqlRequest(GET_ALL_CITIES, response.locals).then((result: any) => {
    let cities: EducationGrade[] = [];
    if (result && result.data && result.data.allCities) {
      cities = result.data.allCities.nodes.map((city: EducationGrade) => ({
        id: city.id,
        displayName: city.displayName,
      }));
    } 
      return response.send(cities);
  });
});

export default educationRoute;