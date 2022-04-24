import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import theme from 'styles/theme';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import ResortData from 'models/ResortData';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setFormState } from 'redux/Form/formActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import useExposuresSaving from 'Utils/ControllerHooks/useExposuresSaving';
import { ExposureAndFlightsDetails } from 'commons/Contexts/ExposuresAndFlights';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';
import { Exposure, initialExposureOrFlight, isConfirmedExposureInvalid, isFlightInvalid } from 'commons/Contexts/ExposuresAndFlights';

import { FormData } from './ExposuresAndFlightsInterfaces';
import ExposureSchema from './Schema/exposuresAndFlightsSchema';
import { fetchAllBorderCheckpoints, fetchAllBorderCheckpointTypes } from 'httpClient/exposure';
import { SetBorderCheckpointTypes } from 'redux/BorderCheckpointTypes/BorderCheckpointActionCreator';
import { SetBorderCheckpoints } from 'redux/BorderCheckpoints/BorderCheckpointsActionCreator';
import BorderCheckpointData, { defaultBorderCheckpointData } from 'models/BorderCheckpointData';
import { BorderCheckpointTypeCodes } from 'models/enums/BorderCheckpointCodes';
import { setExposureAnfFlightData } from 'redux/ExposuresAndFlights/ExposuresAndFlightsActionCreator';
import FlightData from 'models/FlightData';
import ExposureAndFlightData, { Flight } from 'models/ExposureAndFlightData';
import BorderCheckpoint from 'models/BorderCheckpoint';

const defaultDestinationCountryCode = '900';
const exposureDeleteFailedMsg = 'לא הצלחנו למחוק את החשיפה, אנא נסה שוב בעוד כמה דקות';
const exposureDeleteWarningTitle = 'האם אתה בטוח שתרצה למחוק את החשיפה?';
const flightDeleteFailedMsg = 'לא הצלחנו למחוק את הטיסה, אנא נסה שוב בעוד כמה דקות';
const flightDeleteWarningTitle = 'האם אתה בטוח שתרצה למחוק את הטיסה?';

export const useExposuresAndFlights = (props: Props) => {

    const dispatch = useDispatch();
    const {
        exposures, wereConfirmedExposures, wereFlights,
        exposureAndFlightsData, setExposureDataAndFlights,
        setIsExposureAdded, id, reset, trigger, onSubmit, setValue
    } = props;

    const { saveExposureAndFlightData, saveResortsData } = useExposuresSaving();
    const { parseAddress } = useGoogleApiAutocomplete();
    const { alertError, alertWarning } = useCustomSwal();

    const validationDate: Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
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
        fetchExposuresAndFlightsLogger.info('launching exposures and flights request', Severity.LOW);
        setIsLoading(true);
        axios.get(`/exposure/exposures/`)
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
                            wereConfirmedExposuresDesc: result.wereConfirmedExposuresDesc,
                            wereFlights: doesHaveFlights(exposures),
                            wasInVacation: result.wasInVacation,
                            wasInEvent: result.wasInEvent,
                            borderCheckpointData: getBorderCheckpointData(exposures)
                        }
                        setExposureDataAndFlights(formattedRes);
                        reset(formattedRes);
                        setValue('borderCheckpointData', formattedRes.borderCheckpointData);
                        trigger();
                    }).catch((error) => {
                        fetchExposuresAndFlightsLogger.error(`failed to get resorts response due to ${error}`, Severity.HIGH);
                    })
                        .finally(() => setIsLoading(false));
                }
            })
            .catch((error) => {
                fetchExposuresAndFlightsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                alertError('לא ניתן היה לטעון את החשיפה');
                setIsLoading(false);
            });
    };

    const getBorderCheckpointData = (exposures: Exposure[]): BorderCheckpointData => {
        let borderCheckpointData = {};
        let borderCheckpointId = null;
        let exposure = exposures.find(e => e.borderCheckpointType);
        if (exposure) {
            for (var key in defaultBorderCheckpointData) {
                if (key in exposure) {
                    borderCheckpointData = {
                        ...borderCheckpointData,
                        [key as keyof BorderCheckpointData]: exposure[key as keyof BorderCheckpointData]
                    };
                }
            }
            borderCheckpointId = exposure.id;
        }
        let flights = exposures.filter(e => e.borderCheckpointType == BorderCheckpointTypeCodes.FLIGHT ||
            (e.flightDestinationCountry != null && e.flightDestinationCountry != undefined)).map((exposure) => {
                return {
                    id: exposure.id,
                    flightData: exposure as FlightData
                } as Flight
            });
        let borderCheckpoint = {
            id: borderCheckpointId as number | null,
            borderCheckpointData: borderCheckpointData ? borderCheckpointData as BorderCheckpointData : null,
        } as unknown as BorderCheckpoint;

        dispatch(setExposureAnfFlightData({
            investigationId: investigationId,
            borderCheckpoint: borderCheckpoint as BorderCheckpoint,
            flights: flights,
        } as unknown as ExposureAndFlightData));
        return borderCheckpointData as BorderCheckpointData;
    }

    const fetchResortsData: () => Promise<ResortData> = async () => {
        const fetchResortsDataLogger = logger.setup('Fetching investigated patient resorts data');
        fetchResortsDataLogger.info('launching investigated patient resorts request', Severity.LOW);
        const result = await axios.get('investigationInfo/resorts/' + investigatedPatientId);
        fetchResortsDataLogger.info('got investigated patient resorts response successfully', Severity.LOW);
        const resortData: ResortData = {
            wereConfirmedExposuresDesc: result?.data?.wereConfirmedExposuresDesc,
            wasInVacation: result?.data?.wasInVacation,
            wasInEvent: result?.data?.wasInEvent
        }
        return resortData;
    };

    useEffect(() => {
        fetchExposuresAndFlights();
        getAllBorderCheckpointTypes();
        getAllBorderCheckpoints();
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

    const onExposureDeleted = async (index: number) => {
        const updatedExpousres = [...exposureAndFlightsData.exposures];
        const deletingExposureLogger = logger.setup('Deleting Exposure');
        const exposureToDelete = updatedExpousres[index];
        const isFlight = exposureToDelete.wasAbroad;
        alertWarning((isFlight ? flightDeleteWarningTitle : exposureDeleteWarningTitle), {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                deletingExposureLogger.info('launching exposure delete request', Severity.LOW);
                setIsLoading(true);
                if (exposureToDelete.id) {
                    const exposureId = updatedExpousres[index].id;
                    axios.delete('/exposure/deleteExposure', { params: { exposureId } })
                        .then(() => {
                            deletingExposureLogger.info('exposure was deleted successfully', Severity.LOW)
                            !isFlight && setIsExposureAdded(false);
                        }).catch((error) => {
                            deletingExposureLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                            alertError((isFlight ? flightDeleteFailedMsg : exposureDeleteFailedMsg));
                        })
                } else {
                    updatedExpousres.splice(index, 1);
                    setExposureDataAndFlights({
                        ...exposureAndFlightsData,
                        exposures: updatedExpousres,
                    });
                    !isFlight && setIsExposureAdded(false);
                }
                onSubmit();
            }
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
    };

    const saveExposure = (data: FormData, ids: (number | null)[]) => {
        const saveExposureLogger = logger.setup('Saving Exposures And Flights tab');
        saveExposureLogger.info('launching the server request', Severity.LOW);

        const tabSavePromises = [saveExposureAndFlightData(data, ids), saveResortsData(data)];
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
    };

    const getAllBorderCheckpointTypes = () => {
        setIsLoading(true);
        fetchAllBorderCheckpointTypes().then(res => {
            if (res
            ) {
                dispatch(SetBorderCheckpointTypes(res));
            }
        })
            .catch((err) => {
                alertError('שגיאה בשליפה של סוגי מעברים')
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const getAllBorderCheckpoints = () => {
        setIsLoading(true);
        fetchAllBorderCheckpoints().then(res => {
            if (res) {
                dispatch(SetBorderCheckpoints(res));
            }
        })
            .catch((err) => {
                alertError('שגיאה בשליפה של מעברים')
            })
            .finally(() => {
                setIsLoading(false);
            });

    }

    return {
        saveExposure,
        onExposuresStatusChange,
        handleChangeExposureDataAndFlightsField,
        onExposureAdded,
        disableConfirmedExposureAddition,
        disableFlightAddition,
        onExposureDeleted
    };
};

interface Props {
    exposures: Exposure[],
    wereConfirmedExposures: boolean,
    wereFlights: boolean,
    exposureAndFlightsData: ExposureAndFlightsDetails;
    setExposureDataAndFlights: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>;
    setIsExposureAdded: React.Dispatch<React.SetStateAction<boolean>>;
    id: number;
    reset: (values: FormData) => void;
    trigger: () => void;
    onSubmit: (e?: React.FormEvent) => void;
    setValue: (name: string, value: any) => void;
};