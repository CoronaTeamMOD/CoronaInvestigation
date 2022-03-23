import axios from 'axios';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { fieldsNames, Exposure, initialExposureOrFlight } from 'commons/Contexts/ExposuresAndFlights';
import { checkUpdateInvestigationExposureReasonId } from 'Utils/ComplexityReasons/ComplexityReasonsFunctions';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import ResortData from 'models/ResortData';
import { FormData } from 'components/App/Content/InvestigationForm/TabManagement/ExposuresAndFlights/ExposuresAndFlightsInterfaces';
import BorderCheckpoint from 'models/BorderCheckpoint';
import BorderCheckpointData from 'models/BorderCheckpointData';
import BorderCheckpointForm from 'components/App/Content/InvestigationForm/TabManagement/ExposuresAndFlights/Forms/BorderCheckpointForm/BorderCheckpointForm';
import { BorderCheckpointTypeCodes } from 'models/enums/BorderCheckpointCodes';
import { Flight } from 'models/ExposureAndFlightData';

const exposureDeleteCondition =
    (wereFlights: boolean, wereConfirmedExposures: boolean, borderCheckpointType?: number): (exposure: Exposure) => boolean => {
        if (!wereConfirmedExposures) {
            return (exposure: Exposure) => exposure.exposureSource !== undefined
        };
        if (!wereFlights || borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT) {
            return (exposure: Exposure) => exposure.flightDestinationCountry !== undefined && exposure.flightDestinationCountry !== null
        };
        return (exposure: Exposure) => false;
    }


interface DBExposure extends Omit<Exposure, 'exposureAddress'> {
    exposureAddress: string | null;
}

const useExposuresSaving = () => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const complexityReasonsId = useSelector<StoreStateType, (number | null)[]>((state) => state.investigation.complexReasonsId);
    const borderCheckpointId = useSelector<StoreStateType, (number | null | undefined)>(state => state.exposuresAndFlights.borderCheckpoint?.id);
    const flights = useSelector<StoreStateType, Flight[]>(state => state.exposuresAndFlights.flights);

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

    const saveExposureAndFlightData = async (data: FormData, ids: (number | null)[]): Promise<void> => {
        let { exposures, wereFlights, wereConfirmedExposures, borderCheckpointData } = data;
        const formattedExposure = exposures ? formatExposures(exposures, ids) : [];
        let exposuresToDelete: number[] = [];
        let filteredExposures: (Exposure | DBExposure)[] = [];

        const saveExposureAndFlightDataLogger = logger.setup('Saving Exposures And Flights');

        if (!wereFlights && !wereConfirmedExposures) {
            exposuresToDelete = formattedExposure.map((exposure: any) => exposure.id).filter((id: number) => id);
        } else {
            const filterCondition = exposureDeleteCondition(wereFlights, wereConfirmedExposures, borderCheckpointData?.borderCheckpointType);
            formattedExposure.forEach((exposure: Exposure) => {
                if (filterCondition(exposure)) {
                    exposure.id && exposuresToDelete.push(exposure.id);
                } else {
                    if (exposure.flightDestinationCountry !== undefined) {
                        borderCheckpointData = {
                            ...borderCheckpointData,
                            borderCheckpoint: borderCheckpointData?.borderCheckpoint ? (borderCheckpointData?.borderCheckpoint as BorderCheckpoint).id : undefined,
                            wasAbroad: borderCheckpointData?.borderCheckpointType ? true : false
                        };
                        exposure = { ...exposure, ...borderCheckpointData };
                    }
                    filteredExposures.push(exposure);
                }
            });
            updateBorderCheckpointData(filteredExposures as Exposure[], borderCheckpointData, wereFlights);
            filteredExposures = (filteredExposures as Exposure[]).map(extractExposureData);
        }
        exposuresToDelete.push(...getBorderCheckpointAndFlightDataForDelete(filteredExposures as Exposure[]));
        saveExposureAndFlightDataLogger.info('launching the server request', Severity.LOW);
        checkUpdateInvestigationExposureReasonId(filteredExposures, epidemiologyNumber, complexityReasonsId)
        return axios.post('/exposure/updateExposures', {
            exposures: filteredExposures,
            investigationId: epidemiologyNumber,
            exposuresToDelete
        });
    }

    const formatExposures = (exposures: Exposure[], ids: (number | null)[]): Exposure[] => {
        return exposures.map((exposure: Exposure, i: number) => { return { ...exposure, id: ids[i] } })
    }

    const extractExposureData = (exposuresAndFlightsData: Exposure) => {
        let exposureAndDataToReturn: (Exposure | DBExposure) = exposuresAndFlightsData;
        if (exposuresAndFlightsData.borderCheckpointType !== undefined &&
            exposuresAndFlightsData.borderCheckpointType !== null) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.wasConfirmedExposure]: false,
                [fieldsNames.wasAbroad]: true,
                [fieldsNames.exposureSource]: null,
                [fieldsNames.date]: undefined,
                [fieldsNames.address]: null,
                [fieldsNames.placeType]: null,
                [fieldsNames.placeSubType]: null,
            }
            if (exposuresAndFlightsData.borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT) {
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
                    [fieldsNames.flightNumber]: '',
                    [fieldsNames.flightSeatNum]: undefined,
                    [fieldsNames.otherAirline]: undefined,
                    [fieldsNames.otherFlightNum]: undefined
                }
            }
            else {
                exposureAndDataToReturn = {
                    ...exposureAndDataToReturn,
                    [fieldsNames.arrivalDateToIsrael]: null,
                    [fieldsNames.arrivalTimeToIsrael]: null
                }
            }
        } else {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                exposureAddress: exposuresAndFlightsData.exposureAddress || null
            }
        }
        if (exposuresAndFlightsData.exposureSource !== undefined) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.wasConfirmedExposure]: true,
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
                [fieldsNames.flightNumber]: '',
                [fieldsNames.borderCheckpointType]: undefined,
                [fieldsNames.borderCheckpoint]: undefined,
                [fieldsNames.lastDestinationCountry]: undefined,
                [fieldsNames.arrivalDateToIsrael]: undefined,
                [fieldsNames.arrivalTimeToIsrael]: undefined,
                [fieldsNames.flightSeatNum]: undefined,
                [fieldsNames.otherAirline]: undefined,
                [fieldsNames.otherFlightNum]: undefined
            }
        } else {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                exposureSource: exposuresAndFlightsData.exposureSource || null
            }
        }
        return (exposureAndDataToReturn as DBExposure);
    }

    const updateBorderCheckpointData = (exposures: Exposure[], borderCheckpointData: BorderCheckpointData | undefined, wereFlights: boolean) => {
        if (borderCheckpointData?.borderCheckpointType && wereFlights) {
            if (exposures.length == 0 || !ifFlightsExist(exposures)) {
                borderCheckpointData = {
                    ...borderCheckpointData,
                    borderCheckpoint: borderCheckpointData?.borderCheckpoint ? (borderCheckpointData?.borderCheckpoint as BorderCheckpoint).id : undefined,
                    wasAbroad: borderCheckpointData?.borderCheckpointType ? true : false
                };
                exposures.push({ ...borderCheckpointData, id: borderCheckpointId, wasConfirmedExposure: false } as Exposure)
                return exposures;
            }
        }
        else {
            return exposures;
        }
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
            if (borderCheckpointId) {
                idsToDelete.push(borderCheckpointId);
            }
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