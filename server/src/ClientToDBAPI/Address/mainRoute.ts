import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import City from '../../Models/Address/City';
import Street from '../../Models/Address/Street';
import Country from '../../Models/Address/Country';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import {GET_ALL_CITIES, GET_CITY_STREETS, GET_ALL_COUNTRIES} from '../../DBService/Address/Query';

const addressRoute = Router();

addressRoute.get('/cities', (request: Request, response: Response) => {
  graphqlRequest(GET_ALL_CITIES, response.locals).then((result: any) => {
    let cities: City[] = [];
    if (result && result.data && result.data.allCities) {
      cities = result.data.allCities.nodes.map((city: City) => ({
        id: city.id,
        displayName: city.displayName,
      }));
    } 
      return response.send(cities);
  });
});

addressRoute.get('/city/:cityId/streets', (request: Request, response: Response) => {
  const getStreetsOfCityLogger = logger.setup({
    workflow: 'Getting streets of city',
    investigation: response.locals.epidemiologynumber,
    user: response.locals.user.id
  });
  getStreetsOfCityLogger.info(`launcing DB request with parameter ${request.params.cityId}`,Severity.LOW)
  graphqlRequest(GET_CITY_STREETS, response.locals, {id: request.params.cityId}).then((result: any) => {
    let streets: Street[] = [];
    getStreetsOfCityLogger.info('got response from DB',Severity.LOW)
    if(result && result.data && result.data.cityById && result.data.cityById.streetsByCity){
      getStreetsOfCityLogger.info('got streets from DB',Severity.LOW)
      streets = result.data.cityById.streetsByCity.nodes.map((street: Street) => ({
        id: street.id,
        displayName: street.displayName,
      }));
    } else {
      getStreetsOfCityLogger.warn('didnt get streets from DB',Severity.MEDIUM)
    }
    return response.send(streets);
  }).catch(error => {
    getStreetsOfCityLogger.error(`got error from graphql API ${error}`,Severity.HIGH)
    response.sendStatus(500)
  });
});

addressRoute.get('/countries', (request: Request, response: Response) => {
  graphqlRequest(GET_ALL_COUNTRIES, response.locals).then((result: any) => {
    let countries: Country[] = [];
    if (result && result.data && result.data.allCountries) {
      countries = result.data.allCountries.nodes.map((country: Country) => ({
        id: country.id,
        displayName: country.displayName,
      }));
    } 
      return response.send(countries);
  });
});

export default addressRoute;