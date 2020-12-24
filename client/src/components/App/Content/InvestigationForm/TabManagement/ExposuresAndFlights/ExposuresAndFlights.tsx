import { Divider } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React , { useContext , useEffect} from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
  const methods = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(ExposureSchema)
  });

  useEffect(() => {
    methods.reset({
      wasInEilat,
      wasInDeadSea,
      exposures,
      wereFlights,
      wereConfirmedExposures
    })
  }, [exposureAndFlightsData])

  useEffect(() => {
    console.log(methods.errors);
  }, [methods.errors])

  const {
    saveExposure,
    onExposuresStatusChange,
    handleChangeExposureDataAndFlightsField,
    onExposureAdded,
    disableConfirmedExposureAddition,
    disableFlightAddition
  } = useExposuresAndFlights({exposures, wereConfirmedExposures, wereFlights , exposureAndFlightsData , setExposureDataAndFlights , id});

  const onSubmit = (data : FormData) => {
    saveExposure(data , ids);
  }

  return (
      <FormProvider {...methods}>
        <form id={`form-${id}`} onSubmit={methods.handleSubmit(onSubmit)}>
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
