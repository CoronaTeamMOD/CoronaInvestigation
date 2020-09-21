import React from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';

import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import DatePick from 'commons/DatePick/DatePick';
import useFormStyles from 'styles/formStyles';

import AirportInput from './AirportInput/AirportInput';

const FlightsForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();

  return (
    <Grid className={classes.form} container justify="flex-start">
      <FormRowWithInput fieldName="יעד:">
        <AirportInput
          country={exposureAndFlightsData[fieldsNames.destinationCountry]}
          countryFieldName={fieldsNames.destinationCountry}
          city={exposureAndFlightsData[fieldsNames.destinationCity]}
          cityFieldName={fieldsNames.destinationCity}
          airport={exposureAndFlightsData[fieldsNames.destinationAirport]}
          airportFieldName={fieldsNames.destinationAirport}
          handleChangeExposureDataAndFlightsField={
            handleChangeExposureDataAndFlightsField
          }
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="מוצא:">
        <AirportInput
          country={exposureAndFlightsData[fieldsNames.originCountry]}
          countryFieldName={fieldsNames.originCountry}
          city={exposureAndFlightsData[fieldsNames.originCity]}
          cityFieldName={fieldsNames.originCity}
          airport={exposureAndFlightsData[fieldsNames.originAirport]}
          airportFieldName={fieldsNames.originAirport}
          handleChangeExposureDataAndFlightsField={
            handleChangeExposureDataAndFlightsField
          }
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="תאריך טיסה:">
        <div className={classes.formRow}>
          <Typography variant="caption">מתאריך</Typography>
          <DatePick
            required
            labelText="מתאריך"
            value={exposureAndFlightsData[fieldsNames.flightStartDate]}
            onChange={(newDate: Date) =>
              handleChangeExposureDataAndFlightsField(
                fieldsNames.flightStartDate,
                newDate
              )
            }
          />
          <Typography variant="caption">עד תאריך</Typography>
          <DatePick
            required
            labelText="עד"
            value={exposureAndFlightsData[fieldsNames.flightEndDate]}
            onChange={(newDate: Date) =>
              handleChangeExposureDataAndFlightsField(
                fieldsNames.flightEndDate,
                newDate
              )
            }
          />
        </div>
      </FormRowWithInput>

      <FormRowWithInput fieldName="חברת תעופה:">
        <TextField
          required
          value={exposureAndFlightsData[fieldsNames.airline]}
          onChange={(e) =>
            handleChangeExposureDataAndFlightsField(
              fieldsNames.airline,
              e.target.value
            )
          }
          placeholder="הזן חברת תעופה"
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="מספר טיסה:">
        <TextField
          required
          value={exposureAndFlightsData[fieldsNames.flightNumber]}
          onChange={(e) =>
            handleChangeExposureDataAndFlightsField(
              fieldsNames.flightNumber,
              e.target.value
            )
          }
          placeholder="הזן מספר טיסה"
        />
      </FormRowWithInput>
    </Grid>
  );
};

export default FlightsForm;
