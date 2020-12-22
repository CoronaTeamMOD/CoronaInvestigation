import React , { useContext } from 'react';
import { Divider } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';

import { exposureAndFlightsContext } from 'commons/Contexts/ExposuresAndFlights';

import PossibleExposure from './Forms/PossibleExposure'; 
import { EilatOrDeadSea } from './Forms/EilatOrDeadSea';
import { BackFromAbroad } from './Forms/BackFromAbroad';
import { useExposuresAndFlights } from './useExposuresAndFlights';

const ExposuresAndFlights: React.FC<Props> = ({ id }: Props): JSX.Element => {
  const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);
  const { exposures, wereFlights, wereConfirmedExposures, wasInEilat, wasInDeadSea } = exposureAndFlightsData;

  const methods = useForm();

  const {
    saveExposure,
    onExposuresStatusChange,
    handleChangeExposureDataAndFlightsField,
    onExposureAdded,
    disableConfirmedExposureAddition,
    disableFlightAddition
  } = useExposuresAndFlights({exposures, wereConfirmedExposures, wereFlights , exposureAndFlightsData , setExposureDataAndFlights , id});

  const onSubmit = (data : any) => {
    console.log(data);
    saveExposure();
  }

  return (
      <FormProvider {...methods}>
        <form id={`form-${id}`} onSubmit={methods.handleSubmit(onSubmit)}>
          <input type="submit" value="sbmt"/>
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
            onExposuresStatusChange={onExposuresStatusChange}
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
