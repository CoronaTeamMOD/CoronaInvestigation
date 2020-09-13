import React from "react";
import { Grid } from "@material-ui/core";
import useFormStyles from "styles/formStyles";
import DatePick from "commons/DatePick/DatePick";
import CircleTextField from "commons/CircleTextField/CircleTextField";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import LocationInput, {GoogleApiPlace} from 'commons/LocationInputField/LocationInput';
import PlacesTypesAndSubTypes from "commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes";

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
            value={exposureAndFlightsData[fieldsNames.firstName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(fieldsNames.firstName, e.target.value)
            }
            placeholder="שם פרטי..."
          />
          <CircleTextField
            value={exposureAndFlightsData[fieldsNames.lastName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(fieldsNames.lastName, e.target.value)
            }
            placeholder="שם משפחה..."
          />
        </>
      </FormRowWithInput>

      <FormRowWithInput fieldName="תאריך החשיפה:">
        <DatePick
          type="date"
          value={exposureAndFlightsData[fieldsNames.date]}
          onChange={(e) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.date, e.target.value)
          }
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="כתובת החשיפה:">
      <LocationInput 
          selectedAddress={exposureAndFlightsData[fieldsNames.address] as (GoogleApiPlace | null)} 
          setSelectedAddress={(e, newValue) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.address, newValue?.description)}/>
      </FormRowWithInput>
      
      <PlacesTypesAndSubTypes
        placeType={exposureAndFlightsData[fieldsNames.placeType]}
        placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
        onPlaceTypeChange={(value) => handleChangeExposureDataAndFlightsField(fieldsNames.placeType, value)}
        onPlaceSubTypeChange={(value) => handleChangeExposureDataAndFlightsField(fieldsNames.placeSubType, value)}
      />
    </Grid>
  );
};

export default ExposureForm;
