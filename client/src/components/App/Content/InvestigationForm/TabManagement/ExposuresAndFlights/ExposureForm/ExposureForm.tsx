import React from 'react';
import { Grid, TextField } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import LocationInput from 'commons/LocationInputField/LocationInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useFormStyles from 'styles/formStyles';
import {exposuresContext} from "commons/Contexts/ExposuresAndFlights";
import Map from "../../../../../../../Map/Map";

const ExposureForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();

  return (
    <Grid className={classes.form} container justify="flex-start">
      <FormRowWithInput fieldName="שם החולה:">
        <>
          <TextField
            required
            value={exposureAndFlightsData[fieldsNames.firstName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(
                fieldsNames.firstName,
                e.target.value
              )
            }
            placeholder="שם פרטי"
          />
          <TextField
            required
            value={exposureAndFlightsData[fieldsNames.lastName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(
                fieldsNames.lastName,
                e.target.value
              )
            }
            placeholder="שם משפחה"
          />
        </>
      </FormRowWithInput>

      <FormRowWithInput fieldName="תאריך החשיפה:">
        <DatePick
          labelText="תאריך"
          value={exposureAndFlightsData[fieldsNames.date]}
          onChange={(newDate: Date) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.date, newDate)
          }
        />
      </FormRowWithInput>
            <FormRowWithInput fieldName='שם מקום החשיפה:'>
                <Map />
            </FormRowWithInput>

      <FormRowWithInput fieldName="כתובת החשיפה:">
        <LocationInput
          selectedAddress={exposureAndFlightsData[fieldsNames.address]}
          setSelectedAddress={(e, newValue) =>
            handleChangeExposureDataAndFlightsField(
              fieldsNames.address,
              newValue
            )
          }
        />
      </FormRowWithInput>

      <PlacesTypesAndSubTypes
        required
        placeType={exposureAndFlightsData[fieldsNames.placeType]}
        placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
        onPlaceTypeChange={(value) =>
          handleChangeExposureDataAndFlightsField(fieldsNames.placeType, value)
        }
        onPlaceSubTypeChange={(value) =>
          handleChangeExposureDataAndFlightsField(
            fieldsNames.placeSubType,
            value
          )
        }
      />
    </Grid>
  );
};

export default ExposureForm;
