import { Router, Request, Response } from 'express';
import { differenceInYears, subDays } from 'date-fns';

import Exposure from '../../Models/Exposure/Exposure';
import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
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
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting exposures',
        step: `launcing DB request with parameter ${request.params.investigationId}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_EXPOSURE_INFO, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: ExposureByInvestigationId) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting exposures',
                step: 'got response from DB',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.send(convertExposuresFromDB(result));
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting exposures',
                step: `got errors approaching the graphql API ${err}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).send(err);
        })
    }
);

const convertSearchValueToRegex = (searchValue: string, isPhoneOrIdentityNumber: boolean) => {
    let searchRegexContent : string;
    if (isPhoneOrIdentityNumber) searchRegexContent = searchValue;
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

exposureRoute.get('/optionalExposureSources/:searchValue/:coronaTestDate', (request: Request, response: Response) => {
    const searchValue : string = request.params.searchValue || '';
    const isPhoneOrIdentityNumber = phoneOrIdentityNumberRegex.test(searchValue);
    const searchRegex = convertSearchValueToRegex(searchValue, isPhoneOrIdentityNumber);
    const dateToStartSearching = subDays(new Date(request.params.coronaTestDate), searchDaysAmount);

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting exposure source options',
        step: `launcing DB request with parameters ${searchRegex} and ${dateToStartSearching}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    graphqlRequest(GET_EXPOSURE_SOURCE_OPTIONS, response.locals, {searchRegex, dateToStartSearching})
        .then((result: OptionalExposureSourcesResponse) => {
            if (result?.data?.allCovidPatients?.nodes) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting exposure source options',
                    step: 'got response from DB',
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                  });
                  let dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
                  if (!isPhoneOrIdentityNumber) {
                    const complicatedRegex = new RegExp(searchValue.trimRight().replace(new RegExp(invalidCharsRegex, 'g'), '[ -]+[^0-9A-Za-z]*') + '*');
                    dbBCovidPatients = dbBCovidPatients.filter(patient => complicatedRegex.test(patient.fullName) === true);
                  }
                  response.send(convertCovidPatientsFromDB(dbBCovidPatients));
            } else {
                logger.warning({
                    service: Service.SERVER,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting exposure source options',
                    step: 'didnt get exposure source options from DB',
                    investigation: response.locals.epidemiologynumber,
                    user: response.locals.user.id
                });
            }
        })
        .catch(error => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting exposure source options',
                step: `got error when approaching the graphql API: ${error}`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
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

    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Saving Exposures and Flights tab',
        step: `launching update exposures and flights info with the parameters ${inputExposures}`,
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    return graphqlRequest(UPDATE_EXPOSURES, response.locals, inputExposures)
        .then((result) => {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Saving Exposures and Flights tab',
                step: `saved exposures and flights`,
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.send(result);
        })
        .catch(error => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Saving Exposures and Flights tab',
                step: 'error in requesting graphql API request in UPDATE_EXPOSURES request',
                investigation: response.locals.epidemiologynumber,
                user: response.locals.user.id
            });
            response.status(errorStatusCode).send(error)
        })
});

export default exposureRoute;