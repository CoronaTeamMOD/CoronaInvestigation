import React, { useEffect, useContext } from 'react';
import { Collapse, Divider, Typography } from '@material-ui/core';
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import FlightsForm from './FlightsForm/FlightsForm';
import ExposureForm from './ExposureForm/ExposureForm';
import useFormStyles from 'styles/formStyles';
import useStyles from './ExposuresAndFlightsStyles';
import { exposureAndFlightsContext, fieldsNames} from 'commons/Contexts/ExposuresAndFlights';
import axios from 'Utils/axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

const ExposuresAndFlights = () => {
  const context = useContext(exposureAndFlightsContext);
  const { exposureAndFlightsData, setExposureDataAndFlights } = context;
  
  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

  const { fieldName } = useFormStyles();
  const classes = useStyles();

  useEffect(() => {
    axios
      .get('/exposure/' + investigationId)
      .then((result: any) => {
        if(result && result.data && result.data.data){
          const data = result.data.data.allExposures.nodes[0];
          if (data) {
            setExposureDataAndFlights(data);
          }
        }
      })
      .catch((err) => console.log(err));
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

export default ExposuresAndFlights;
