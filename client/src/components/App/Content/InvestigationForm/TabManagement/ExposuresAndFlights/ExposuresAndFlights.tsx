
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import StoreStateType from 'redux/storeStateType';
import { exposureAndFlightsContext } from 'commons/Contexts/ExposuresAndFlights';

import { BackFromAbroad } from './Forms/BackFromAbroad';
import PossibleExposure from './Forms/PossibleExposure';
import { VacationOrEvent } from './Forms/VacationOrEvent';
import { FormData } from './ExposuresAndFlightsInterfaces';
import ExposureSchema from './Schema/exposuresAndFlightsSchema';
import { useExposuresAndFlights } from './useExposuresAndFlights';
import { setFormState } from 'redux/Form/formActionCreators';
import useInvestigatedPersonInfo from '../../InvestigationInfo/InvestigatedPersonInfo/useInvestigatedPersonInfo';
import ExposureForm from './ExposureForm/ExposureForm';
import { resetExposureData } from 'redux/ExposuresAndFlights/ExposuresAndFlightsActionCreator';
import { ExposureData } from 'models/ExposureData';
import { saveExposureData } from 'httpClient/exposure';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import CreationSourceCodes from 'models/enums/CreationSourceCodes';

const ExposuresAndFlights: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {

    const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);

    const { exposures, wereFlights, wereConfirmedExposures, wasInVacation, wasInEvent } = exposureAndFlightsData;
    const validationDate: Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
    const [isExposureAdded, setIsExposureAdded] = useState<boolean>(false);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const exposureData = useSelector<StoreStateType, ExposureData | null>(state => state.exposuresAndFlights.exposureData);
    const dispatch = useDispatch();
    const { alertError } = useCustomSwal();
    
    const ids = exposures.map(exposure => exposure.id);

    const methods = useForm<ExposureData>({
        mode: 'all',
        resolver: yupResolver(ExposureSchema(validationDate)),
    });

    const { reset, trigger, setValue } = methods;

    const { saveInvestigationInfo } = useInvestigatedPersonInfo();

    const saveExposure = (data : ExposureData) => {
        try {
            setIsLoading(true);
            if (!data.creationSource) {
                data.creationSource =  CreationSourceCodes.EVEN_YESOD;
              }
            saveExposureData(data);
        }
        catch (err) {

            alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות');
        }
        finally{ 
            ExposureSchema(validationDate).isValid(data).then(valid => {
                setFormState(epidemiologyNumber, id, valid)
            })
        setIsLoading(false);
             
        }
    }


    const onSubmit = (e?: React.FormEvent) => {
        e && e.preventDefault();
        if (isViewMode) {
            ExposureSchema(validationDate).isValid(exposureData).then(valid => {
                setFormState(epidemiologyNumber, id, valid)
            });
        }
        else {
            methods.trigger();
            saveInvestigationInfo();
            saveExposure(exposureData as ExposureData);
            }
    };

    const {
       // saveExposure,
        onExposuresStatusChange,
        handleChangeExposureDataAndFlightsField,
        onExposureAdded,
        disableConfirmedExposureAddition,
        disableFlightAddition,
        onExposureDeleted
    } = useExposuresAndFlights({
        exposures, wereConfirmedExposures, wereFlights,
        exposureAndFlightsData, setExposureDataAndFlights,
        setIsExposureAdded, id, reset, trigger, onSubmit, setValue
    });

    useEffect(() => {
        return () => { dispatch(resetExposureData()) };
    }, []);

    return (
        <FormProvider {...methods}>
            <form id={`form-${id}`} onSubmit={(e) => (onSubmit(e))}>
            <ExposureForm
                isViewMode={isViewMode}
            />
                {/* <PossibleExposure
                    wereConfirmedExposures={wereConfirmedExposures}
                    onExposuresStatusChange={onExposuresStatusChange}
                    exposures={exposures}
                    handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
                    onExposureAdded={onExposureAdded}
                    disableConfirmedExposureAddition={disableConfirmedExposureAddition}
                    onExposureDeleted={onExposureDeleted}
                    isExposureAdded={isExposureAdded}
                    setIsExposureAdded={setIsExposureAdded}
                    isViewMode={isViewMode}
                />

                <Divider />

                <VacationOrEvent
                    wasInVacation={wasInVacation}
                    wasInEvent={wasInEvent}
                    isViewMode={isViewMode}
                />

                <Divider />

                <BackFromAbroad
                    wereFlights={wereFlights}
                    onExposuresStatusChange={onExposuresStatusChange}
                    exposures={exposures}
                    handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
                    onExposureAdded={onExposureAdded}
                    disableFlightAddition={disableFlightAddition}
                    onExposureDeleted={onExposureDeleted}
                    isViewMode={isViewMode}
                    borderCheckpointData={exposureAndFlightsData.borderCheckpointData}
                /> */}

            </form>
        </FormProvider>
    );
};

interface Props {
    id: number;
    isViewMode?: boolean;
};

export default ExposuresAndFlights;