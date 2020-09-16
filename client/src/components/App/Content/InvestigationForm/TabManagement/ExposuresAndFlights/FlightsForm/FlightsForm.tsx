import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';

import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import DatePick from 'commons/DatePick/DatePick';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import useFormStyles from 'styles/formStyles';
import { dateFormatForDatePicker } from 'Utils/displayUtils';

import AirportInput from './AirportInput/AirportInput';

const FlightsForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();

  const updateDateOnBlur = (event: React.FocusEvent<HTMLInputElement>, fieldName: string) => {
    const newDate = event.target.value ? new Date(event.target.value) : null
    handleChangeExposureDataAndFlightsField(fieldName, newDate);
  }

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
            type="date"
            defaultValue={exposureAndFlightsData[fieldsNames.flightStartDate] ? format(new Date(exposureAndFlightsData[fieldsNames.flightStartDate]), dateFormatForDatePicker) : dateFormatForDatePicker}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,fieldsNames.flightStartDate)}
          />
          <Typography variant="caption">עד תאריך</Typography>
          <DatePick
            required
            type="date"
            defaultValue={exposureAndFlightsData[fieldsNames.flightEndDate] ? format(new Date(exposureAndFlightsData[fieldsNames.flightEndDate]), dateFormatForDatePicker) : dateFormatForDatePicker}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => updateDateOnBlur(event,fieldsNames.flightEndDate)}
          />
        </div>
      </FormRowWithInput>

      <FormRowWithInput fieldName="חברת תעופה:">
        <CircleTextField
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
        <CircleTextField
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
