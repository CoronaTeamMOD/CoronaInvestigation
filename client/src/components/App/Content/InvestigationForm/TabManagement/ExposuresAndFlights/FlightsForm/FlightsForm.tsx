import React from "react";
import { Grid, Typography } from "@material-ui/core";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import DatePick from "commons/DatePick/DatePick";
import CircleTextField from "commons/CircleTextField/CircleTextField";
import useFormStyles from "styles/formStyles";
// import AirportInput from "./AirportInput/AirportInput";

const FlightsForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();


  return (
    <Grid className={classes.form} container justify="flex-start">
      {/* <FormRowWithInput fieldName="יעד:">
        <AirportInput airport={fromAirport} setAirport={setFromAirport} />
      </FormRowWithInput>

      <FormRowWithInput fieldName="מוצא:">
        <AirportInput airport={toAirport} setAirport={setToAirport} />
      </FormRowWithInput> */}

      <FormRowWithInput fieldName="תאריך טיסה:">
        <div
         className={classes.formRow}
         >
          <Typography variant="caption">מתאריך</Typography>
          <DatePick
            type="date"
            value={exposureAndFlightsData[fieldsNames.flightStartDate]}
            onChange={e =>
              handleChangeExposureDataAndFlightsField(fieldsNames.flightStartDate, e.target.value)
            }
          />
          <Typography variant="caption">עד תאריך</Typography>
          <DatePick
            type="date"
            value={exposureAndFlightsData[fieldsNames.flightEndDate]}
            onChange={e =>
                handleChangeExposureDataAndFlightsField(fieldsNames.flightEndDate, e.target.value)
            }
          />
        </div>
      </FormRowWithInput>

      <FormRowWithInput fieldName="חברת תעופה:">
        <CircleTextField
          value={exposureAndFlightsData[fieldsNames.airline]}
          onChange={e =>
            handleChangeExposureDataAndFlightsField(fieldsNames.airline, e.target.value)
          }
          placeholder="הזן חברת תעופה"
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="מספר טיסה:">
        <CircleTextField
          value={exposureAndFlightsData[fieldsNames.flightNumber]}
          onChange={e =>
            handleChangeExposureDataAndFlightsField(fieldsNames.flightNumber, e.target.value)
          }          
          placeholder="הזן מספר טיסה"
        />
      </FormRowWithInput>
    </Grid>
  );
};

export default FlightsForm;
