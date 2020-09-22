import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { AddCircle } from '@material-ui/icons';
import React, { useEffect, useContext, useState } from 'react';
import { Collapse, Divider, Typography, IconButton } from '@material-ui/core';

import axios from 'Utils/axios';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { exposureAndFlightsContext, fieldsNames, Exposure, initialExposureOrFlight } from 'commons/Contexts/ExposuresAndFlights';

import useFormStyles from 'styles/formStyles';
import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from './ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';

const addExposureButton: string = 'הוסף חשיפה';

const ExposuresAndFlights = () => {
  const context = useContext(exposureAndFlightsContext);
  const { exposureAndFlightsData, setExposureDataAndFlights } = context;
  const { exposures } = exposureAndFlightsData;

  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

  const { fieldName } = useFormStyles();
  const classes = useStyles();

  
  const confirmedExposures : Exposure[] = React.useMemo(() => exposures.filter(exposure => exposure.wasConfirmedExposure), [exposures]);
  
  const flights : Exposure[] = React.useMemo(() => exposures.filter(exposure => exposure.wasAbroad), [exposures]);
  
  const disableAddConfirmedExposure : boolean= React.useMemo(() => 
  confirmedExposures.some(exposure => !exposure.exposureFirstName || !exposure.exposureLastName || !exposure.exposureAddress)
  , [confirmedExposures]);
  
  const [wereConfirmedExposures, setWereConfirmedExposures] = useState<boolean>(confirmedExposures.length > 0);
  const [wereFlights, setWereFlights] = useState<boolean>(flights.length > 0);
    // const confirmedExposures : Exposure[] = React.useMemo(() => {
    //   const updatedExposures = exposures.filter(exposure => exposure.wasConfirmedExposure);
    //   setWereConfirmedExposures(updatedExposures.length > 0);
    //   return updatedExposures;
    // }, [exposures]);
  
    // const flights : Exposure[] = React.useMemo(() => {
    //   const updatedExposures = exposures.filter(exposure => exposure.wasAbroad);
    // }, [exposures]);
  // const [confirmedExposures, setConfirmedExposures] = useState<Exposure[]>([]);
  // const [flights, setFlights] = useState<Exposure[]>([]);

  // React.useEffect(() => {
  //   if (exposureAndFlightsData.exposures.length > 0) {
  //     const newConfirmedExposures : Exposure[] = [];
  //     const newFlights : Exposure[] = [];
  
  //     exposureAndFlightsData.exposures.forEach(exposure => {
  //       if (exposure.wasConfirmedExposure) newConfirmedExposures.push(exposure);
  //       else if (exposure.wasConfirmedExposure) newFlights.push(exposure);
  //     })
  
  //     setWereConfirmedExposures(newConfirmedExposures.length > 0);
  //     setWereFlights(newFlights.length > 0);
  
  //     setConfirmedExposures(newConfirmedExposures);
  //     setFlights(newFlights);
  //   }

  // }, [exposureAndFlightsData.exposures]);

  // React.useMemo(() => {
  //   const hasInvalidContact: boolean = contacts.some(
  //     (contact) =>
  //       !contact.firstName || !contact.lastName || !contact.phoneNumber
  //   );
  //   setCanAddContact(!hasInvalidContact);
  // }, [contacts]);

  useEffect(() => {
    axios
      .get('/exposure/' + investigationId)
      .then((result: any) => {
        if (result && result.data && result.data.data) {
          const data = result.data.data.allExposures.nodes;
          if (data) {
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

  // const handleChangeExposureDataAndFlightsField = (index: number, isConfirmedExposure: boolean, fieldName: string, value: any) => {
  //   if (isConfirmedExposure) {
  //     const updatedExpousres = [...confirmedExposures];
  //     const updatedExposure = {...updatedExpousres[index], [fieldName]: value};
  //     updatedExpousres.splice(index, 1, updatedExposure);
  //     setConfirmedExposures(updatedExpousres);
  //   } else {
  //     const updatedExpousres = [...flights];
  //     const updatedExposure = {...updatedExpousres[index], [fieldName]: value};
  //     updatedExpousres.splice(index, 1, updatedExposure);
  //     setFlights(updatedExpousres);
  //   }
  // };

  const handleChangeExposureDataAndFlightsField = (index: number, fieldName: string, value: any) => {
    const updatedExpousres = [...exposureAndFlightsData.exposures];
    const updatedExposure = {...updatedExpousres[index], [fieldName]: value};
    updatedExpousres.splice(index, 1, updatedExposure);
    setExposureDataAndFlights({
      ...exposureAndFlightsData,
      exposures: updatedExpousres,
    });
  };

  const onConfirmExposureAdded = () => {
    const updatedExposures : Exposure[] = [...exposures, {...initialExposureOrFlight, wasConfirmedExposure: true}]
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

        <FormRowWithInput fieldName='האם היה מגע ידוע עם חולה מאומת?'>
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
              confirmedExposures.map((exposure, index) => 
                <ExposureForm
                  exposureAndFlightsData={exposure}
                  fieldsNames={fieldsNames}
                  handleChangeExposureDataAndFlightsField={
                    (fieldName: string, value: any) => handleChangeExposureDataAndFlightsField(index, fieldName, value)
                  }
                />
              )
            }
            <IconButton
              test-id='addExposure'
              onClick={onConfirmExposureAdded}
              disabled={disableAddConfirmedExposure}
            >
              <AddCircle color={disableAddConfirmedExposure ? 'disabled' : 'primary'} />
            </IconButton>
            <Typography
              variant='caption'
            >
              {addExposureButton}
            </Typography>
          </div>
        </Collapse>
      </div>

      <Divider />

      <div className={classes.subForm}>
        <Typography variant='caption' className={fieldName}>
          חזרה מחו״ל
        </Typography>

        <FormRowWithInput fieldName='האם חזר מחו״ל?'>
          <Toggle
            value={wereFlights}
            onChange={() => setWereFlights(!wereFlights)}
          />
        </FormRowWithInput>

        <Collapse
          in={wereFlights}
          className={classes.additionalInformationForm}
        >
          {
              flights.map((exposure, index) => 
                <FlightsForm
                  exposureAndFlightsData={exposure}
                  fieldsNames={fieldsNames}
                  handleChangeExposureDataAndFlightsField={
                    (fieldName: string, value: any) => handleChangeExposureDataAndFlightsField(index, fieldName, value)
                  }
                />
              )
            }
        </Collapse>
      </div>
    </>
  );
};

export default ExposuresAndFlights;
