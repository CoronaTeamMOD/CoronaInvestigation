import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import Street from '../../Models/Address/Street';
import Country from '../../Models/Address/Country';
import { Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_ALL_CITIES, GET_CITY_STREETS, GET_ALL_COUNTRIES} from '../../DBService/Address/Query';
import logger, { invalidDBResponseLog, validDBResponseLog, launchingDBRequestLog} from '../../Logger/Logger';

const addressRoute = Router();

addressRoute.get('/cities', (request: Request, response: Response) => {
    const citiesLogger = logger.setup({
      workflow: 'query all cities',
      investigation: response.locals.epidemiologynumber,
      user: response.locals.user.id
    });
    citiesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_CITIES, response.locals)
    .then((result: any) => {
        citiesLogger.info(validDBResponseLog, Severity.LOW);
        const cities: City[] = result?.data?.allCities?.nodes || [];
        response.send(result?.data?.allCities?.nodes || []);
    })
    .catch(error => {
        citiesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

addressRoute.get('/city/:cityId/streets', (request: Request, response: Response) => {
    const streetsLogger = logger.setup({
      workflow: 'query all streets by city',
      investigation: response.locals.epidemiologynumber,
      user: response.locals.user.id
    });

    const parameters = {id: request.params.cityId};
    streetsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_CITY_STREETS, response.locals, {id: request.params.cityId}).then((result: any) => {
      streetsLogger.info(validDBResponseLog, Severity.LOW);
      const streets: Street[] = result?.data?.cityById?.streetsByCity?.nodes || [];
      response.send(streets);
    }).catch(error => {
        streetsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

addressRoute.get('/countries', (request: Request, response: Response) => {
  const countriesLogger = logger.setup({
    workflow: 'query all countries',
    investigation: response.locals.epidemiologynumber,
    user: response.locals.user.id
  });
  countriesLogger.info(launchingDBRequestLog(), Severity.LOW);
  graphqlRequest(GET_ALL_COUNTRIES, response.locals)
  .then((result: any) => {
      countriesLogger.info(validDBResponseLog, Severity.LOW);
      const countries: Country[] = result?.data?.allCountries?.nodes || [];
      response.send(countries);
  })
  .catch(error => {
      countriesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
      response.status(errorStatusCode).send(error);
  });
});

export default addressRoute;