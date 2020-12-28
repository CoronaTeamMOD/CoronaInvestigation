import { Router, Request, Response } from 'express';
import { differenceInYears, subDays } from 'date-fns';

import Exposure from '../../Models/Exposure/Exposure';
import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Severity } from '../../Models/Logger/types';
import CovidPatient from '../../Models/Exposure/CovidPatient';
import { UPDATE_EXPOSURES } from '../../DBService/Exposure/Mutation';
import CovidPatientDBOutput, { AddressDBOutput } from '../../Models/Exposure/CovidPatientDBOutput';
import ExposureByInvestigationId from '../../Models/Exposure/ExposureByInvestigationId';
import { GET_EXPOSURE_INFO, GET_EXPOSURE_SOURCE_OPTIONS } from '../../DBService/Exposure/Query';
import OptionalExposureSourcesResponse from '../../Models/Exposure/OptionalExposureSourcesResponse';

const exposureRoute = Router();

const errorStatusCode = 500;
const phoneOrIdentityNumberRegex = /^([\da-zA-Z]+)$/;
const invalidCharsRegex = /[^א-ת\da-zA-Z0-9]/;

const searchDaysAmount = 14;

const getPatientAge = (birthDate: Date) : number => {
    if (birthDate) return differenceInYears(new Date(), new Date(birthDate));
    return -1;
}

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
        workflow: 'Getting exposures',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    exposuresLogger.info(`launcing DB request with parameter ${request.params.investigationId}`, Severity.LOW);
    graphqlRequest(GET_EXPOSURE_INFO, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: ExposureByInvestigationId) => {
            exposuresLogger.info('got response from DB', Severity.LOW);
            response.send(convertExposuresFromDB(result));
        })
        .catch(err => {
            exposuresLogger.error(`got errors approaching the graphql API ${err}`, Severity.HIGH);
            response.status(errorStatusCode).send(err);
        })
    }
);

const convertSearchValueToRegex = (searchValue: string, isPhoneOrIdentityNumber: boolean) => {
    let searchRegexContent : string;
    if (isPhoneOrIdentityNumber) {
        searchRegexContent = searchValue;
    }
    else searchRegexContent = searchValue.replace(new RegExp(invalidCharsRegex, 'g'), '%');
    return `%${searchRegexContent}%`
}

const createAddressString = (address: AddressDBOutput) => {
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
    patientsToFilter = patientsToFilter.filter(patient => complicatedRegex.test(patient.fullName) === true);
    return patientsToFilter;
}

exposureRoute.get('/optionalExposureSources/:searchValue/:coronaTestDate', (request: Request, response: Response) => {
    const searchValue : string = request.params.searchValue || '';
    const searchInt = isNaN(parseInt(searchValue)) ? 0 : parseInt(searchValue);
    const isPhoneOrIdentityNumber = phoneOrIdentityNumberRegex.test(searchValue);
    const dateToStartSearching = subDays(new Date(request.params.coronaTestDate), searchDaysAmount);
    const optionalExposureSourcesLogger = logger.setup({
        workflow: 'Getting exposure source options',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    optionalExposureSourcesLogger.info(`launcing DB request with parameters ${searchValue} and ${dateToStartSearching}`, Severity.LOW);
    graphqlRequest(GET_EXPOSURE_SOURCE_OPTIONS, response.locals, {searchValue, searchInt})
        .then((result: OptionalExposureSourcesResponse) => {
            if (result?.data?.allCovidPatients?.nodes) {
                optionalExposureSourcesLogger.info('got response from DB', Severity.LOW);
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
            optionalExposureSourcesLogger.error(`got error when approaching the graphql API: ${error}`, Severity.HIGH);
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
    const inputExposures = {inputExposures: JSON.stringify(convertExposuresToDB(request))}
    const updateExposuresLogger = logger.setup({
        workflow: 'Saving Exposures and Flights tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    updateExposuresLogger.info(`launching update exposures and flights info with the parameters ${inputExposures}`, Severity.LOW);
    return graphqlRequest(UPDATE_EXPOSURES, response.locals, inputExposures)
        .then((result) => {
            updateExposuresLogger.info('saved exposures and flights', Severity.LOW);
            response.send(result);
        })
        .catch(error => {
            updateExposuresLogger.error('error in requesting graphql API request in UPDATE_EXPOSURES request', Severity.HIGH);
            response.status(errorStatusCode).send(error)
        })
});

export default exposureRoute;