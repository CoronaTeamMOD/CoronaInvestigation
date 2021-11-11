import axios from 'axios';
import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import { Severity } from '../../Models/Logger/types';
import {ADD_CITY_TEMP, ADD_CITIES_TEMP} from '../../DBService/DataSynchronization/mutation';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog  } from '../../Logger/Logger';

const synchronizationRoute = Router();
const mohCitiesApiUrl = 'https://mohservicesapitest.health.gov.il/api/Lists/edm/israelcities';
const mohStreetsApiUrl = 'https://mohservicesapitest.health.gov.il/api/Lists/edm/israelstreets';

const parseCities = (citis: any) => {
     return citis.map((city: { Code: string; Description: string; }) => ({'id': city.Code, 'displayName': city.Description}));
}

const parseStreets = (streets: any) => {
    return streets.map((street: { Code: string; Street_desc: string; City_code: string, Street_code: string }) => (
        {'id': '///////', 'display_name': street.Street_desc, 'city': street.City_code, mho_code: street.Street_code })
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
            const cities = parseCities(result);
            const addCityLogger = logger.setup({
                workflow: 'add new city to DB',
            });
            cities.forEach((city: { id: any; displayName: any; }) => {
                const cityParamaters = {
                    id: city.id,
                    displayName: city.displayName
                };
                addCityLogger.info(launchingDBRequestLog(cityParamaters), Severity.LOW);
                graphqlRequest(ADD_CITY_TEMP, res.locals, cityParamaters)
                .then((result: any) => {
                    addCityLogger.info(validDBResponseLog, Severity.LOW);
                })
                .catch(error => {
                    addCityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            });
            res.send(result);
        }).catch((err: any) => {
            const tempResult = [
                {
                    "Code": "0",
                    "Description": "לא רשום",
                    "Description_eng": "NOT WRITED                                                                                          ",
                    "District_code": "0",
                    "Health_district_code": "0",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "from_date": "1/1/1948 12:00:00 AM",
                    "to_date": "1/1/1900 12:00:00 AM",
                    "Municipality_status": "0",
                    "Create_date": "1/1/2000 12:00:00 AM",
                    "Update_date": "1/1/2000 12:00:00 AM"
                },
                {
                    "Code": "5",
                    "Description": "יזרעם",
                    "Description_eng": "                                                                                                    ",
                    "District_code": "62",
                    "Health_district_code": "62",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "from_date": "1/1/1948 12:00:00 AM",
                    "to_date": "12/31/1990 12:00:00 AM",
                    "Municipality_status": "0",
                    "Create_date": "1/1/2000 12:00:00 AM",
                    "Update_date": "1/1/2000 12:00:00 AM"
                },
                {
                    "Code": "7",
                    "Description": "שחר",
                    "Description_eng": "SHAHAR                                                                                              ",
                    "District_code": "61",
                    "Health_district_code": "61",
                    "X_cordinate": "173800",
                    "Y_cordinate": "614200",
                    "from_date": "1/1/1955 12:00:00 AM",
                    "to_date": "1/1/1900 12:00:00 AM",
                    "Municipality_status": "50",
                    "Create_date": "1/1/2000 12:00:00 AM",
                    "Update_date": "1/1/2000 12:00:00 AM"
                },
                {
                    "Code": "10",
                    "Description": "תירוש",
                    "Description_eng": "TIROSH                                                                                              ",
                    "District_code": "11",
                    "Health_district_code": "11",
                    "X_cordinate": "189500",
                    "Y_cordinate": "628500",
                    "from_date": "1/1/1955 12:00:00 AM",
                    "to_date": "1/1/1900 12:00:00 AM",
                    "Municipality_status": "26",
                    "Create_date": "1/1/2000 12:00:00 AM",
                    "Update_date": "1/1/2000 12:00:00 AM"
                },
            ]
            const cities = parseCities(tempResult);
            const addCityLogger = logger.setup({
                workflow: 'add new city to DB',
            });
            cities.forEach((city: { id: any; displayName: any; }) => {
                const cityParamaters = {
                    id: city.id,
                    displayName: city.displayName
                };
                addCityLogger.info(launchingDBRequestLog(cityParamaters), Severity.LOW);
                graphqlRequest(ADD_CITY_TEMP, res.locals, cityParamaters)
                .then((result: any) => {
                    addCityLogger.info(validDBResponseLog, Severity.LOW);
                })
                .catch(error => {
                    addCityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            });
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
            streetsSynchronizationLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            const streets = parseStreets(result)
            console.log('%%%%           ',streets)
            res.send(result);
        }).catch((err: any) => {
            const tempResult = [
                {
                    "Street_code": "134",
                    "Street_post_code": "",
                    "City_code": "26",
                    "Street_desc": "דרך הטחנה",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "From_date": "1/1/1948 12:00:00 AM",
                    "To_date": "1/1/1900 12:00:00 AM",
                    "Create_date": "1/1/1948 12:00:00 AM",
                    "Update_date": "1/1/1948 12:00:00 AM"
                },
                {
                    "Street_code": "135",
                    "Street_post_code": "",
                    "City_code": "26",
                    "Street_desc": "הורד",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "From_date": "1/1/1948 12:00:00 AM",
                    "To_date": "1/1/1900 12:00:00 AM",
                    "Create_date": "1/1/1948 12:00:00 AM",
                    "Update_date": "1/1/1948 12:00:00 AM"
                },
                {
                    "Street_code": "136",
                    "Street_post_code": "",
                    "City_code": "26",
                    "Street_desc": "החצב",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "From_date": "1/1/1948 12:00:00 AM",
                    "To_date": "1/1/1900 12:00:00 AM",
                    "Create_date": "1/1/1948 12:00:00 AM",
                    "Update_date": "1/1/1948 12:00:00 AM"
                },
                {
                    "Street_code": "137",
                    "Street_post_code": "",
                    "City_code": "26",
                    "Street_desc": "הנרקיס",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "From_date": "1/1/1948 12:00:00 AM",
                    "To_date": "1/1/1900 12:00:00 AM",
                    "Create_date": "1/1/1948 12:00:00 AM",
                    "Update_date": "1/1/1948 12:00:00 AM"
                },
                {
                    "Street_code": "138",
                    "Street_post_code": "",
                    "City_code": "26",
                    "Street_desc": "התורמוס",
                    "X_cordinate": "0",
                    "Y_cordinate": "0",
                    "From_date": "1/1/1948 12:00:00 AM",
                    "To_date": "1/1/1900 12:00:00 AM",
                    "Create_date": "1/1/1948 12:00:00 AM",
                    "Update_date": "1/1/1948 12:00:00 AM"
                },
            ];

            const streets = parseStreets(tempResult)
            console.log('%%%%           ',streets)
            streetsSynchronizationLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.status(errorStatusCode).send(err);
        });
});

export default synchronizationRoute;