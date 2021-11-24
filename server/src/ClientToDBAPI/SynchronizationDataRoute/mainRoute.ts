import axios from 'axios';
import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import { Severity } from '../../Models/Logger/types';
import {ADD_CITY_TEMP, ADD_CITIES_TEMP, ADD_STREETS_TEMP} from '../../DBService/DataSynchronization/mutation';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog  } from '../../Logger/Logger';

const synchronizationRoute = Router();

let streetId : number = 100007; // need to save in db and update each time
// const mohCitiesApiUrl = process.env.CITIES_URL;
// const mohStreetsApiUrl = process.env.STREETS_URL;
const mohCitiesApiUrl = 'https://mohservicesapitest.health.gov.il/api/Lists/edm/israelcities';
const mohStreetsApiUrl = 'https://mohservicesapitest.health.gov.il/api/Lists/edm/israelstreets';

const filterCities = (cities: any) => {
    // or Update_date < last_update_date
    return cities.filter((city: any)=> city.to_date === null || (city.to_date).includes('1/1/1900'));
}

const parseCities = (citis: any) => {
    const filteredCities: any = filterCities(citis)
    return filteredCities.map((city: { Code: string; Description: string; }) => ({'id': city.Code, 'displayName': city.Description}));
}

const filterStreets = (streets: any) => {
    // or Update_date < last_update_date
    return streets.filter((city: any)=> city.To_date === null || (city.To_date).includes('1/1/1900') );
}

const parseStreets = (streets: any, id: number) => {
    const filteredStreets: any = filterStreets(streets)
    return filteredStreets.map((street: { Code: string; Street_desc: string; City_code: string, Street_code: string }) => (
        {'id': String(id++), 'display_name': street.Street_desc, 'city': street.City_code, mho_code: street.Street_code })
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
            const parameters = { syncCitiesInput: JSON.stringify(cities)};

            graphqlRequest(ADD_CITIES_TEMP, res.locals, parameters)
                .then((result: any) => {
                    addCityLogger.info(validDBResponseLog, Severity.LOW);
                })
                .catch(error => {
                    addCityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            // cities.forEach((city: { id: any; displayName: any; }) => {
            //     const cityParamaters = {
            //         id: city.id,
            //         displayName: city.displayName
            //     };
            //     addCityLogger.info(launchingDBRequestLog(cityParamaters), Severity.LOW);
            //     graphqlRequest(ADD_CITY_TEMP, res.locals, cityParamaters)
            //     .then((result: any) => {
            //         addCityLogger.info(validDBResponseLog, Severity.LOW);
            //     })
            //     .catch(error => {
            //         addCityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            //     });
            // });
            // citiesSynchronizationLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            res.send(result.data);
        }).catch((err: any) => {
            console.log('######ERROR -- ' , err)
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
            // get last_update_date from server
            const streets = parseStreets(result.data, streetId)
            const parameters = { syncStreetsInput: JSON.stringify(streets)};
            const addStreetLogger = logger.setup({
                workflow: 'add new city to DB',
            });
            graphqlRequest(ADD_STREETS_TEMP, res.locals, parameters)
                .then((result: any) => {
                    // console.log('!!!!!!!!!!!! streets added succesed')
                    addStreetLogger.info(validDBResponseLog, Severity.LOW);
                })
                .catch(error => {
                    // console.log('&&&&&&&&&&& streets added failed    -->  ', error)
                    addStreetLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });

            streetsSynchronizationLogger.info(launchingAPIRequestLog(result.data[0]), Severity.LOW);
            res.send('streets synchronization successed')
        }).catch((err: any) => {
            // console.log('######ERROR STREETS-- ' , err)
            streetsSynchronizationLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.status(errorStatusCode).send(err);
        });
});

export default synchronizationRoute;