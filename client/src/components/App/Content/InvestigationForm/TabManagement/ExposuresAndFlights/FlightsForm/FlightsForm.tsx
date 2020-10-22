import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import AirportInput from './AirportInput/AirportInput';

const FlightsForm = (props: any) => {
  const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, } = props;

  const classes = useFormStyles();

  return (
    <Grid className={classes.form} container justify='flex-start'>
      <FormRowWithInput testId='flightStartingPoint' fieldName='מוצא:'>
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
      
      <FormRowWithInput testId='flightDestination' fieldName='יעד:'>
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

      <FormRowWithInput fieldName='תאריך טיסה:'>
        <div className={classes.inputRow}>
          <Typography variant='caption'>מתאריך</Typography>
          <DatePick
            maxDate={new Date()}
            testId='flightFromDate'
            labelText='מתאריך'
            value={exposureAndFlightsData[fieldsNames.flightStartDate]}
            onChange={(newDate: Date) =>
              handleChangeExposureDataAndFlightsField(fieldsNames.flightStartDate, newDate)
            }
          />
          <Typography variant='caption'>עד תאריך</Typography>
          <DatePick
            maxDate={new Date()}
            testId='flightToDate'
            labelText='עד'
            value={exposureAndFlightsData[fieldsNames.flightEndDate]}
            onChange={(newDate: Date) =>
              handleChangeExposureDataAndFlightsField(fieldsNames.flightEndDate, newDate)
            }
          />
        </div>
      </FormRowWithInput>

      <FormRowWithInput fieldName='חברת תעופה:'>
        <AlphanumericTextField
          testId='airlineCompany'
          name={fieldsNames.airline}
          value={exposureAndFlightsData[fieldsNames.airline]}
          onChange={(value) => handleChangeExposureDataAndFlightsField(fieldsNames.airline, value)}
          placeholder='הזן חברת תעופה'
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName='מספר טיסה:'>
        <AlphanumericTextField
          testId='airlineNumber'
          name={fieldsNames.flightNumber}
          value={exposureAndFlightsData[fieldsNames.flightNumber]}
          onChange={(value) => handleChangeExposureDataAndFlightsField(fieldsNames.flightNumber, value)}
          placeholder='הזן מספר טיסה'
        />
      </FormRowWithInput>
    </Grid>
  );
};

export default FlightsForm;
