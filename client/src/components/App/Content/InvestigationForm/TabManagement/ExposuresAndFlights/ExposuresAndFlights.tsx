import React, { useState, useEffect } from "react";
import { Collapse, Divider, Typography } from "@material-ui/core";
import Toggle from "commons/Toggle/Toggle";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import FlightsForm from "./FlightsForm/FlightsForm";
import ExposureForm from "./ExposureForm/ExposureForm";
import useFormStyles from "styles/formStyles";
import useStyles from "./ExposuresAndFlightsStyles";
// import {ExposureDetails, ExposuresContextProvider} from "commons/Contexts/ExposuresAndFlights";
import { GoogleApiPlace } from "commons/LocationInputField/LocationInput";
import PlaceType from "models/PlaceType";
// import {ExposuresContextProvider, exposuresContext} from "Contexts/ExposuresAndFlights";

import ExposureData from "models/ExposureData";
import FlightData from "models/FlightData";
import axios from "Utils/axios";
import { useSelector } from "react-redux";
import StoreStateType from "redux/storeStateType";

const fieldsNames = {
  wasConfirmedExposure: "wasConfirmedExposure",
  firstName: "exposureFirstName",
  lastName: "exposureLastName",
  date: "exposureDate",
  address: "exposureAddress",
  placeType: "placeTypeByExposurePlaceType",
  placeSubType: "placeSubTypeByExposurePlaceSubType",
  wasAbroad: "wasAbroad",
  destinationCountry: "countryByFlightDestinationCountry",
  destinationCity: "flightDestinationCity",
  destinationAirport: "flightDestinationAirport",
  originCountry: "countryByFlightOriginCountry",
  originCity: "flightOriginCity",
  originAirport: "flightOriginAirport",
  flightStartDate: "flightStartDate",
  flightEndDate: "flightEndDate",
  airline: "airline",
  flightNumber: "flightNum",
};

const defaultExposureAndFlightsData: any = {
  [fieldsNames.wasConfirmedExposure]: false,
  [fieldsNames.firstName]: "",
  [fieldsNames.lastName]: "",
  [fieldsNames.date]: undefined,
  [fieldsNames.address]: "", // To be changed once google api is integrated
  [fieldsNames.placeType]: "",
  [fieldsNames.placeSubType] : "",
  [fieldsNames.wasAbroad]: false,
  [fieldsNames.destinationCountry]: "",
  [fieldsNames.destinationCity]: "",
  [fieldsNames.destinationAirport]: "",
  [fieldsNames.originCountry]: "",
  [fieldsNames.originCity]: "",
  [fieldsNames.originAirport]: "",
  [fieldsNames.flightStartDate]: undefined,
  [fieldsNames.flightEndDate]: undefined,
  [fieldsNames.airline]: "",
  [fieldsNames.flightNumber]: "",
};

const ExposuresAndFlights = () => {
  const [exposureAndFlightsData, setExposureAndFlightsData] = useState(defaultExposureAndFlightsData);

  const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

  const { fieldName } = useFormStyles();
  const classes = useStyles();

  useEffect(() => {
    axios
      .get("/exposure/" + investigationId)
      .then((result: any) => {
        const data = result.data.data.allExposures.nodes[0];
        if (data) {
          setExposureAndFlightsData(data);
        }
      })
      .catch((err) => console.log(err));
  }, [investigationId]);

  const handleChangeExposureDataAndFlightsField = (fieldName: string, value: any) => {
    setExposureAndFlightsData({
      ...exposureAndFlightsData,
      [fieldName]: value,
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
            value={exposureAndFlightsData[fieldsNames.wasConfirmedExposure]}
            onChange={() => {
              handleChangeExposureDataAndFlightsField(
                fieldsNames.wasConfirmedExposure,
                !exposureAndFlightsData[fieldsNames.wasConfirmedExposure]
              );
            }}
          />
        </FormRowWithInput>

        <Collapse
          in={exposureAndFlightsData[fieldsNames.wasConfirmedExposure]}
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
          <Toggle
            value={exposureAndFlightsData[fieldsNames.wasAbroad]}
            onChange={() => {
              handleChangeExposureDataAndFlightsField(
                fieldsNames.wasAbroad,
                !exposureAndFlightsData[fieldsNames.wasAbroad]
              );
            }}
          />
        </FormRowWithInput>

        <Collapse
          in={exposureAndFlightsData[fieldsNames.wasAbroad]}
          className={classes.additionalInformationForm}
        >
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
