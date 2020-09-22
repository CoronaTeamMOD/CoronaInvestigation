import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { Grid, TextField, Typography } from "@material-ui/core";

import DatePick from "commons/DatePick/DatePick";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import LocationInput from "commons/LocationInputField/LocationInput";
import PlacesTypesAndSubTypes from "commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes";
import useFormStyles from "styles/formStyles";

import { fieldsNames } from "../hooks/useExposuresAndFlightsSaving";

const schema = yup.object().shape({
  [fieldsNames.firstName]: yup.string().required('שם פרטי הוא שדה חובה'),
  [fieldsNames.lastName]: yup.string().required('שם משפחה הוא שדה חובה'),
  [fieldsNames.address]: yup.string().required('כתובת היא שדה חובה'),
});

const ExposureForm = (props: any) => {
  const {
    exposureAndFlightsData,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();
  const { register, handleSubmit, watch, errors, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  console.log(errors);

  return (
    <Grid className={classes.form} container justify="flex-start">
      <form id='my-form'>
        <FormRowWithInput fieldName="שם החולה:">
          <>
            <TextField
              name={fieldsNames.firstName}
              inputRef={register}
              error={errors[fieldsNames.firstName]}
              label={errors[fieldsNames.firstName]?.message}
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
              name={fieldsNames.lastName}
              inputRef={register}
              error={errors[fieldsNames.lastName]}
              label={errors[fieldsNames.lastName]?.message}
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

        <FormRowWithInput fieldName="כתובת החשיפה:">
            <LocationInput
              inputRef={register}
              label={errors[fieldsNames.address]?.message}
              error={errors[fieldsNames.address]}
              name={fieldsNames.address}
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
            handleChangeExposureDataAndFlightsField(
              fieldsNames.placeType,
              value
            )
          }
          onPlaceSubTypeChange={(value) =>
            handleChangeExposureDataAndFlightsField(
              fieldsNames.placeSubType,
              value
            )
          }
        />
      </form>
    </Grid>
  );
};

export default ExposureForm;
