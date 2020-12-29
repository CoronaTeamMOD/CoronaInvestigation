import { subDays } from 'date-fns';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import Exposure from '../../Models/Exposure/Exposure';
import { getPatientAge } from '../../Utils/patientUtils';
import CovidPatient from '../../Models/Exposure/CovidPatient';
import { UPDATE_EXPOSURES } from '../../DBService/Exposure/Mutation';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import ExposureByInvestigationId from '../../Models/Exposure/ExposureByInvestigationId';
import { GET_EXPOSURE_INFO, GET_EXPOSURE_SOURCE_OPTIONS } from '../../DBService/Exposure/Query';
import CovidPatientDBOutput, { AddressDBOutput } from '../../Models/Exposure/CovidPatientDBOutput';
import OptionalExposureSourcesResponse from '../../Models/Exposure/OptionalExposureSourcesResponse';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';

const exposureRoute = Router();

const phoneOrIdentityNumberRegex = /^([\da-zA-Z]+)$/;
const invalidCharsRegex = /[^א-ת\da-zA-Z0-9]/;

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

exposureRoute.get('/exposures/:investigationId', (request: Request, response: Response) => {
    const exposuresLogger = logger.setup({
        workflow: 'query all exposures of investigation',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {investigationId: parseInt(request.params.investigationId)};
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

const convertSearchValueToRegex = (searchValue: string, isPhoneOrIdentityNumber: boolean) => {
    let searchRegexContent : string;
    if (isPhoneOrIdentityNumber) searchRegexContent = searchValue;
    else searchRegexContent = searchValue.replace(new RegExp(invalidCharsRegex, 'g'), '%');
    return `%${searchRegexContent}%`
}

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
    if (invalidCharsRegex.test(searchValue[lastIndexValue])) {
        trimmedSerachValue = trimmedSerachValue.slice(0, lastIndexValue);
    }
    const complicatedRegex = new RegExp(trimmedSerachValue.replace(new RegExp(invalidCharsRegex, 'g'), '[ -]+[^0-9A-Za-z]*') + '*');
    return patientsToFilter.filter(patient => complicatedRegex.test(patient.fullName) === true);
}

exposureRoute.get('/optionalExposureSources/:searchValue/:coronaTestDate', (request: Request, response: Response) => {
    const searchValue : string = request.params.searchValue || '';
    const isPhoneOrIdentityNumber = phoneOrIdentityNumberRegex.test(searchValue);
    const searchRegex = convertSearchValueToRegex(searchValue, isPhoneOrIdentityNumber);
    const dateToStartSearching = subDays(new Date(request.params.coronaTestDate), searchDaysAmount);

    const optionalExposureSourcesLogger = logger.setup({
        workflow: 'query optioanl exposures sources by regex and date',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });

    const parameters = {searchRegex, dateToStartSearching};
    optionalExposureSourcesLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_EXPOSURE_SOURCE_OPTIONS, response.locals, parameters)
    .then((result: OptionalExposureSourcesResponse) => {
        optionalExposureSourcesLogger.info(validDBResponseLog, Severity.LOW);
        let dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
        if (!isPhoneOrIdentityNumber) {
            dbBCovidPatients = filterCovidPatientsByRegex(searchValue, dbBCovidPatients);
        }
        response.send(convertCovidPatientsFromDB(dbBCovidPatients));
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

exposureRoute.post('/updateExposures', (request: Request, response: Response) => {
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

export default exposureRoute;