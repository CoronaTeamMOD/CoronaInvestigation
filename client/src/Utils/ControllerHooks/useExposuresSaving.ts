import {useSelector} from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import {fieldsNames, ExposureAndFlightsDetailsAndSet, Exposure } from 'commons/Contexts/ExposuresAndFlights';

import axios from '../axios';
import useDBParser from '../vendor/useDBParsing';

const useExposuresSaving = (exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const {parseLocation} = useDBParser();

    const saveExposureAndFlightData = async () : Promise<void> => {
        let { exposures } = exposuresAndFlightsVariables.exposureAndFlightsData;
        const exposuresPromises = exposures.map(async exposure => await extractExposureData(exposure));
        exposures = await Promise.all(exposuresPromises);
        
        return axios.post('/exposure/updateExposures', {
            exposures,
            investigationId: epidemiologyNumber
        });
    }

    const extractExposureData = async (exposuresAndFlightsData : Exposure ) => {
        let exposureAndDataToReturn = exposuresAndFlightsData;
        if (!exposuresAndFlightsData.wasConfirmedExposure) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.firstName]: '',
                [fieldsNames.lastName]: '',
                [fieldsNames.date]: undefined,
                [fieldsNames.address]: null,
                [fieldsNames.placeType]: null,
                [fieldsNames.placeSubType] : null,
            }
        } else {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                // @ts-ignore
                exposureAddress: await parseLocation(exposuresAndFlightsData.exposureAddress)
            }
        }
        if (!exposuresAndFlightsData.wasAbroad) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.destinationCountry]: null,
                [fieldsNames.destinationCity]: '',
                [fieldsNames.destinationAirport]: '',
                [fieldsNames.originCountry]: null,
                [fieldsNames.originCity]: '',
                [fieldsNames.originAirport]: '',
                [fieldsNames.flightStartDate]: undefined,
                [fieldsNames.flightEndDate]: undefined,
                [fieldsNames.airline]: '',
                [fieldsNames.flightNumber]: ''
            }
        }
        return exposureAndDataToReturn;
    }

    return {
        saveExposureAndFlightData
    }
};

export default useExposuresSaving;