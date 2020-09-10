import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import Street from '../../Models/Address/Street';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import {GET_ALL_CITIES, GET_CITY_STREETS} from '../../DBService/Address/Query';

const addressRoute = Router();

addressRoute.get('/cities', (request: Request, response: Response) => {
  graphqlRequest(GET_ALL_CITIES).then((result: any) => {
    let cities: City[] = [];
    if (result && result.data && result.data.allCities) {
      cities = result.data.allCities.nodes.map((city: any) => ({
        id: city.id,
        displayName: city.displayName,
      }));
    } 
      return response.send(cities);
  });
});

addressRoute.get('/city/:cityId/streets', (request: Request, response: Response) => {
  graphqlRequest(GET_CITY_STREETS, {id: request.params.cityId}).then((result: any) => {
    let streets: Street[] = [];
    if(result && result.data && result.data.cityById && result.data.cityById.streetsByCity){
      streets = result.data.cityById.streetsByCity.nodes.map((street: any) => ({
        id: street.id,
        displayName: street.displayName,
      }));
    }
    return response.send(streets);
  });
})

export default addressRoute;