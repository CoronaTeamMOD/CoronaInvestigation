import { useSelector } from 'react-redux';
import { AddCircle } from '@material-ui/icons';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useContext, useState } from 'react';
import { Collapse, Divider, Typography, IconButton } from '@material-ui/core';

import axios from 'Utils/axios';
import ResortData from 'models/ResortData';
import logger from 'logger/logger';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import FormTitle from 'commons/FormTitle/FormTitle';
import FieldName from 'commons/FieldName/FieldName';
import { setFormState } from 'redux/Form/formActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import useExposuresSaving from 'Utils/ControllerHooks/useExposuresSaving';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';
import { exposureAndFlightsContext, Exposure, initialExposureOrFlight, isConfirmedExposureInvalid, isFlightInvalid, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from './ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';

const addConfirmedExposureButton: string = 'הוסף חשיפה';
const addFlightButton: string = 'הוסף טיסה לחול';

const defaultDestinationCountryCode = '900';

const ExposuresAndFlights: React.FC<Props> = ({ id }: Props): JSX.Element => {
  const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);
  const { exposures, wereFlights, wereConfirmedExposures, wasInEilat, wasInDeadSea } = exposureAndFlightsData;
  
  const { saveExposureAndFlightData, saveResortsData } = useExposuresSaving({ exposureAndFlightsData, setExposureDataAndFlights });
  const { parseAddress } = useGoogleApiAutocomplete();
  const { alertError } = useCustomSwal();

  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
  const investigatedPatientId = useSelector<StoreStateType, number>((state) => state.investigation.investigatedPatient.investigatedPatientId);

  const methods = useForm();

  const { fieldContainer } = useFormStyles();
  const classes = useStyles();

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

  const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : undefined;

  const fetchExposuresAndFlights = () => {
    const fetchExposuresAndFlightsLogger = logger.setup('Fetching Exposures And Flights');

    const getCoronaTestDateLogger = logger.setup('Getting Corona Test Date');

    fetchExposuresAndFlightsLogger.info('launching exposures and flights request', Severity.LOW);
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
              setExposureDataAndFlights({
                exposures,
                exposuresToDelete: [],
                wereConfirmedExposures: doesHaveConfirmedExposures(exposures),
                wereFlights: doesHaveFlights(exposures),
                wasInEilat: result.wasInEilat,
                wasInDeadSea: result.wasInDeadSea,
              });
          }).catch((error) => {
            getCoronaTestDateLogger.error(`failed to get resorts response due to ${error}`, Severity.HIGH);
          })
        }
      })
      .catch((error) => {
        fetchExposuresAndFlightsLogger.error(`got error from server: ${error}`, Severity.HIGH);
        alertError('לא ניתן היה לטעון את החשיפה');
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

  const saveExposure = (event: React.ChangeEvent<{}>) => {
    event.preventDefault();
    const saveExposureLogger = logger.setup('Saving Exposures And Flights tab');
    saveExposureLogger.info('launching the server request', Severity.LOW);
    const tabSavePromises = [saveExposureAndFlightData(), saveResortsData()];
    Promise.all(tabSavePromises)
    .then(() => {
      saveExposureLogger.info('saved confirmed exposures, flights and resorts data successfully', Severity.LOW);
    })
    .catch((error) => {
      saveExposureLogger.error(`got error from server: ${error}`, Severity.HIGH);
      alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות');
    })
    .finally(() => setFormState(investigationId, id, true))
  }

  return (
    <>
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
    </>
  );
};

interface Props {
  id: number;
}

export default ExposuresAndFlights;
