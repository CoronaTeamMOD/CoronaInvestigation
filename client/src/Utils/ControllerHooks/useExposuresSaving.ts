import {useSelector} from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import {fieldsNames, ExposureAndFlightsDetailsAndSet, Exposure } from 'commons/Contexts/ExposuresAndFlights';

import axios from '../axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';

const exposureDeleteCondition = 
    (wereFlights: boolean, wereConfirmedExposures: boolean) : (exposure: Exposure) => boolean => {
    if (!wereConfirmedExposures) return (exposure: Exposure) => exposure.wasConfirmedExposure;
    if (!wereFlights) return (exposure: Exposure) => exposure.wasAbroad;
    return (exposure: Exposure) => false;
}


interface DBExposure extends Omit<Exposure, 'exposureAddress'> {
    exposureAddress: string|null;
}

const useExposuresSaving = (exposuresAndFlightsVariables: ExposureAndFlightsDetailsAndSet) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const saveResortsData = () : Promise<void> => {
        let { wasInEilat, wasInDeadSea } = exposuresAndFlightsVariables.exposureAndFlightsData;
        const saveResortsDataLogger = logger.setup({
            workflow: 'Saving investigated patient resort data',
            user: userId,
            investigation: epidemiologyNumber
        });
        saveResortsDataLogger.info('launching the server request',Severity.LOW)

        return axios.post('/investigationInfo/resorts', {
            wasInEilat,
            wasInDeadSea,
            id: investigatedPatientId,
        });
    } 

    const saveExposureAndFlightData = async () : Promise<void> => {
        let { exposures, wereFlights, wereConfirmedExposures, exposuresToDelete } = exposuresAndFlightsVariables.exposureAndFlightsData;
        let filteredExposures : (Exposure | DBExposure)[] = [];
        const saveExposureAndFlightDataLogger = logger.setup({
            workflow: 'Saving Exposures And Flights',
            user: userId,
            investigation: epidemiologyNumber
        });
        if (!wereFlights && !wereConfirmedExposures) {
            exposuresToDelete = exposures.map(exposure => exposure.id).filter(id => id);
        } else {
            const filterCondition : (exposure: Exposure) => boolean = exposureDeleteCondition(wereFlights, wereConfirmedExposures);
            exposures.forEach(exposure => {
                if (filterCondition(exposure)) {
                    exposure.id && exposuresToDelete.push(exposure.id);
                } else {
                    filteredExposures.push(exposure);
                }
            });
    
            filteredExposures = (filteredExposures as Exposure[]).map(extractExposureData);
        }
        saveExposureAndFlightDataLogger.info('launching the server request',Severity.LOW)
        
        return axios.post('/exposure/updateExposures', {
            exposures: filteredExposures,
            investigationId: epidemiologyNumber,
            exposuresToDelete
        });
    }

    const extractExposureData =  (exposuresAndFlightsData : Exposure ) => {
        let exposureAndDataToReturn: (Exposure | DBExposure) = exposuresAndFlightsData;
        if (!exposuresAndFlightsData.wasConfirmedExposure) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.exposureSource]: null,
                [fieldsNames.date]: undefined,
                [fieldsNames.address]: null,
                [fieldsNames.placeType]: null,
                [fieldsNames.placeSubType] : null,
            }
        } else {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                exposureAddress: exposuresAndFlightsData.exposureAddress ||  null
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
        return (exposureAndDataToReturn as DBExposure);
    }

    return {
        saveExposureAndFlightData,
        saveResortsData
    }
};

export default useExposuresSaving;