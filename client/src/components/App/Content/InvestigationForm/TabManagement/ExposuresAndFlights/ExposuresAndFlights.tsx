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
import ExposureForm from './ExposureForm/ExposureForm';
import { useExposuresAndFlights } from './useExposuresAndFlights'

const addConfirmedExposureButton: string = 'הוסף חשיפה';
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
          <div className={classes.subForm}>
            <FormTitle title='חשיפה אפשרית' />
            <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
              <Toggle
                value={wereConfirmedExposures}
                onChange={(e, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wereConfirmedExposures, value)
                  }
                }}
              />
            </FormRowWithInput>
            <Collapse
              in={wereConfirmedExposures}
              className={classes.additionalInformationForm}
            >
              <div>
                {
                  exposures.map((exposure, index) =>
                    exposure.wasConfirmedExposure &&
                    <>
                      <ExposureForm
                        key={(exposure.id || '') + index.toString()}
                        fieldsNames={fieldsNames}
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
                  test-id='addConfirmedExposure'
                  onClick={() => onExposureAdded(true, false)}
                  disabled={disableConfirmedExposureAddition}
                >
                  <AddCircle color={disableConfirmedExposureAddition ? 'disabled' : 'primary'} />
                </IconButton>
                <Typography
                  variant='caption'
                >
                  {addConfirmedExposureButton}
                </Typography>
              </div>
            </Collapse>
          </div>

          <Divider />

          <div className={classes.subForm}>
            <FormTitle title='חזרה מאילת או מים המלח' />
             <FormRowWithInput fieldName='חזר מאילת'>
              <Toggle
                value={wasInEilat}
                onChange={(event, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wasInEilat, value);
                  }
                }}
              />
            </FormRowWithInput>
            <FormRowWithInput fieldName='חזר מים המלח'>
              <Toggle
                value={wasInDeadSea}
                onChange={(event, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wasInDeadSea, value);
                  }
                }}
              />
            </FormRowWithInput>
          </div>

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
