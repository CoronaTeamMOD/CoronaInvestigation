import React, { useEffect, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { AddCircle } from '@material-ui/icons';
import { Collapse, Divider, Typography, IconButton } from '@material-ui/core';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import { setFormState } from 'redux/Form/formActionCreators';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import FormTitle from 'commons/FormTitle/FormTitle';
import FieldName from 'commons/FieldName/FieldName';
import useExposuresSaving from 'Utils/ControllerHooks/useExposuresSaving';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';

import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from './ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';
import { exposureAndFlightsContext, Exposure, initialExposureOrFlight, isConfirmedExposureInvalid, isFlightInvalid, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

const addConfirmedExposureButton: string = 'הוסף חשיפה';
const addFlightButton: string = 'הוסף טיסה לחול';

const defaultDestinationCountryCode = '900';

const ExposuresAndFlights : React.FC<Props> = ({ id }: Props): JSX.Element => {
  const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);;
  const { exposures, wereFlights, wereConfirmedExposures } = exposureAndFlightsData;
  const { parseAddress } = useGoogleApiAutocomplete();
  const {saveExposureAndFlightData} = useExposuresSaving({ exposureAndFlightsData, setExposureDataAndFlights });

  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
  const userId = useSelector<StoreStateType, string>(state => state.user.id);

  const methods = useForm();

  const { fieldContainer } = useFormStyles();
  const classes = useStyles();

  const disableConfirmedExposureAddition : boolean= React.useMemo(() => 
    exposures.some(exposure => exposure.wasConfirmedExposure && isConfirmedExposureInvalid(exposure))
    , [exposures]);
  
  const disableFlightAddition : boolean= React.useMemo(() => 
    exposures.some(exposure => exposure.wasAbroad && isFlightInvalid(exposure))
    , [exposures]);

  const [coronaTestDate, setCoronaTestDate] = useState<Date>();

  const doesHaveConfirmedExposures = (checkedExposures: Exposure[]) => checkedExposures.some(exposure => exposure.wasConfirmedExposure)
  const doesHaveFlights = (checkedExposures: Exposure[]) => checkedExposures.some(exposure => exposure.wasAbroad)

  React.useEffect(() => {
    (wereConfirmedExposures && !doesHaveConfirmedExposures(exposures)) && onExposureAdded(true, false);
  }, [wereConfirmedExposures])

  React.useEffect(() => {
    (wereFlights && !doesHaveFlights(exposures)) && onExposureAdded(false, true);
  }, [wereFlights])

  const parseDbExposure = (exposure:Exposure) => {
    const {exposureAddress, ...restOfData} = exposure;
    return ({exposureAddress: parseAddress(exposureAddress), ...restOfData});
  };

  const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : undefined;

  const fetchExposuresAndFlights = () => {
    logger.info({
      service: Service.CLIENT,
      severity: Severity.LOW,
      workflow: 'Fetching Exposures And Flights',
      step: `launching exposures and flights request`,
      user: userId,
      investigation: investigationId
    });
    axios
      .get('/exposure/exposures/' + investigationId)
      .then(result => {
        logger.info({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Fetching Exposures And Flights',
          step: 'got results back from the server',
          user: userId,
          investigation: investigationId
        });
        const data: Exposure[] = result?.data;
        return data && data.map(parseDbExposure);
      })
      .then((exposures?: Exposure[]) => {
        if (exposures) {
          setExposureDataAndFlights({
            exposures,
            exposuresToDelete: [],
            wereConfirmedExposures: doesHaveConfirmedExposures(exposures),
            wereFlights: doesHaveFlights(exposures),
          });
        }
      })
      .then(() => {
        logger.info({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Getting Corona Test Date',
          step: `launching Corona Test Date request`,
          user: userId,
          investigation: investigationId
        });
        axios.get('/clinicalDetails/coronaTestDate/' + investigationId).then((res: any) => {
          if (res.data) {
            logger.info({
              service: Service.CLIENT,
              severity: Severity.LOW,
              workflow: 'Getting Corona Test Date',
              step: 'got results back from the server',
              user: userId,
              investigation: investigationId
            });
            setCoronaTestDate(convertDate(res.data.coronaTestDate));
          } else {
            logger.warn({
              service: Service.CLIENT,
              severity: Severity.HIGH,
              workflow: 'Getting Corona Test Date',
              step: 'got status 200 but wrong data'
            });
          }
        })
      })
      .catch((error) => {
        logger.error({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Fetching Exposures And Flights',
          step: `got error from server: ${error}`,
          investigation: investigationId,
          user: userId
        });
        Swal.fire({
          title: 'לא ניתן היה לטעון את החשיפה',
          icon: 'error',
        })
      });
  }

  const fetchResorts = () => {
    const workflow = 'Fetching investigated patient resorts data'
    logger.info({
      service: Service.CLIENT,
      severity: Severity.LOW,
      workflow,
      step: `launching investigated patient resorts request`,
      user: userId,
      investigation: investigationId
    });
    axios.get('investigationPatient/resorts')
    .then((result) => {
      if (result?.data) {
        logger.info({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow,
          step: `got investigated patient resorts response successfully`,
          user: userId,
          investigation: investigationId
        });

      } else {
        logger.error({
          service: Service.CLIENT,
          severity: Severity.HIGH,
          workflow,
          step: `failed to investigated patient resorts response`,
          user: userId,
          investigation: investigationId
        });
      }
    }).catch(error => {
      logger.error({
        service: Service.CLIENT,
        severity: Severity.HIGH,
        workflow,
        step: `failed to get resorts response due to ` + error,
        user: userId,
        investigation: investigationId
      });
    })
  }

  useEffect(() => {
    fetchExposuresAndFlights();
  }, []);

  const handleChangeExposureDataAndFlightsField = (index: number, fieldName: string, value: any) => {
    const updatedExpousres = [...exposureAndFlightsData.exposures];
    const updatedExposure = {...updatedExpousres[index], [fieldName]: value};
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
    const newExposure : Exposure = {...initialExposureOrFlight, wasConfirmedExposure, wasAbroad };
    if (wasAbroad) newExposure.flightDestinationCountry = defaultDestinationCountryCode;
    const updatedExposures : Exposure[] = [...exposures, newExposure];
    setExposureDataAndFlights({
      ...exposureAndFlightsData,
        exposures: updatedExposures,
    });
  }

  const saveExposure = (e: React.ChangeEvent<{}>) => {
    e.preventDefault();
    setFormState(investigationId, id, true);
    logger.info({
      service: Service.CLIENT,
      severity: Severity.LOW,
      workflow: 'Saving Exposures And Flights tab',
      step: 'launching the server request',
      investigation: investigationId,
      user: userId
  })
    saveExposureAndFlightData().then(() => {
      logger.info({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Saving Exposures And Flights tab',
          step: 'saved exposures and flights successfully',
          investigation: investigationId,
          user: userId
      });
    })
    .catch((error) => {
      logger.error({
          service: Service.CLIENT,
          severity: Severity.LOW,
          workflow: 'Saving Exposures And Flights tab',
          step: `got error from server: ${error}`,
          investigation: investigationId,
          user: userId
      });
      Swal.fire({
          title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
          icon: 'error'
      });
    })
  }

  return (
    <>
      <FormProvider {...methods}>
        <form id={`form-${id}`} onSubmit={(e) => saveExposure(e)}>
          <div className={classes.subForm}>
              <FormTitle title='חשיפה אפשרית'/>

              <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
              <Toggle
                value={wereConfirmedExposures}
                onChange={(e, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wereConfirmedExposures,value)
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
                          coronaTestDate={coronaTestDate}
                          key={(exposure.id || '') + index.toString()}
                          fieldsNames={fieldsNames}
                          exposureAndFlightsData={exposure}
                          handleChangeExposureDataAndFlightsField={
                            (fieldName: string, value: any) => handleChangeExposureDataAndFlightsField(index, fieldName, value)
                          }
                        />
                        <Divider/>
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
              <FormTitle title='חזרה מחו״ל'/>

              <FormRowWithInput testId='wasAbroad' fieldName='האם חזר מחו״ל?'>
              <Toggle
                value={wereFlights}
                onChange={(e, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wereFlights,value)
                  }
                }}
              />
            </FormRowWithInput>

            <Collapse
              in={wereFlights}
              className={classes.additionalInformationForm}
            >
              <div>
                  <FieldName fieldName='פרטי טיסת חזור לארץ:' className={fieldContainer}/>
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
                      <Divider/>
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
