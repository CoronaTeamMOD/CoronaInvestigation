import React from "react";
import { Collapse, Divider, Typography } from "@material-ui/core";

import Toggle from "commons/Toggle/Toggle";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
// import {ExposuresContextProvider, exposuresContext} from "Contexts/ExposuresAndFlights";

import useFormStyles from "styles/formStyles";
import FlightsForm from "./FlightsForm/FlightsForm";
import useStyles from "./ExposuresAndFlightsStyles";
import ExposureForm from "./ExposureForm/ExposureForm";
import ExposureData from "models/ExposureData";
import FlightData from "models/FlightData";

const fieldsNames = {
  firstName: "firstName",
  lastName: "lastName",
  date: "date",
  address: "address",
  placeType: "placeType",
  destinationCountry: "destinationCountry",
  destinationCity: "destinationCity",
  destinationAirport: "destinationAirport",
  originCountry: "originCountry",
  originCity: "originCity",
  originAirport: "originAirport",
  flightStartDate: "flightStartDate",
  flightEndDate: "flightEndDate",
  airline: "airline",
  flightNumber: "flightNum",
};

const defaultExposureAndFlightsData: any = {
  [fieldsNames.firstName]: '',
  [fieldsNames.lastName]: '',
  [fieldsNames.date]: undefined,
  [fieldsNames.address]: '', // To be changed once google api is integrated
  [fieldsNames.placeType]: { id: 0, name: '' },
  [fieldsNames.destinationCountry]: '',
  [fieldsNames.destinationCity]: '',
  [fieldsNames.destinationAirport]: '',
  [fieldsNames.originCountry]: '',
  [fieldsNames.originCity]: '',
  [fieldsNames.originAirport]: '',
  [fieldsNames.flightStartDate]: undefined,
  [fieldsNames.flightEndDate]: undefined,
  [fieldsNames.airline]: '',
  [fieldsNames.flightNumber]: '',
};

const ExposuresAndFlights = () => {
  const [exposureAndFlightsData, setExposureAndFlightsData] = React.useState<ExposureData & FlightData>
                                                              (defaultExposureAndFlightsData);
  const [isVerifiedExposure, setIsVerifiedExposure] = React.useState<boolean>(false);
  const [wasAbroad, setWasAbroad] = React.useState<boolean>(false);

  const { fieldName } = useFormStyles();
  const classes = useStyles();

  const handleChangeExposureDataAndFlightsField = (event: any, value: any) => {
    setExposureAndFlightsData({
      ...exposureAndFlightsData,
      [event.target.name]: value,
    });
  };

  return (
    <>
      <div className={classes.subForm}>
        <Typography variant="caption" className={fieldName}>
          חשיפה אפשרית
        </Typography>

        <FormRowWithInput fieldName="האם היה מגע ידוע עם חולה מאומת?">
          <Toggle
            value={isVerifiedExposure}
            onChange={() => setIsVerifiedExposure(!isVerifiedExposure)}
          />
        </FormRowWithInput>

        <Collapse
          in={isVerifiedExposure}
          className={classes.additionalInformationForm}
        >
          <ExposureForm
            exposureAndFlightsData={exposureAndFlightsData}
            fieldsNames={fieldsNames}
            handleChangeExposureDataAndFlightsField={
              handleChangeExposureDataAndFlightsField
            }
          />
        </Collapse>
      </div>

      <Divider />

      <div className={classes.subForm}>
        <Typography variant="caption" className={fieldName}>
          חזרה מחו״ל
        </Typography>

        <FormRowWithInput fieldName="האם חזר מחו״ל?">
          <Toggle value={wasAbroad} onChange={() => setWasAbroad(!wasAbroad)} />
        </FormRowWithInput>

        <Collapse in={wasAbroad} className={classes.additionalInformationForm}>
          <FlightsForm
            exposureAndFlightsData={exposureAndFlightsData}
            fieldsNames={fieldsNames}
            handleChangeExposureDataAndFlightsField={
              handleChangeExposureDataAndFlightsField
            }
          />
        </Collapse>
      </div>
    </>
  );
};

export default ExposuresAndFlights;
