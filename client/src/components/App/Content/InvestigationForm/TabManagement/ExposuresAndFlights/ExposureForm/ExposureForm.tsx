import React from 'react';
import { Grid } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useFormStyles from 'styles/formStyles';
import { useForm } from 'react-hook-form';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import Map from "commons/Map/Map";

const ExposureForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();
  const { errors, setError, clearErrors } = useForm();

  return (
    <Grid className={classes.form} container justify="flex-start">
      <FormRowWithInput fieldName="שם החולה:">
        <>
          <AlphanumericTextField
            errors={errors}
            value={exposureAndFlightsData[fieldsNames.firstName]}
            onChange={(value : string) =>
              handleChangeExposureDataAndFlightsField(
                fieldsNames.firstName,
                value
              )
            }
            setError={setError}
            clearErrors={clearErrors}
            name={fieldsNames.firstName}
            placeholder="שם פרטי"
            label="שם פרטי"
          />
          <AlphanumericTextField
            errors={errors}
            value={exposureAndFlightsData[fieldsNames.lastName]}
            onChange={(value : string) =>
              handleChangeExposureDataAndFlightsField(
                fieldsNames.lastName,
                value
              )
            }
            name={fieldsNames.lastName}
            setError={setError}
            clearErrors={clearErrors}
            placeholder="שם משפחה"
            label="שם משפחה"
          />
        </>
      </FormRowWithInput>

      <FormRowWithInput fieldName="תאריך החשיפה:">
        <DatePick
          testId='exposureDate'
          labelText="תאריך"
          value={exposureAndFlightsData[fieldsNames.date]}
          onChange={(newDate: Date) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.date, newDate)
          }
        />
      </FormRowWithInput>

      <FormRowWithInput testId='exposureAddress' fieldName="כתובת החשיפה:">
          <Map required
               setSelectedAddress={(newAddress) => handleChangeExposureDataAndFlightsField(fieldsNames.address, newAddress)}
               selectedAddress={exposureAndFlightsData[fieldsNames.address]} />
      </FormRowWithInput>

      <PlacesTypesAndSubTypes
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
