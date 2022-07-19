import { subDays } from 'date-fns';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import Exposure from '../../Models/Exposure/Exposure';
import { getPatientAge } from '../../Utils/patientUtils';
import CovidPatient from '../../Models/Exposure/CovidPatient';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import {  ExposureDetailsDB, FlightDB } from '../../Models/Exposure/ExposureByInvestigationId';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import { DELETE_EXPOSURE_BY_ID, UPDATE_EXPOSURES } from '../../DBService/Exposure/Mutation';
import { INVALID_CHARS_REGEX, PHONE_OR_IDENTITY_NUMBER_REGEX } from '../../commons/Regex/Regex';
import CovidPatientDBOutput, { AddressDBOutput } from '../../Models/Exposure/CovidPatientDBOutput';
import OptionalExposureSourcesResponse from '../../Models/Exposure/OptionalExposureSourcesResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { GET_EXPOSURE_DATA, GET_EXPOSURE_INFO, GET_EXPOSURE_SOURCE_OPTIONS, GET_EXPOSURE_SOURCE_BY_PERSONAL_DETAILS, GET_EXPOSURE_SOURCE_BY_EPIDEMIOLOGY_NUMBER, GET_ALL_BORDER_CHECKPOINT_TYPES, GET_ALL_BORDER_CHECKPOINTS, FILTER_EXPOSURE_SOURCE } from '../../DBService/Exposure/Query';


const exposureRoute = Router();

const searchDaysAmount = 14;



 const convertExposureFromDB = (exposure: any) => {  

    const convertExposureDetails = exposure.exposureDetailsByExposureId.nodes.map((exposureDetails: ExposureDetailsDB) => {
        let exposureSource = null;
        if ( exposureDetails.covidPatientByExposureSource) {
            exposureSource = {
                ...exposureDetails.covidPatientByExposureSource,
                age: getPatientAge(exposureDetails.covidPatientByExposureSource.birthDate),
                address: createAddressString(exposureDetails.covidPatientByExposureSource.addressByAddress),
            };
            delete exposureSource.addressByAddress;
            delete exposureSource.birthDate;
        }
        const convertedExposure = {
            ...exposureDetails,
            exposureSource,
        }
        delete convertedExposure.covidPatientByExposureSource;
        return convertedExposure; 
    })


    const convertFlights = exposure.flightsByExposureId.nodes.map((flight: FlightDB) => {
        const convertedFlight = {
            ...flight,
            flightOriginCountry: flight.countryByFlightOriginCountry,
            flightDestinationCountry: flight.countryByFlightDestinationCountry,
            airline: flight.airlineByAirlineId,
            actionFlag:'U',
        }
        delete convertedFlight.countryByFlightOriginCountry;
        delete convertedFlight.countryByFlightDestinationCountry;
        delete convertedFlight.airlineByAirlineId;
        return convertedFlight;
    }); 

    const convertExposure = {
        ...exposure,
        exposureDetails:convertExposureDetails,
        flights: convertFlights,
        borderCheckpoint: exposure.borderCheckpointByBorderCheckpoint,
        arrivalTimeToIsrael: exposure.arrivalTimeToIsrael ? new Date(`01/01/2022 ${exposure.arrivalTimeToIsrael.toString()}`) : null,
        lastDestinationCountry : exposure.countryByLastDestinationCountry,
    }
    delete convertExposure.exposureDetailsByExposureId;
    delete convertExposure.flightsByExposureId;
    delete convertExposure.borderCheckpointByBorderCheckpoint;
    delete convertExposure.countryByLastDestinationCountry;

    return convertExposure;
 }

exposureRoute.get('/exposures', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const exposuresLogger = logger.setup({
        workflow: 'query all exposures of investigation',
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });

    const parameters = { investigationId: epidemiologyNumber };
    exposuresLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_EXPOSURE_DATA, response.locals, parameters)
        .then((result: any) => {
            exposuresLogger.info(validDBResponseLog, Severity.LOW);
            if (result.data.allExposures.nodes.length > 0 ){
                response.send(convertExposureFromDB(result.data.allExposures.nodes[0]));
            }
            else {
                response.send(null);
            } 
        })
        .catch(error => {
            exposuresLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
}
);

const createAddressString = (address: AddressDBOutput): string => {
    const addressParts = [];
    if (address) {
        address.streetByStreet && addressParts.push(address.streetByStreet.displayName);
        address.houseNum ? addressParts.push(address.houseNum + ',') : addressParts.push(',');
        address.cityByCity && addressParts.push(address.cityByCity.displayName);
        address.floor && addressParts.push('קומה ' + address.floor);
    }
    return addressParts.join(' ');
}

const convertCovidPatientsFromDB = (dbBCovidPatients: CovidPatientDBOutput[]): CovidPatient[] => {
    return dbBCovidPatients.map(covidPatient => ({
        fullName: covidPatient.fullName,
        identityNumber: covidPatient.identityNumber,
        primaryPhone: covidPatient.primaryPhone,
        epidemiologyNumber: covidPatient.epidemiologyNumber,
        age: getPatientAge(covidPatient.birthDate),
        address: createAddressString(covidPatient.addressByAddress)
    }))
}

const filterCovidPatientsByRegex = (searchValue: string, patientsToFilter: CovidPatientDBOutput[]) => {
    let trimmedSerachValue = searchValue;
    const lastIndexValue = trimmedSerachValue.length - 1;
    if (INVALID_CHARS_REGEX.test(searchValue[lastIndexValue])) {
        trimmedSerachValue = trimmedSerachValue.slice(0, lastIndexValue);
    }
    const complicatedRegex = new RegExp(trimmedSerachValue.replace(new RegExp(INVALID_CHARS_REGEX, 'g'), '[ -]+[^0-9A-Za-z]*') + '*');
    return patientsToFilter.filter(patient => complicatedRegex.test(patient.fullName) === true);
}

exposureRoute.get('/optionalExposureSources/:searchValue/:validationDate', handleInvestigationRequest, (request: Request, response: Response) => {
    const searchValue: string = request.params.searchValue || '';
    const searchInt = isNaN(parseInt(searchValue)) ? 0 : parseInt(searchValue);
    const isPhoneOrIdentityNumber = PHONE_OR_IDENTITY_NUMBER_REGEX.test(searchValue);
    const searchEndDate = new Date(request.params.validationDate);
    const searchStartDate = subDays(searchEndDate, searchDaysAmount);
    const parameters = { searchValue, searchInt, searchStartDate, searchEndDate }
    const optionalExposureSourcesLogger = logger.setup({
        workflow: 'query optioanl exposures sources by regex and date',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    optionalExposureSourcesLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_EXPOSURE_SOURCE_OPTIONS, response.locals, parameters)
        .then((result: OptionalExposureSourcesResponse) => {
            if (result?.data?.allCovidPatients?.nodes) {
                optionalExposureSourcesLogger.info(validDBResponseLog, Severity.LOW);
                let dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
                if (!isPhoneOrIdentityNumber) {
                    dbBCovidPatients = filterCovidPatientsByRegex(searchValue, dbBCovidPatients);
                }
                response.send(convertCovidPatientsFromDB(dbBCovidPatients));
            } else {
                optionalExposureSourcesLogger.warn('didnt get exposure source options from DB', Severity.MEDIUM);
            }
        })
        .catch(error => {
            optionalExposureSourcesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.sendStatus(errorStatusCode);
        })
});

const getFilterObject = (fullName: string, phone: string, epidemiologyNumber: number, validationDate: Date) => {
    const searchEndDate = new Date(validationDate);
    const searchStartDate = subDays(searchEndDate, searchDaysAmount);
    const filterObj = {
        validationDate: { greaterThanOrEqualTo: searchStartDate, lessThanOrEqualTo: searchEndDate }
    };
    if (fullName && phone && epidemiologyNumber){
        return {
           ...filterObj, 
            or: {
                and: {
                    fullName: { includes: fullName },
                    primaryPhone: { includes: phone }
                }, epidemiologyNumber: { equalTo: epidemiologyNumber }
            }
        }
    }  
    else if (fullName && phone) {
        return {
           ...filterObj, 
            fullName: { equalTo: fullName },
            primaryPhone: { equalTo: phone }
        }
    }
    else if (epidemiologyNumber) {
        return {
            ...filterObj,
            epidemiologyNumber: { equalTo: epidemiologyNumber }
        }
    }
    else {
        return filterObj;
    }

}

// exposureRoute.get('/findExposures', handleInvestigationRequest, (request: Request, response: Response) => {
//     const { validationDate, fullname, phone, epidemiologyNumber } = request.query;


//     const filter = getFilterObject(
//         fullname.toString(),
//         phone,
//         epidemiologyNumber ? epidemiologyNumber as unknown as number : null,
//         validationDate ? validationDate as unknown as Date : null
//     );

//     const parameters = {
//         filter 
//     }

//     const exposuresByPersonalDetailsLogger = logger.setup({
//         workflow: 'query exposures by personal details',
//         user: response.locals.user.id,
//         investigation: response.locals.epidemiologynumber
//     });

//     exposuresByPersonalDetailsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
//     graphqlRequest(FILTER_EXPOSURE_SOURCE, response.locals, parameters)
//         .then(result => {
//             if (result?.data?.allCovidPatients?.nodes) {
//                 exposuresByPersonalDetailsLogger.info(validDBResponseLog, Severity.LOW);
//                 let dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
//                 response.send(convertCovidPatientsFromDB(dbBCovidPatients));
//             } else {
//                 exposuresByPersonalDetailsLogger.warn('didnt get exposure source options from DB', Severity.MEDIUM);
//                 response.send([]);
//             }
//         })
//         .catch(err => {
//             exposuresByPersonalDetailsLogger.error(invalidDBResponseLog(err), Severity.HIGH);
//             response.sendStatus(errorStatusCode);
//         })
// });



exposureRoute.get('/exposuresByPersonalDetails/:validationDate', handleInvestigationRequest, (request: Request, response: Response) => {
    const { validationDate } = request.params;
    const { name, phoneNum } = request.query;

    const searchEndDate = new Date(validationDate);
    const searchStartDate = subDays(searchEndDate, searchDaysAmount);

    const parameters = {
        name,
        phoneNum,
        startDate: searchStartDate,
        endDate: searchEndDate
    }

    const exposuresByPersonalDetailsLogger = logger.setup({
        workflow: 'query exposures by personal details',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    exposuresByPersonalDetailsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_EXPOSURE_SOURCE_BY_PERSONAL_DETAILS, response.locals, parameters)
        .then(result => {
            if (result?.data?.allCovidPatients?.nodes) {
                exposuresByPersonalDetailsLogger.info(validDBResponseLog, Severity.LOW);
                let dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
                response.send(convertCovidPatientsFromDB(dbBCovidPatients));
            } else {
                exposuresByPersonalDetailsLogger.warn('didnt get exposure source options from DB', Severity.MEDIUM);
                response.send([]);
            }
        })
        .catch(err => {
            exposuresByPersonalDetailsLogger.error(invalidDBResponseLog(err), Severity.HIGH);
            response.sendStatus(errorStatusCode);
        })
});

exposureRoute.get('/exposuresByEpidemiologyNumber/:validationDate', handleInvestigationRequest, (request: Request, response: Response) => {
    const { validationDate } = request.params;
    const epidemiologyNumber = typeof request.query.epidemiologyNumber === 'string' ? parseInt(request.query.epidemiologyNumber) : 0;

    const searchEndDate = new Date(validationDate);
    const searchStartDate = subDays(searchEndDate, searchDaysAmount);

    const parameters = {
        epidemiologyNumber,
        startDate: searchStartDate,
        endDate: searchEndDate
    }

    const exposuresByEpidemiologyNumberLogger = logger.setup({
        workflow: 'query exposures by personal details',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    graphqlRequest(GET_EXPOSURE_SOURCE_BY_EPIDEMIOLOGY_NUMBER, response.locals, parameters)
        .then(result => {
            if (result?.data?.allCovidPatients?.nodes) {
                exposuresByEpidemiologyNumberLogger.info(validDBResponseLog, Severity.LOW);
                let dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
                response.send(convertCovidPatientsFromDB(dbBCovidPatients));
            } else {
                exposuresByEpidemiologyNumberLogger.warn('didnt get exposure source options from DB', Severity.MEDIUM);
                response.send([]);
            }
        })
        .catch(err => {
            exposuresByEpidemiologyNumberLogger.error(invalidDBResponseLog(err), Severity.HIGH);
            response.sendStatus(errorStatusCode);
        })
});

const convertExposuresToDB = (request: Request) => {

    let convertedExposure = request.body;
    let convertedFlights = convertedExposure.flights.map((flight:FlightDB) => {
      let convertedFlight = flight;
      convertedFlight = {
          ...convertedFlight,
          airline: convertedFlight.airline?.id,
          flightOriginCountry: convertedFlight.flightOriginCountry?.id,
          flightDestinationCountry: convertedFlight.flightDestinationCountry?.id,
          flightStartDate: convertedFlight.flightStartDate ? new Date(convertedFlight.flightStartDate) : null,
          flightEndDate: convertedFlight.flightEndDate ? new Date(convertedFlight.flightEndDate) : null
      }
      return convertedFlight;
    });
    convertedExposure = {
        ...convertedExposure,
        arrivalDateToIsrael: convertedExposure.arrivalDateToIsrael ? new Date(convertedExposure.arrivalDateToIsrael) : null,
        arrivalTimeToIsrael: convertedExposure.arrivalTimeToIsrael ? new Date(convertedExposure.arrivalTimeToIsrael) : null,
        borderCheckpoint: convertedExposure.borderCheckpoint ? convertedExposure.borderCheckpoint.id : null,
        lastDestinationCountry: convertedExposure.lastDestinationCountry ? convertedExposure.lastDestinationCountry.id: null,
        investigationId: request.headers.epidemiologynumber,
        flights: convertedFlights,
    };

    return convertedExposure;
}


exposureRoute.post('/updateExposures', handleInvestigationRequest, (request: Request, response: Response) => {
    const updateExposuresLogger = logger.setup({
        workflow: `saving investigation's exposures`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = { inputExposures: JSON.stringify(convertExposuresToDB(request)) }
    updateExposuresLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    return graphqlRequest(UPDATE_EXPOSURES, response.locals, parameters)
        .then((result) => {
            updateExposuresLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            updateExposuresLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error)
        })
});

exposureRoute.delete('/deleteExposure', handleInvestigationRequest, (request: Request, response: Response) => {
    const deleteExposureLogger = logger.setup({
        workflow: `deleting investigation's exposure by id`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    const parameters = { exposureId: parseInt(request.query.exposureId as string) };
    deleteExposureLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    return graphqlRequest(DELETE_EXPOSURE_BY_ID, response.locals, parameters)
        .then((result) => {
            deleteExposureLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            deleteExposureLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error)
        })
});

exposureRoute.get('/borderCheckpointTypes', (request: Request, response: Response) => {
    const borderCheckpointTypesLogger = logger.setup({
        workflow: 'query all border checkpoint types',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    borderCheckpointTypesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_BORDER_CHECKPOINT_TYPES, response.locals)
        .then((result: any) => {
            borderCheckpointTypesLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allBorderCheckpointTypes.nodes);
        })
        .catch(error => {
            borderCheckpointTypesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})


exposureRoute.get('/borderCheckpoints', (request: Request, response: Response) => {
    const borderCheckpointsLogger = logger.setup({
        workflow: 'query all border checkpoints',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    borderCheckpointsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_BORDER_CHECKPOINTS, response.locals)
        .then((result: any) => {
            borderCheckpointsLogger.info(validDBResponseLog, Severity.LOW);
            response.send(result.data.allBorderCheckpoints.nodes);
        })
        .catch(error => {
            borderCheckpointsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        });
})

export default exposureRoute;