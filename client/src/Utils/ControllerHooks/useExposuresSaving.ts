import axios from 'axios';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { fieldsNames, Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { checkUpdateInvestigationExposureReasonId } from 'Utils/ComplexityReasons/ComplexityReasonsFunctions';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import ResortData from 'models/ResortData';
import { BorderCheckpointTypeCodes } from 'models/enums/BorderCheckpointCodes';
import { Flight } from 'models/ExposureAndFlightData';
import { ExposureData } from 'models/ExposureData';

interface DBExposure extends Omit<Exposure, 'exposureAddress'> {
    exposureAddress: string | null;
}

const useExposuresSaving = () => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const complexityReasonsId = useSelector<StoreStateType, (number | null)[]>((state) => state.investigation.complexReasonsId);
    const borderCheckpointId = null; // useSelector<StoreStateType, (number | null | undefined)>(state => state.exposuresAndFlights.borderCheckpoint?.id);
    const flights: Flight[] = [];//useSelector<StoreStateType, Flight[]>(state => state.exposuresAndFlights.flights);

    const saveResortsData = (data: ResortData): Promise<void> => {
        let { wasInVacation, wasInEvent, wereConfirmedExposuresDesc } = data;
        const saveResortsDataLogger = logger.setup('Saving investigated patient resort data');
        saveResortsDataLogger.info('launching the server request', Severity.LOW);
        setIsLoading(true);
        return axios.post('/investigationInfo/resorts', {
            wasInVacation,
            wasInEvent,
            wereConfirmedExposuresDesc,
            id: investigatedPatientId,
        });
    }

    const saveExposureAndFlightData = async (data: ExposureData , ids: (number | null)[]): Promise<void> => {
        // let { exposures, wereFlights, wereConfirmedExposures, borderCheckpointData } = data;
        // const formattedExposure = exposures ? formatExposures(exposures, ids) : [];
        // let exposuresToDelete: number[] = [];
        // let filteredExposures: (Exposure | DBExposure)[] = [];

        // const saveExposureAndFlightDataLogger = logger.setup('Saving Exposures And Flights');

        // if (!wereFlights && !wereConfirmedExposures) {
        //     exposuresToDelete = formattedExposure.map((exposure: any) => exposure.id).filter((id: number) => id);
        // } else {
        //     const filterCondition = exposureDeleteCondition(wereFlights, wereConfirmedExposures, borderCheckpointData?.borderCheckpointType);
        //     formattedExposure.forEach((exposure: Exposure) => {
        //         if (filterCondition(exposure)) {
        //             exposure.id && exposuresToDelete.push(exposure.id);
        //         } else {
        //             if (exposure.flightDestinationCountry !== undefined) {
        //                 borderCheckpointData = {
        //                     ...borderCheckpointData,
        //                     borderCheckpoint: borderCheckpointData?.borderCheckpoint ? (borderCheckpointData?.borderCheckpoint as BorderCheckpoint).id : undefined,
        //                     wasAbroad: borderCheckpointData?.borderCheckpointType ? true : false
        //                 };
        //                 exposure = { ...exposure, ...borderCheckpointData };
        //             }
        //             filteredExposures.push(exposure);
        //         }
        //     });
        //     updateBorderCheckpointData(filteredExposures as Exposure[], borderCheckpointData, wereFlights);
        //     filteredExposures = (filteredExposures as Exposure[]).map(extractExposureData);
        // }
        // exposuresToDelete.push(...getBorderCheckpointAndFlightDataForDelete(filteredExposures as Exposure[]));
        // saveExposureAndFlightDataLogger.info('launching the server request', Severity.LOW);
      //  checkUpdateInvestigationExposureReasonId(filteredExposures, epidemiologyNumber, complexityReasonsId)
        return axios.post('/exposure/updateExposures', data /*{
           // exposures: filteredExposures,
            //investigationId: epidemiologyNumber,
            //exposuresToDelete
        }*/);
    }

 
    const ifFlightsExist = (exposures: Exposure[]) => {
        return exposures.find(e => e.wasAbroad === true ||
            (e.flightDestinationCountry != undefined &&
                e.flightDestinationCountry != null));
    }

    const getBorderCheckpointAndFlightDataForDelete = (exposures: Exposure[]): number[] => {
        let idsToDelete: number[] = [];
        let exposure = exposures.find(e => e.borderCheckpointType);
        if (exposure) {
            if (exposure.borderCheckpointType !== BorderCheckpointTypeCodes.FLIGHT) {
                if (flights.length > 0) {
                    idsToDelete.push(...getFlightIds());
                }
            }
        }
        else {
            if (flights.length > 0) {
                idsToDelete.push(...getFlightIds());
            }
            // if (borderCheckpointId != null) {
            //     idsToDelete.push(borderCheckpointId);
            // }
        }
        return idsToDelete;

    }

    const getFlightIds = (): number[] => {
        return flights.filter(f => f.id !== null && f.id !== borderCheckpointId).map((f) => f.id) as number[];
    }

    return {
        saveExposureAndFlightData,
        saveResortsData
    }
};

export default useExposuresSaving;