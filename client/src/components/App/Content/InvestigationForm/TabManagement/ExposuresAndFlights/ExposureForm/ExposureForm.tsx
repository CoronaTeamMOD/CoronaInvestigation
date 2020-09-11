import { format } from "date-fns";
import { Grid } from "@material-ui/core";
import React from "react";

import useFormStyles from "styles/formStyles";
import DatePick from "commons/DatePick/DatePick";
import CircleSelect from "commons/CircleSelect/CircleSelect";
import { dateFormatForDatePicker } from "Utils/displayUtils";
import CircleTextField from "commons/CircleTextField/CircleTextField";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import LocationInput, {GoogleApiPlace} from 'commons/LocationInputField/LocationInput';

const ExposureForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();

  const placeTypeOptions = [
    { id: 1, name: "מקום ציבורי" },
    { id: 2, name: "מקום דת" },
    { id: 3, name: "מקום מקומי" },
  ];

  function formattedDate(date: Date | undefined) {
    return date ? format(date, "yyyy-MM-dd") : "yyyy-MM-dd";
  }

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
            handleChangeExposureDataAndFlightsField(fieldsNames.address, newValue)}/>
      </FormRowWithInput>

      <FormRowWithInput fieldName="סוג מקום החשיפה:">
        <CircleSelect
          value={exposureAndFlightsData[fieldsNames.placeType] ? exposureAndFlightsData[fieldsNames.placeType].id : 0 }
          isNameUnique={false}
          options={placeTypeOptions}
          onChange={(e) => {
            handleChangeExposureDataAndFlightsField(
              fieldsNames.placeType,
              placeTypeOptions.find((option) => option.id === e.target.value)
            );
          }}
        />
      </FormRowWithInput>
    </Grid>
  );
};

export default ExposureForm;
