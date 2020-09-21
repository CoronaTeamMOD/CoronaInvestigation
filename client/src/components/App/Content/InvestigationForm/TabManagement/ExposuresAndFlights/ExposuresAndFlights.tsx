import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Collapse, Divider, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import { tabsObserver } from '../../InvestigationForm';
import FlightsForm from './FlightsForm/FlightsForm';
import ExposureForm from './ExposureForm/ExposureForm';
import useFormStyles from 'styles/formStyles';
import useStyles from './ExposuresAndFlightsStyles';
import { ExposureAndFlightsDetails, fieldsNames, useExposuresAndFlightsSaving } from './hooks/useExposuresAndFlightsSaving'

const initialExposuresAndFlightsData: ExposureAndFlightsDetails = {
  id: null,
  wasConfirmedExposure: false,
  exposureFirstName: null,
  exposureLastName: null,
  exposureDate: null,
  exposureAddress: null,
  exposurePlaceType: null,
  exposurePlaceSubType: null,
  wasAbroad: false,
  flightDestinationCountry: null,
  flightDestinationCity: null,
  flightDestinationAirport: null,
  flightOriginCountry: null,
  flightOriginCity: null,
  flightOriginAirport: null,
  flightStartDate: null,
  flightEndDate: null,
  airline: null,
  flightNum: null
};

const ExposuresAndFlights: React.FC<Props> = ({ id }: Props) => {

  const { fieldName } = useFormStyles();
  const classes = useStyles();

  const  [exposureAndFlightsData, setExposureDataAndFlights] = useState(initialExposuresAndFlightsData);
  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

  const { saveExposuresAndFlightsData } = useExposuresAndFlightsSaving(exposureAndFlightsData);

  useEffect(() => {
    console.log("1,2,3");
    tabsObserver.subscribe(id, () => {
      saveExposuresAndFlightsData();
    })
  }, [exposureAndFlightsData])

  useEffect(() => {
    axios
      .get('/exposure/' + investigationId)
      .then((result: any) => {
        if (result && result.data && result.data.data) {
          const data = result.data.data.allExposures.nodes[0];
          if (data) {
            setExposureDataAndFlights(data);
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

  const handleChangeExposureDataAndFlightsField = (fieldName: string, value: any) => {
    setExposureDataAndFlights({
      ...exposureAndFlightsData,
      [fieldName]: value,
    });
  };

  return (
    <>
      <div className={classes.subForm}>
        <Typography variant="caption" className={fieldName}>
          חשיפה אפשרית
        </Typography>

        <FormRowWithInput fieldName="האם היה מגע ידוע עם חולה מאומת?">
          <Toggle
            value={exposureAndFlightsData.wasConfirmedExposure}
            onChange={() => {
              handleChangeExposureDataAndFlightsField(
                fieldsNames.wasConfirmedExposure,
                !exposureAndFlightsData.wasConfirmedExposure
              );
            }}
          />
        </FormRowWithInput>

        <Collapse
          in={exposureAndFlightsData.wasConfirmedExposure}
          className={classes.additionalInformationForm}
        >
          <ExposureForm
            exposureAndFlightsData={exposureAndFlightsData}
            fieldsNames={fieldsNames}
            handleChangeExposureDataAndFlightsField={
              handleChangeExposureDataAndFlightsField
            }
          />
        </Collapse>
      </div>

      <Divider />

      <div className={classes.subForm}>
        <Typography variant="caption" className={fieldName}>
          חזרה מחו״ל
        </Typography>

        <FormRowWithInput fieldName="האם חזר מחו״ל?">
          <Toggle
            value={exposureAndFlightsData.wasAbroad}
            onChange={() => {
              handleChangeExposureDataAndFlightsField(
                fieldsNames.wasAbroad,
                !exposureAndFlightsData.wasAbroad
              );
            }}
          />
        </FormRowWithInput>

        <Collapse
          in={exposureAndFlightsData.wasAbroad}
          className={classes.additionalInformationForm}
        >
          <FlightsForm
            exposureAndFlightsData={exposureAndFlightsData}
            fieldsNames={fieldsNames}
            handleChangeExposureDataAndFlightsField={
              handleChangeExposureDataAndFlightsField
            }
          />
        </Collapse>
      </div>
    </>
  );
};

interface Props {
  id: number;
}

export default ExposuresAndFlights;
