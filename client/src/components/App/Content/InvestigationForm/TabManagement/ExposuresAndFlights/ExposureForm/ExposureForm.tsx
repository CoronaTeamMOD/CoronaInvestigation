import { format } from "date-fns";
import { Grid } from "@material-ui/core";
import React from "react";

import useFormStyles from "styles/formStyles";
import DatePick from "commons/DatePick/DatePick";
import CircleSelect from "commons/CircleSelect/CircleSelect";
import { dateFormatForDatePicker } from "Utils/displayUtils";
import CircleTextField from "commons/CircleTextField/CircleTextField";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";

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
            name={fieldsNames.firstName}
            value={exposureAndFlightsData[fieldsNames.firstName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(e, e.target.value)
            }
            placeholder="שם פרטי..."
          />
          <CircleTextField
            name={fieldsNames.lastName}
            value={exposureAndFlightsData[fieldsNames.lastName]}
            onChange={(e) =>
              handleChangeExposureDataAndFlightsField(e, e.target.value)
            }
            placeholder="שם משפחה..."
          />
        </>
      </FormRowWithInput>

      <FormRowWithInput fieldName="תאריך החשיפה:">
        <DatePick
          type="date"
          name={fieldsNames.date}
          value={exposureAndFlightsData[fieldsNames.date]}
          onChange={(e) =>
            handleChangeExposureDataAndFlightsField(e, e.target.value)
          }
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="כתובת החשיפה:">
        <CircleTextField
          name={fieldsNames.address}
          value={exposureAndFlightsData[fieldsNames.address]}
          onChange={(e) =>
            handleChangeExposureDataAndFlightsField(e, e.target.value)
          }
          placeholder="הכנס שם..."
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="סוג מקום החשיפה:">
        <CircleSelect
          name={fieldsNames.placeType}
          value={exposureAndFlightsData[fieldsNames.placeType].id}
          isNameUnique={false}
          options={placeTypeOptions}
          onChange={(e) => {
            handleChangeExposureDataAndFlightsField(
              e,
              placeTypeOptions.find((option) => option.id === e.target.value)
            );
          }}
        />
      </FormRowWithInput>
    </Grid>
  );
};

export default ExposureForm;
