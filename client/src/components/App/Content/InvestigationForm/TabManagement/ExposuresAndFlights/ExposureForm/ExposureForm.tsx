import React from 'react';
import { Grid } from '@material-ui/core';
import useFormStyles from 'styles/formStyles';
import { format } from 'date-fns';

import DatePick from 'commons/DatePick/DatePick';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import LocationInput from 'commons/LocationInputField/LocationInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';
import { dateFormatForDatePicker } from 'Utils/displayUtils';

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
          <CircleTextField
            required
            value={exposureAndFlightsData[fieldsNames.firstName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(fieldsNames.firstName, e.target.value)
            }
            placeholder="שם פרטי"
          />
          <CircleTextField
            required
            value={exposureAndFlightsData[fieldsNames.lastName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(fieldsNames.lastName, e.target.value)
            }
            placeholder="שם משפחה"
          />
        </>
      </FormRowWithInput>

      <FormRowWithInput fieldName="תאריך החשיפה:">
        <DatePick
          type="date"
          value={exposureAndFlightsData[fieldsNames.date] ? format(new Date(exposureAndFlightsData[fieldsNames.date]), dateFormatForDatePicker) : dateFormatForDatePicker}
          onChange={(e) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.date, new Date(e.target.value))
          }
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="כתובת החשיפה:">
        <LocationInput
          selectedAddress={exposureAndFlightsData[fieldsNames.address]}
          setSelectedAddress={(e, newValue) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.address, newValue)} />
      </FormRowWithInput>

      <PlacesTypesAndSubTypes
        required
        placeType={exposureAndFlightsData[fieldsNames.placeType]}
        placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
        onPlaceTypeChange={(value) => handleChangeExposureDataAndFlightsField(fieldsNames.placeType, value)}
        onPlaceSubTypeChange={(value) => handleChangeExposureDataAndFlightsField(fieldsNames.placeSubType, value)}
      />
    </Grid>
  );
};

export default ExposureForm;
