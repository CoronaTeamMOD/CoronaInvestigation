
import { useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React , { useContext , useEffect} from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import StoreStateType from 'redux/storeStateType';
import { exposureAndFlightsContext } from 'commons/Contexts/ExposuresAndFlights';

import PossibleExposure from './Forms/PossibleExposure'; 
import { EilatOrDeadSea } from './Forms/EilatOrDeadSea';
import { BackFromAbroad } from './Forms/BackFromAbroad';
import { FormData } from './ExposuresAndFlightsInterfaces';
import { useExposuresAndFlights } from './useExposuresAndFlights';
import ExposureSchema from './Schema/exposuresAndFlightsSchema';

const ExposuresAndFlights: React.FC<Props> = ({ id }: Props): JSX.Element => {
  const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);
  const { exposures, wereFlights, wereConfirmedExposures, wasInEilat, wasInDeadSea } = exposureAndFlightsData;
  const ids = exposures.map(exposure => exposure.id);
  const validationDate : Date = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

  const methods = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(ExposureSchema(validationDate)),
  });

  const {reset , trigger} = methods;

  const {
    saveExposure,
    onExposuresStatusChange,
    handleChangeExposureDataAndFlightsField,
    onExposureAdded,
    disableConfirmedExposureAddition,
    disableFlightAddition
  } = useExposuresAndFlights({exposures, wereConfirmedExposures, wereFlights , exposureAndFlightsData , setExposureDataAndFlights, id, reset, trigger});

  const onSubmit = (e : React.FormEvent) => {
    e.preventDefault();
    methods.trigger();
    const data = methods.getValues();
    saveExposure(data , ids);
  }

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
          />

          <Divider />

          <EilatOrDeadSea 
            wasInEilat={wasInEilat}
            wasInDeadSea={wasInDeadSea}
          />

          <Divider />

          <BackFromAbroad 
            wereFlights={wereFlights}
            onExposuresStatusChange={onExposuresStatusChange}
            exposures={exposures}
            handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
            onExposureAdded={onExposureAdded}
            disableFlightAddition={disableFlightAddition}
          />
          
        </form>
      </FormProvider>
  );
};

interface Props {
  id: number;
}

export default ExposuresAndFlights;
