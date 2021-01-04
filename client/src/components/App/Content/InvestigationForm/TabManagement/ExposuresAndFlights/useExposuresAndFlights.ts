import axios  from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import ResortData from 'models/ResortData';
import StoreStateType from 'redux/storeStateType';
import { setFormState } from 'redux/Form/formActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import useExposuresSaving from 'Utils/ControllerHooks/useExposuresSaving';
import {ExposureAndFlightsDetails} from 'commons/Contexts/ExposuresAndFlights';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';
import { Exposure, initialExposureOrFlight, isConfirmedExposureInvalid, isFlightInvalid} from 'commons/Contexts/ExposuresAndFlights';

import { FormData } from './ExposuresAndFlightsInterfaces';
import ExposureSchema from './Schema/exposuresAndFlightsSchema';

const defaultDestinationCountryCode = '900';

interface Props {
    exposures: Exposure[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
    exposureAndFlightsData: ExposureAndFlightsDetails;
    setExposureDataAndFlights: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>;
    id: number;
    reset: (values : FormData) => void;
    trigger: () => void;
}

export const useExposuresAndFlights = (props : Props) => {
    const {exposures, wereConfirmedExposures, wereFlights , exposureAndFlightsData , setExposureDataAndFlights, id, reset, trigger} = props;
    
    const { saveExposureAndFlightData, saveResortsData } = useExposuresSaving();
    const { parseAddress } = useGoogleApiAutocomplete();
    const { alertError } = useCustomSwal();

    const validationDate : Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>((state) => state.investigation.investigatedPatient.investigatedPatientId);

    const disableConfirmedExposureAddition: boolean = React.useMemo(() =>
        exposures.some(exposure => exposure.wasConfirmedExposure && isConfirmedExposureInvalid(exposure))
        , [exposures]);

    const disableFlightAddition: boolean = React.useMemo(() =>
        exposures.some(exposure => exposure.wasAbroad && isFlightInvalid(exposure))
        , [exposures]);

    const doesHaveConfirmedExposures = (checkedExposures: Exposure[]) => checkedExposures.some(exposure => exposure.wasConfirmedExposure);
    const doesHaveFlights = (checkedExposures: Exposure[]) => checkedExposures.some(exposure => exposure.wasAbroad);

    useEffect(() => {
        (wereConfirmedExposures && !doesHaveConfirmedExposures(exposures)) && onExposureAdded(true, false);
    }, [wereConfirmedExposures]);

    useEffect(() => {
        (wereFlights && !doesHaveFlights(exposures)) && onExposureAdded(false, true);
    }, [wereFlights]);

    const parseDbExposure = (exposure: Exposure) => {
        const { exposureAddress, ...restOfData } = exposure;
        return ({ exposureAddress: parseAddress(exposureAddress), ...restOfData });
    };

    const fetchExposuresAndFlights = () => {
        const fetchExposuresAndFlightsLogger = logger.setup('Fetching Exposures And Flights');
        const getCoronaTestDateLogger = logger.setup('Getting Corona Test Date');

        fetchExposuresAndFlightsLogger.info('launching exposures and flights request', Severity.LOW);
        setIsLoading(true);
        axios
        .get('/exposure/exposures/' + investigationId)
        .then(result => {
            fetchExposuresAndFlightsLogger.info('got results back from the server', Severity.LOW);
            const data: Exposure[] = result?.data;
            return data && data.map(parseDbExposure);
        })
        .then((exposures?: Exposure[]) => {
            if (exposures) {
            fetchResortsData().then((result) => {
                const formattedRes = {
                    exposures,
                    exposuresToDelete: [],
                    wereConfirmedExposures: doesHaveConfirmedExposures(exposures),
                    wereFlights: doesHaveFlights(exposures),
                    wasInEilat: result.wasInEilat,
                    wasInDeadSea: result.wasInDeadSea,
                }
                setExposureDataAndFlights(formattedRes);
                reset(formattedRes);
                trigger();
            }).catch((error) => {
                getCoronaTestDateLogger.error(`failed to get resorts response due to ${error}`, Severity.HIGH);
            })
            .finally(() => setIsLoading(false));
            }
        })
        .catch((error) => {
            fetchExposuresAndFlightsLogger.error(`got error from server: ${error}`, Severity.HIGH);
            alertError('לא ניתן היה לטעון את החשיפה');
            setIsLoading(false);
        });
    }

    const fetchResortsData: () => Promise<ResortData> = async () => {
        const fetchResortsDataLogger = logger.setup('Fetching investigated patient resorts data');
        fetchResortsDataLogger.info('launching investigated patient resorts request', Severity.LOW);
        const result = await axios.get('investigationInfo/resorts/' + investigatedPatientId);
        fetchResortsDataLogger.info('got investigated patient resorts response successfully', Severity.LOW);
        const resortData: ResortData =  {
        wasInEilat: result?.data?.wasInEilat,
        wasInDeadSea: result?.data?.wasInDeadSea
        }
        return resortData;
    }

    useEffect(() => {
        fetchExposuresAndFlights();
    }, []);

    const handleChangeExposureDataAndFlightsField = (index: number, fieldName: string, value: any) => {
        const updatedExpousres = [...exposureAndFlightsData.exposures];
        const updatedExposure = { ...updatedExpousres[index], [fieldName]: value };
        updatedExpousres.splice(index, 1, updatedExposure);
        setExposureDataAndFlights({
        ...exposureAndFlightsData,
        exposures: updatedExpousres,
        });
    };

    const onExposuresStatusChange = (fieldName: any, value: any) => {
        setExposureDataAndFlights({
            ...exposureAndFlightsData,
            [fieldName]: value
        });
    };

    const onExposureAdded = (wasConfirmedExposure: boolean, wasAbroad: boolean) => {
        const newExposure: Exposure = { ...initialExposureOrFlight, wasConfirmedExposure, wasAbroad };
        if (wasAbroad) newExposure.flightDestinationCountry = defaultDestinationCountryCode;
        const updatedExposures: Exposure[] = [...exposures, newExposure];
        setExposureDataAndFlights({
        ...exposureAndFlightsData,
        exposures: updatedExposures,
        });
    }

    const saveExposure = (data : FormData , ids : (number | null)[]) => {
        const saveExposureLogger = logger.setup('Saving Exposures And Flights tab');
        saveExposureLogger.info('launching the server request', Severity.LOW);
        
        const tabSavePromises = [saveExposureAndFlightData(data , ids), saveResortsData(data)];
        Promise.all(tabSavePromises)
        .then(() => {
        saveExposureLogger.info('saved confirmed exposures, flights and resorts data successfully', Severity.LOW);
        })
        .catch((error) => {
        saveExposureLogger.error(`got error from server: ${error}`, Severity.HIGH);
        alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות');
        })
        .finally(() => {
            fetchExposuresAndFlights();
            ExposureSchema(validationDate).isValid(data).then(valid => {
                setFormState(investigationId, id, valid)
            })
            setIsLoading(false);
        })
    }

    return {
        saveExposure,
        onExposuresStatusChange,
        handleChangeExposureDataAndFlightsField,
        onExposureAdded,
        disableConfirmedExposureAddition,
        disableFlightAddition
    }
}
