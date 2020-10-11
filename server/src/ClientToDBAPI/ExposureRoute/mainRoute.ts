import { subDays } from 'date-fns';
import { Router, Request, Response } from 'express';

import Exposure from '../../Models/Exposure/Exposure';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import CovidPatient from '../../Models/Exposure/CovidPatient';
import { UPDATE_EXPOSURES } from '../../DBService/Exposure/Mutation';
import CovidPatientDBOutput, { AddressDBOutput } from '../../Models/Exposure/CovidPatientDBOutput';
import ExposureByInvestigationId from '../../Models/Exposure/ExposureByInvestigationId';
import { GET_EXPOSURE_INFO, GET_EXPOSURE_SOURCE_OPTIONS } from '../../DBService/Exposure/Query';
import OptionalExposureSourcesResponse from '../../Models/Exposure/OptionalExposureSourcesResponse';

const exposureRoute = Router();

const errorStatusCode = 500;
const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;
const invalidCharsRegex = /[^א-ת\da-zA-Z0-9]/;

const searchDaysAmount = 14;

const convertExposuresFromDB = (result: ExposureByInvestigationId) : Exposure[] => {
    const convertedExposures : Exposure[] = result.data.allExposures.nodes.map(exposure => 
    {
        const exposureSource = exposure.covidPatientByExposureSource ? {
            ...exposure.covidPatientByExposureSource,
            address: createAddressString(exposure.covidPatientByExposureSource.addressByAddress)
        } : null;
        
        exposureSource && delete exposureSource.addressByAddress;

        const convertedExposure = {
            ...exposure, 
            exposureSource
        }
        delete convertedExposure.covidPatientByExposureSource;
        return convertedExposure
    })
    return convertedExposures
}

exposureRoute.get('/exposures/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_EXPOSURE_INFO, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: ExposureByInvestigationId) => {
            response.send(convertExposuresFromDB(result));
        })
        .catch(error => {
            console.log(error);
            response.status(errorStatusCode).json({error: 'failed to fetch exposures'})
        })
);

const convertSearchValueToRegex = (searchValue: string) => {
    let searchRegexContent : string;
    if (phoneAndIdentityNumberRegex.test(searchValue)) searchRegexContent = searchValue;
    else searchRegexContent = searchValue.replace(invalidCharsRegex, '%');
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
        age: covidPatient.age,
        address: createAddressString(covidPatient.addressByAddress)
    }))
}

exposureRoute.get('/optionalExposureSources/:searchValue/:coronaTestDate', (request: Request, response: Response) => {
    const searchRegex = convertSearchValueToRegex(request.params.searchValue);
    const dateToStartSearching = subDays(new Date(request.params.coronaTestDate), searchDaysAmount);
    graphqlRequest(GET_EXPOSURE_SOURCE_OPTIONS, response.locals, {searchRegex, dateToStartSearching})
        .then((result: OptionalExposureSourcesResponse) => {
            if (result?.data?.allCovidPatients?.nodes) {
                const dbBCovidPatients: CovidPatientDBOutput[] = result.data.allCovidPatients.nodes;
                response.send(convertCovidPatientsFromDB(dbBCovidPatients));
            } else {
                response.status(errorStatusCode).json({error: 'failed to fetch optional exposure sources'});
            }
        })
        .catch(error => {
            console.log(error);
            response.status(errorStatusCode).json({error: 'failed to fetch optional exposure sources'});
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
    return graphqlRequest(UPDATE_EXPOSURES, response.locals, 
        {inputExposures: JSON.stringify(convertExposuresToDB(request))})
        .then((result) => {
            response.send(result);
        })
        .catch(error => {
            console.log(error);
            response.status(errorStatusCode).json({error: 'failed to save exposures'});
        })
});

export default exposureRoute;