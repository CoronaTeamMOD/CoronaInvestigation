import React from 'react';
import {Collapse, Divider, Typography} from '@material-ui/core';

import PlaceType from "models/PlaceType";
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import {ExposureDetails, ExposuresContextProvider} from "Contexts/ExposuresAndFlights";

import useFormStyles from 'styles/formStyles';
import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from './ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';


const ExposuresAndFlights = () => {
    const [verifiedExposure, setHadVerifiedExposure] = React.useState<boolean>(false);
    const [hasBeenAbroad, setHasBeenAbroad] = React.useState<boolean>(false);

    const [exposingPersonFirstName, setExposingPersonFirstName] = React.useState<string>();
    const [exposingPersonLastName, setExposingPersonLastName] = React.useState<string>();
    const [exposureLocation, setExposureLocation] = React.useState<string>();
    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [placeType, setPlaceType] = React.useState<PlaceType>();

    const [fromAirport, setFromAirport] = React.useState<string>();
    const [toAirport, setToAirport] = React.useState<string>();
    const [airline, setAirline] = React.useState<string>();
    const [flightNumber, setFlightNumber] = React.useState<string>();
    const [departureDate, setDepartureDate] = React.useState<Date>();
    const [arrivalDate, setArrivalDate] = React.useState<Date>();

    const contextInitialData: ExposureDetails = {
        exposureData: {
            exposingPersonFirstName,
            exposingPersonLastName,
            exposureLocation,
            exposureDate,
            placeType,
            fromAirport,
            toAirport,
            airline,
            flightNumber,
            departureDate,
            arrivalDate,
        },
        setExposureData: {
            exposingPersonFirstName: setExposingPersonFirstName,
            exposingPersonLastName: setExposingPersonLastName,
            exposureLocation: setExposureLocation,
            exposureDate: setExposureDate,
            placeType: setPlaceType,
            fromAirport: setFromAirport,
            toAirport: setToAirport,
            airline: setAirline,
            flightNumber: setFlightNumber,
            departureDate: setDepartureDate,
            arrivalDate: setArrivalDate,
        }
    };

    const {fieldName} = useFormStyles();
    const classes = useStyles();

    const handleVerifiedExposureToggle = (event: React.MouseEvent<HTMLElement>, value: any) => setHadVerifiedExposure(value);
    const handleHasBeenAbroad = (event: React.MouseEvent<HTMLElement>, value: any) => setHasBeenAbroad(value);
    return (
        <ExposuresContextProvider value={contextInitialData}>
            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חשיפה אפשרית
                </Typography>

                <FormRowWithInput fieldName='האם היה מגע ידוע עם חולה מאומת?'>
                    <Toggle value={verifiedExposure} onChange={handleVerifiedExposureToggle}/>
                </FormRowWithInput>

                <Collapse in={verifiedExposure} className={classes.additionalInformationForm}>
                    <ExposureForm/>
                </Collapse>
            </div>

            <Divider/>

            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חזרה מחו״ל
                </Typography>

                <FormRowWithInput fieldName='האם חזר מחו״ל?'>
                    <Toggle value={hasBeenAbroad} onChange={handleHasBeenAbroad}/>
                </FormRowWithInput>

                <Collapse in={hasBeenAbroad} className={classes.additionalInformationForm}>
                    <FlightsForm/>
                </Collapse>
            </div>
        </ExposuresContextProvider>
    );
};

export default ExposuresAndFlights;