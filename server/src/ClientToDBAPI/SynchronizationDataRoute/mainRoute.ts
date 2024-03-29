import axios from 'axios';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_LAST_STREET_ID } from '../../DBService/DataSynchronization/Query';
import { ADD_CITIES, ADD_STREETS} from '../../DBService/DataSynchronization/Mutation';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog  } from '../../Logger/Logger';


const synchronizationRoute = Router();

const mohCitiesApiUrl = process.env.CITIES_URL;
const mohStreetsApiUrl = process.env.STREETS_URL;

const filterCities = (cities: any) => {
    return cities.filter((city: any)=> city.to_date === null || (city.to_date).includes('1/1/1900'));
}

const parseCities = (citis: any) => {
    const filteredCities: any = filterCities(citis)
    return filteredCities.map((city: { Code: string; Description: string; District_code: string; }) => 
    ({'id': city.Code, 'display_name': city.Description, 'county_id': parseInt(city.District_code)}));
}

const filterStreets = (streets: any) => {
    return streets.filter((city: any)=> city.To_date === null || (city.To_date).includes('1/1/1900') );
}

const parseStreets = (streets: any, id: number) => {
    const filteredStreets: any = filterStreets(streets)
    return filteredStreets.map((street: { Code: string; Street_desc: string; City_code: string, Street_code: string }) => (
        {'id': id++, 'display_name': street.Street_desc, 'city': parseInt(street.City_code), 'mho_code': parseInt(street.Street_code) })
    );
}

synchronizationRoute.post('/cities/', (req: Request, res: Response) => {
    const citiesSynchronizationLogger = logger.setup({
        workflow: 'cities synchronization to DB',
    });
    citiesSynchronizationLogger.info(launchingAPIRequestLog(), Severity.LOW);
    axios.get(mohCitiesApiUrl)
        .then((result) => {
            citiesSynchronizationLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            // get last_update_date from server
            const cities = parseCities(result.data);
            const addCityLogger = logger.setup({
                workflow: 'add new city to DB',
            });
            const parameters = { syncCitiesInput: JSON.stringify({cities:cities})};

            graphqlRequest(ADD_CITIES, res.locals, parameters)
                .then((result: any) => {
                    addCityLogger.info(validDBResponseLog, Severity.LOW);
                })
                .catch(error => {
                    addCityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            res.send(result.data);
        }).catch((err: any) => {
            citiesSynchronizationLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.status(errorStatusCode).send(err);
        });
});

synchronizationRoute.post('/streets/', (req: Request, res: Response) => {
    const streetsSynchronizationLogger = logger.setup({
        workflow: 'streets synchronization to DB',
    });
    streetsSynchronizationLogger.info(launchingAPIRequestLog(), Severity.LOW);
    axios.get(mohStreetsApiUrl)
        .then((result) => {
            streetsSynchronizationLogger.info(launchingAPIRequestLog(result.data[0]), Severity.LOW);
            const addStreetLogger = logger.setup({
                workflow: 'add new city to DB',
            });

            graphqlRequest(GET_LAST_STREET_ID, res.locals)
                .then((street_id: any) => {
                    let streetId = street_id.data.getLastStreetId?.string ? parseInt(street_id.data.getLastStreetId.string) + 1 : 1;
                    const streets = parseStreets(result.data, streetId)
                    
                    const parameters = { syncStreetsInput: JSON.stringify({streets:streets})};

                    graphqlRequest(ADD_STREETS, res.locals, parameters)
                        .then((result2: any) => {
                            addStreetLogger.info(validDBResponseLog, Severity.LOW);
                        })
                        .catch(error => {
                            addStreetLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                        });
                })
                .catch(error => {
                    addStreetLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            streetsSynchronizationLogger.info(launchingAPIRequestLog(result.data[0]), Severity.LOW);
            res.send('streets synchronization successed')
        }).catch((err: any) => {
            streetsSynchronizationLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.status(errorStatusCode).send(err);
        });
});

export default synchronizationRoute;