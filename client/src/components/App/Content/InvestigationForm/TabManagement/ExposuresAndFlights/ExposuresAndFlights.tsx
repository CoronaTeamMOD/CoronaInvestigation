
import { useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React, { useContext, useState } from 'react';
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

const ExposuresAndFlights: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {

    const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);

    const { exposures, wereFlights, wereConfirmedExposures, wasInVacation, wasInEvent } = exposureAndFlightsData;
    const validationDate: Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
    const [isExposureAdded, setIsExposureAdded] = useState<boolean | undefined>(undefined);
    const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    
    const ids = exposures.map(exposure => exposure.id);

    const methods = useForm<FormData>({
        mode: 'all',
        resolver: yupResolver(ExposureSchema(validationDate)),
    });

    const { reset, trigger } = methods;

    const onSubmit = (e?: React.FormEvent) => {
        e && e.preventDefault();
        methods.trigger();
        const data = methods.getValues();
        isViewMode ? setFormState(epidemiologyNumber, id, true) : saveExposure(data, ids);
    };

    const {
        saveExposure,
        onExposuresStatusChange,
        handleChangeExposureDataAndFlightsField,
        onExposureAdded,
        disableConfirmedExposureAddition,
        disableFlightAddition,
        onExposureDeleted
    } = useExposuresAndFlights({
        exposures, wereConfirmedExposures, wereFlights,
        exposureAndFlightsData, setExposureDataAndFlights,
        setIsExposureAdded, id, reset, trigger, onSubmit
    });

    return (
        <FormProvider {...methods}>
            <form id={`form-${id}`} onSubmit={(e) => (onSubmit(e))}>
                <PossibleExposure
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
                />

            </form>
        </FormProvider>
    );
};

interface Props {
    id: number;
    isViewMode?: boolean;
};

export default ExposuresAndFlights;