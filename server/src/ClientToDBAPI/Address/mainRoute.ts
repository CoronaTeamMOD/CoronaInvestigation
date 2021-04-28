import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import Street from '../../Models/Address/Street';
import Country from '../../Models/Address/Country';
import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/useCache';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_ALL_CITIES, GET_CITY_STREETS, GET_ALL_COUNTRIES} from '../../DBService/Address/Query';
import logger, { invalidDBResponseLog, validDBResponseLog, launchingDBRequestLog} from '../../Logger/Logger';

const addressRoute = Router();

addressRoute.get('/cities', UseCache, (request: Request, response: Response) => {
    const citiesLogger = logger.setup({
      workflow: 'query all cities',
      investigation: response.locals.epidemiologynumber,
      user: response.locals.user.id
    });
    citiesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_CITIES, response.locals)
    .then((result: any) => {
      const data = result.data.allCities.nodes;
      citiesLogger.info(validDBResponseLog, Severity.LOW);
      setToCache(request.originalUrl, data);
      response.send(data);
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
      response.send(result.data.cityById.streetsByCity.nodes);
    }).catch(error => {
        streetsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.status(errorStatusCode).send(error);
    });
});

addressRoute.get('/countries', UseCache, (request: Request, response: Response) => {
  const countriesLogger = logger.setup({
    workflow: 'query all countries',
    investigation: response.locals.epidemiologynumber,
    user: response.locals.user.id
  });
  countriesLogger.info(launchingDBRequestLog(), Severity.LOW);
  graphqlRequest(GET_ALL_COUNTRIES, response.locals)
  .then((result: any) => {
      const data = result.data.allCountries.nodes;

      countriesLogger.info(validDBResponseLog, Severity.LOW);
      setToCache(request.originalUrl , data);
      response.send(data);
  })
  .catch(error => {
      countriesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
      response.status(errorStatusCode).send(error);
  });
});

export default addressRoute;