import axios from 'axios';
import {useSelector} from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import {fieldsNames, Exposure } from 'commons/Contexts/ExposuresAndFlights';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import ResortData from 'models/ResortData';
import { FormData } from 'components/App/Content/InvestigationForm/TabManagement/ExposuresAndFlights/ExposuresAndFlightsInterfaces';

const exposureDeleteCondition = 
    (wereFlights: boolean, wereConfirmedExposures: boolean) : (exposure: Exposure) => boolean => {
    if (!wereConfirmedExposures) {
        return (exposure: Exposure) => exposure.exposureSource !== undefined
    };
    if (!wereFlights) {
        return (exposure: Exposure) => exposure.flightDestinationCountry !== undefined
    };
    return (exposure: Exposure) => false;
}


interface DBExposure extends Omit<Exposure, 'exposureAddress'> {
    exposureAddress: string|null;
}

const useExposuresSaving = () => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);

    const saveResortsData = (data : ResortData) : Promise<void> => {
        let { wasInEilat, wasInDeadSea } = data;
        const saveResortsDataLogger = logger.setup('Saving investigated patient resort data');
        saveResortsDataLogger.info('launching the server request', Severity.LOW);
        setIsLoading(true);
        return axios.post('/investigationInfo/resorts', {
            wasInEilat,
            wasInDeadSea,
            id: investigatedPatientId,
        });
    } 

    const saveExposureAndFlightData = async (data : FormData , ids : (number | null)[]) : Promise<void> => {
        let { exposures, wereFlights, wereConfirmedExposures } = data;
        const formattedExposure = exposures ? formatExposures(exposures , ids) : [];
        let exposuresToDelete : number[] = [];
        let filteredExposures : (Exposure | DBExposure)[] = [];
        const saveExposureAndFlightDataLogger = logger.setup('Saving Exposures And Flights');

        if (!wereFlights && !wereConfirmedExposures) {
            exposuresToDelete = formattedExposure.map((exposure : any) => exposure.id).filter((id : number) => id);
        } else {
            const filterCondition = exposureDeleteCondition(wereFlights, wereConfirmedExposures);
            formattedExposure.forEach((exposure : Exposure) => {
                if (filterCondition(exposure)) {
                    exposure.id && exposuresToDelete.push(exposure.id);
                } else {
                    filteredExposures.push(exposure);
                }
            });
            filteredExposures = (filteredExposures as Exposure[]).map(extractExposureData);
        }
        saveExposureAndFlightDataLogger.info('launching the server request', Severity.LOW);

        return axios.post('/exposure/updateExposures', {
            exposures: filteredExposures,
            investigationId: epidemiologyNumber,
            exposuresToDelete
        });
    }

    const formatExposures = (exposures : Exposure[] , ids : (number|null)[] ) : Exposure[] => {
        return exposures.map((exposure : Exposure , i : number) => {return {...exposure , id : ids[i]}} )
    }

    const extractExposureData =  (exposuresAndFlightsData : Exposure) => {
        let exposureAndDataToReturn: (Exposure | DBExposure) = exposuresAndFlightsData;
        if (exposuresAndFlightsData.flightDestinationCountry !== undefined) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.wasConfirmedExposure] : false,
                [fieldsNames.wasAbroad]: true,
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
        if (exposuresAndFlightsData.exposureSource !== undefined) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.wasConfirmedExposure] : true,
                [fieldsNames.wasAbroad]: false,
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