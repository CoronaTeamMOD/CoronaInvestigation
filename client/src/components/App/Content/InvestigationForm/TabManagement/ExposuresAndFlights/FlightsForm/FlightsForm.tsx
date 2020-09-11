import React from "react";
import { Grid, Typography } from "@material-ui/core";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import DatePick from "commons/DatePick/DatePick";
import CircleTextField from "commons/CircleTextField/CircleTextField";
import useFormStyles from "styles/formStyles";
// import { dateFormatForDatePicker } from "Utils/displayUtils";
// import { format } from "date-fns";
import AirportInput from "./AirportInput/AirportInput";

const FlightsForm = (props: any) => {
  const {
    exposureAndFlightsData,
    fieldsNames,
    handleChangeExposureDataAndFlightsField,
  } = props;

  const classes = useFormStyles();

  // const formattedDate = (date: Date | undefined) =>
  //   date ? format(date, dateFormatForDatePicker) : dateFormatForDatePicker;

  return (
    <Grid className={classes.form} container justify="flex-start">
      {/* <FormRowWithInput fieldName="יעד:">
        <AirportInput airport={fromAirport} setAirport={setFromAirport} />
      </FormRowWithInput> */}

      {/* <FormRowWithInput fieldName="מוצא:">
        <AirportInput airport={toAirport} setAirport={setToAirport} />
      </FormRowWithInput> */}

      <FormRowWithInput fieldName="תאריך טיסה:">
        <div
         className={classes.formRow}
         >
          <Typography variant="caption">מתאריך</Typography>
          <DatePick
            type="date"
            name={fieldsNames.flightStartDate}
            value={exposureAndFlightsData[fieldsNames.flightStartDate]}
            onChange={e =>
              handleChangeExposureDataAndFlightsField(e, e.target.value)
            }
          />
          <Typography variant="caption">עד תאריך</Typography>
          <DatePick
            type="date"
            name={fieldsNames.flightEndDate}
            value={exposureAndFlightsData[fieldsNames.flightEndDate]}
            onChange={e =>
                handleChangeExposureDataAndFlightsField(e, e.target.value)
            }
          />
        </div>
      </FormRowWithInput>

      <FormRowWithInput fieldName="חברת תעופה:">
        <CircleTextField
          name={fieldsNames.airline}
          value={exposureAndFlightsData[fieldsNames.airline]}
          onChange={e =>
            handleChangeExposureDataAndFlightsField(e, e.target.value)
          }
          placeholder="הזן חברת תעופה"
        />
      </FormRowWithInput>

      <FormRowWithInput fieldName="מספר טיסה:">
        <CircleTextField
          name={fieldsNames.flightNumber}
          value={exposureAndFlightsData[fieldsNames.flightNumber]}
          onChange={e =>
            handleChangeExposureDataAndFlightsField(e, e.target.value)
          }          
          placeholder="הזן מספר טיסה"
        />
      </FormRowWithInput>
    </Grid>
  );
};

export default FlightsForm;
