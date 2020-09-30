import {useSelector} from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import {fieldsNames, ExposureAndFlightsDetailsAndSet, Exposure } from 'commons/Contexts/ExposuresAndFlights';

import axios from '../axios';
import useDBParser from '../vendor/useDBParsing';

const exposureDeleteCondition = 
    (wereFlights: boolean, wereConfirmedExposures: boolean) : (exposure: Exposure) => boolean => {
    if (!wereConfirmedExposures) return (exposure: Exposure) => exposure.wasConfirmedExposure;
    if (!wereFlights) return (exposure: Exposure) => exposure.wasAbroad;
    return (exposure: Exposure) => false;
}


const useExposuresSaving = (exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const {parseLocation} = useDBParser();

    const saveExposureAndFlightData = async () : Promise<void> => {
        const { exposures, wereFlights, wereConfirmedExposures, exposuresToDelete } = exposuresAndFlightsVariables.exposureAndFlightsData;
        let filteredExposures : Exposure[] = [];
        const filterCondition : (exposure: Exposure) => boolean = exposureDeleteCondition(wereFlights, wereConfirmedExposures);
        exposures.forEach(exposure => {
            if (filterCondition(exposure)) {
                exposuresToDelete.push(exposure.id);
            } else {
                filteredExposures.push(exposure);
            }
        })
        const exposuresPromises = filteredExposures.map(async exposure => await extractExposureData(exposure));
        filteredExposures = await Promise.all(exposuresPromises);
        
        return axios.post('/exposure/updateExposures', {
            exposures: filteredExposures,
            investigationId: epidemiologyNumber,
            exposuresToDelete
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