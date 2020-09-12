import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import Street from '../../Models/Address/Street';
import Country from '../../Models/Address/Country';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_ALL_CITIES, GET_CITY_STREETS, GET_ALL_COUNTRIES} from '../../DBService/Address/Query';

const addressRoute = Router();

addressRoute.get('/cities', (request: Request, response: Response) => {
  graphqlRequest(GET_ALL_CITIES, request.headers).then((result: any) => {
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
  graphqlRequest(GET_CITY_STREETS, request.headers, {id: request.params.cityId}).then((result: any) => {
    let streets: Street[] = [];
    if(result && result.data && result.data.cityById && result.data.cityById.streetsByCity){
      streets = result.data.cityById.streetsByCity.nodes.map((street: Street) => ({
        id: street.id,
        displayName: street.displayName,
      }));
    }
    return response.send(streets);
  });
});

addressRoute.get('/countries', (request: Request, response: Response) => {
  graphqlRequest(GET_ALL_COUNTRIES).then((result: any) => {
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