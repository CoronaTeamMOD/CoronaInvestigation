import React, { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Collapse, Divider, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';

import { exposureAndFlightsContext, ExposureAndFlightsDetails, fieldsNames } from "commons/Contexts/ExposuresAndFlights";
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import axios from 'Utils/axios';

import FlightsForm from './FlightsForm/FlightsForm';
import ExposureForm from './ExposureForm/ExposureForm';
import useExposuresAndFlightsSaving from "./useExposuresAndFlightsSaving";
import useFormStyles from 'styles/formStyles';
import useStyles from './ExposuresAndFlightsStyles';


const ExposuresAndFlights : React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
  const context = useContext(exposureAndFlightsContext);
  const { exposureAndFlightsData, setExposureDataAndFlights } = context;
  const { saveExposuresAndFlightsData } = useExposuresAndFlightsSaving();

  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

  const { fieldName } = useFormStyles();
  const classes = useStyles();

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

  const saveExposure = (e: any, exposuresAndFlightsData: any | ExposureAndFlightsDetails) => {
    e.preventDefault();
    console.log("ExposureTab");
    onSubmit();
    // saveExposuresAndFlightsData(exposuresAndFlightsData);
  }

  return (
    <>
      <form id={`form-${id}`} onSubmit={(e) => saveExposure(e, { name: "itay" })}>
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
      </form>
    </>
  );
};

interface Props {
  id: number,
  onSubmit: any
}

export default ExposuresAndFlights;
