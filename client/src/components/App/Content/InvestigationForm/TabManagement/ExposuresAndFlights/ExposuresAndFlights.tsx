import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { AddCircle } from '@material-ui/icons';
import React, { useEffect, useContext, useState } from 'react';
import { Collapse, Divider, Typography, IconButton } from '@material-ui/core';

import axios from 'Utils/axios';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { exposureAndFlightsContext, fieldsNames, Exposure, initialExposureOrFlight, isConfirmedExposureInvalid, isFlightInvalid } from 'commons/Contexts/ExposuresAndFlights';

import useFormStyles from 'styles/formStyles';
import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from './ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';

const addConfirmedExposureButton: string = 'הוסף חשיפה';
const addFlightButton: string = 'הוסף טיסה לחול';

const ExposuresAndFlights = () => {
  const { exposureAndFlightsData, setExposureDataAndFlights } = useContext(exposureAndFlightsContext);;
  const { exposures } = exposureAndFlightsData;

  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

  const { fieldName } = useFormStyles();
  const classes = useStyles();

  const disableConfirmedExposureAddition : boolean= React.useMemo(() => 
    exposures.some(exposure => exposure.wasConfirmedExposure && isConfirmedExposureInvalid(exposure))
    , [exposures]);
  
  const disableFlightAddition : boolean= React.useMemo(() => 
    exposures.some(exposure => exposure.wasAbroad && isFlightInvalid(exposure))
    , [exposures]);

  const [wereConfirmedExposures, setWereConfirmedExposures] = useState<boolean>(false);
  const [wereFlights, setWereFlights] = useState<boolean>(false);

  const doesHaveConfirmedExposures = (checkedExposures: Exposure[]) => checkedExposures.some(exposure => exposure.wasConfirmedExposure)
  const doesHaveFlights = (checkedExposures: Exposure[]) => checkedExposures.some(exposure => exposure.wasAbroad)

  React.useEffect(() => {
    (wereConfirmedExposures && !doesHaveConfirmedExposures(exposures)) && onExposureAdded(true, false);
  }, [wereConfirmedExposures])

  React.useEffect(() => {
    (wereFlights && !doesHaveFlights(exposures)) && onExposureAdded(false, true);
  }, [wereFlights])

  useEffect(() => {
    axios
      .get('/exposure/' + investigationId)
      .then((result: any) => {
        if (result && result.data && result.data.data) {
          const data : Exposure[] = result.data.data.allExposures.nodes;
          if (data) {
            setWereConfirmedExposures(doesHaveConfirmedExposures(data))
            setWereFlights(doesHaveFlights(data))
            setExposureDataAndFlights({exposures: data});
          }
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'לא ניתן היה לטעון את החשיפה',
          icon: 'error',
        })
      });
  }, [investigationId]);

  const handleChangeExposureDataAndFlightsField = (index: number, fieldName: string, value: any) => {
    const updatedExpousres = [...exposureAndFlightsData.exposures];
    const updatedExposure = {...updatedExpousres[index], [fieldName]: value};
    updatedExpousres.splice(index, 1, updatedExposure);
    setExposureDataAndFlights({
      ...exposureAndFlightsData,
      exposures: updatedExpousres,
    });
  };

  const onExposureAdded = (wasConfirmedExposure: boolean, wasAbroad: boolean) => {
    const updatedExposures : Exposure[] = [...exposures, {...initialExposureOrFlight, wasConfirmedExposure, wasAbroad}]
    setExposureDataAndFlights({
      ...exposureAndFlightsData,
        exposures: updatedExposures,
    });
  }

  return (
    <>
      <div className={classes.subForm}>
        <Typography variant='caption' className={fieldName}>
          חשיפה אפשרית
        </Typography>

        <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
          <Toggle
            value={wereConfirmedExposures}
            onChange={() => setWereConfirmedExposures(!wereConfirmedExposures)}
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
                      exposureAndFlightsData={exposure}
                      fieldsNames={fieldsNames}
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
        <Typography variant='caption' className={fieldName}>
          חזרה מחו״ל
        </Typography>

        <FormRowWithInput testId='wasAbroad' fieldName='האם חזר מחו״ל?'>
          <Toggle
            value={wereFlights}
            onChange={() => setWereFlights(!wereFlights)}
          />
        </FormRowWithInput>

        <Collapse
          in={wereFlights}
          className={classes.additionalInformationForm}
        >
          <div>
            {
              exposures.map((exposure, index) => 
                exposure.wasAbroad &&
                <>
                  <FlightsForm
                  key={(exposure.id || '') + index.toString()}
                  exposureAndFlightsData={exposure}
                    fieldsNames={fieldsNames}
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
            <Typography
              variant='caption'
            >
              {addFlightButton}
            </Typography>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default ExposuresAndFlights;
