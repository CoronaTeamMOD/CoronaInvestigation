import { subDays } from 'date-fns';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import Exposure from '../../Models/Exposure/Exposure';
import { getPatientAge } from '../../Utils/patientUtils';
import CovidPatient from '../../Models/Exposure/CovidPatient';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import ExposureByInvestigationId from '../../Models/Exposure/ExposureByInvestigationId';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import { DELETE_EXPOSURE_BY_ID, UPDATE_EXPOSURES } from '../../DBService/Exposure/Mutation';
import { INVALID_CHARS_REGEX, PHONE_OR_IDENTITY_NUMBER_REGEX } from '../../commons/Regex/Regex';
import { GET_EXPOSURE_INFO, GET_EXPOSURE_SOURCE_OPTIONS } from '../../DBService/Exposure/Query';
import CovidPatientDBOutput, { AddressDBOutput } from '../../Models/Exposure/CovidPatientDBOutput';
import OptionalExposureSourcesResponse from '../../Models/Exposure/OptionalExposureSourcesResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { parse } from 'dotenv/types';

const exposureRoute = Router();

const searchDaysAmount = 14;

const convertExposuresFromDB = (result: ExposureByInvestigationId) : Exposure[] => {
    const convertedExposures : Exposure[] = result.data.allExposures.nodes.map(exposure => 
    {
        let exposureSource = null;
        if (exposure.covidPatientByExposureSource) {
            exposureSource = {
                ...exposure.covidPatientByExposureSource,
                age: getPatientAge(exposure.covidPatientByExposureSource.birthDate),
                address: createAddressString(exposure.covidPatientByExposureSource.addressByAddress)
            };
            delete exposureSource.addressByAddress;
            delete exposureSource.birthDate;
        }
        
        const convertedExposure = {
            ...exposure, 
            exposureSource
        }
        delete convertedExposure.covidPatientByExposureSource;
        return convertedExposure
    })
    return convertedExposures
}

exposureRoute.get('/exposures', handleInvestigationRequest, (request: Request, response: Response) => {
    const epidemiologyNumber = parseInt(response.locals.epidemiologynumber);
    const exposuresLogger = logger.setup({
        workflow: 'query all exposures of investigation',
        user: response.locals.user.id,
        investigation: epidemiologyNumber
    });

    const parameters = {investigationId: epidemiologyNumber};
    exposuresLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_EXPOSURE_INFO, response.locals, parameters)
        .then((result: ExposureByInvestigationId) => {
            exposuresLogger.info(validDBResponseLog, Severity.LOW);
            response.send(convertExposuresFromDB(result));
        })
        .catch(error => {
            exposuresLogger.error(invalidDBResponseLog(error), Severity.HIGH);
            response.status(errorStatusCode).send(error);
        })
    }
);

const createAddressString = (address: AddressDBOutput) : string => {
    const addressParts = [];
    if (address) {
        address.streetByStreet && addressParts.push(address.streetByStreet.displayName);
        address.houseNum ? addressParts.push(address.houseNum + ',') : addressParts.push(',');
        address.cityByCity && addressParts.push(address.cityByCity.displayName);
        address.floor && addressParts.push('קומה ' + address.floor);
    }
    return addressParts.join(' ');
}

const convertCovidPatientsFromDB = (dbBCovidPatients: CovidPatientDBOutput[]) :  CovidPatient[] => {
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
    const searchValue : string = request.params.searchValue || '';
    const searchInt = isNaN(parseInt(searchValue)) ? 0 : parseInt(searchValue);
    const isPhoneOrIdentityNumber = PHONE_OR_IDENTITY_NUMBER_REGEX.test(searchValue);
    const searchEndDate = new Date(request.params.validationDate);
    const searchStartDate = subDays(searchEndDate, searchDaysAmount);
    const parameters = {searchValue, searchInt, searchStartDate, searchEndDate}
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

const convertExposuresToDB = (request: Request) => {
    const convertedExposures = request.body.exposures.map((exposure: Exposure) => 
    ({
        ...exposure, exposureSource: exposure.exposureSource ? exposure.exposureSource.epidemiologyNumber : null
    }))
    return {...request.body, exposures: convertedExposures}
}

exposureRoute.post('/updateExposures',handleInvestigationRequest, (request: Request, response: Response) => {
    const updateExposuresLogger = logger.setup({
        workflow: `saving investigation's exposures`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {inputExposures: JSON.stringify(convertExposuresToDB(request))}
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

exposureRoute.delete('/deleteExposure',handleInvestigationRequest, (request: Request, response: Response) => {
    const deleteExposureLogger = logger.setup({
        workflow: `deleting investigation's exposure by id`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    console.log(request.query)
    const parameters = {exposureId: parseInt(request.query.exposureId as string)};
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

export default exposureRoute;