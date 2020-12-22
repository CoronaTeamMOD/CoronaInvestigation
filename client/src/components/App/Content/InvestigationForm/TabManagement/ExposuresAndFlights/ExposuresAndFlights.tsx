import React , { useContext } from 'react';
import { AddCircle } from '@material-ui/icons';
import { FormProvider, useForm } from 'react-hook-form';
import { Collapse, Divider, Typography, IconButton } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import FormTitle from 'commons/FormTitle/FormTitle';
import FieldName from 'commons/FieldName/FieldName';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { exposureAndFlightsContext } from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './ExposuresAndFlightsStyles';
import FlightsForm from './FlightsForm/FlightsForm';
import { useExposuresAndFlights } from './useExposuresAndFlights'
import PossibleExposure from './Forms/PossibleExposure'; 
import { EilatOrDeadSea } from './Forms/EilatOrDeadSea';

const addFlightButton: string = 'הוסף טיסה לחול';

const ExposuresAndFlights: React.FC<Props> = ({ id }: Props): JSX.Element => {
  const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);
  const { exposures, wereFlights, wereConfirmedExposures, wasInEilat, wasInDeadSea } = exposureAndFlightsData;

  const methods = useForm();

  const { fieldContainer } = useFormStyles();
  const classes = useStyles();

  const {
    saveExposure,
    onExposuresStatusChange,
    handleChangeExposureDataAndFlightsField,
    onExposureAdded,
    disableConfirmedExposureAddition,
    disableFlightAddition
  } = useExposuresAndFlights({exposures, wereConfirmedExposures, wereFlights , exposureAndFlightsData , setExposureDataAndFlights , id});

  return (
      <FormProvider {...methods}>
        <form id={`form-${id}`} onSubmit={(e) => saveExposure(e)}>
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

          <div className={classes.subForm}>
            <FormTitle title='חזרה מחו״ל' />

            <FormRowWithInput testId='wasAbroad' fieldName='האם חזר מחו״ל?'>
              <Toggle
                value={wereFlights}
                onChange={(event, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wereFlights, value)
                  }
                }}
              />
            </FormRowWithInput>

            <Collapse
              in={wereFlights}
              className={classes.additionalInformationForm}
            >
              <div>
                <FieldName fieldName='פרטי טיסת חזור לארץ:' className={fieldContainer} />
                {
                  exposures.map((exposure, index) =>
                    exposure.wasAbroad &&
                    <>
                      <FlightsForm
                        fieldsNames={fieldsNames}
                        key={(exposure.id || '') + index.toString()}
                        exposureAndFlightsData={exposure}
                        handleChangeExposureDataAndFlightsField={
                          (fieldName: string, value: any) => handleChangeExposureDataAndFlightsField(index, fieldName, value)
                        }
                      />
                      <Divider />
                    </>
                  )
                }
                <IconButton
                  test-id='addFlight'
                  onClick={() => onExposureAdded(false, true)}
                  disabled={disableFlightAddition}
                >
                  <AddCircle color={disableFlightAddition ? 'disabled' : 'primary'} />
                </IconButton>
                <Typography variant='caption'>
                  {addFlightButton}
                </Typography>
              </div>
            </Collapse>
          </div>
        </form>
      </FormProvider>
  );
};

interface Props {
  id: number;
}

export default ExposuresAndFlights;
