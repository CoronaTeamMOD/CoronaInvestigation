import React from 'react';
import { Collapse, Divider, Typography } from '@material-ui/core';
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import FlightsForm from './FlightsForm/FlightsForm';
import ExposureForm from './ExposureForm/ExposureForm';
import useFormStyles from 'styles/formStyles';
import useStyles from './ExposuresAndFlightsStyles';
import { ExposureDetails, ExposuresContextProvider } from "commons/Contexts/ExposuresAndFlights";
import { GoogleApiPlace } from "commons/LocationInputField/LocationInput";
import PlaceType from "models/PlaceType";


const ExposuresAndFlights = () => {
    const [verifiedExposure, setHadVerifiedExposure] = React.useState<boolean>(false);
    const [hasBeenAbroad, setHasBeenAbroad] = React.useState<boolean>(false);

    const [exposingPersonName, setExposingPersonName] = React.useState<string>();
    const [exposureLocation, setExposureLocation] = React.useState<GoogleApiPlace | null | undefined>(null);
    const [placeType, setPlaceType] = React.useState<PlaceType>();

    const [fromAirport, setFromAirport] = React.useState<string>();
    const [toAirport, setToAirport] = React.useState<string>();
    const [airline, setAirline] = React.useState<string>();
    const [flightNum, setFlightNumber] = React.useState<string>();
    const [departureDate, setDepartureDate] = React.useState<Date>();
    const [arrivalDate, setArrivalDate] = React.useState<Date>();

    const contextInitialData: ExposureDetails = {
        exposureData: {
            exposingPersonName,
            exposureLocation,
            placeType,
            fromAirport,
            toAirport,
            airline,
            flightNum,
            departureDate,
            arrivalDate,
        },
        setExposureData: {
            exposingPersonName: setExposingPersonName,
            exposureLocation: setExposureLocation,
            placeType: setPlaceType,
            fromAirport: setFromAirport,
            toAirport: setToAirport,
            airline: setAirline,
            flightNum: setFlightNumber,
            departureDate: setDepartureDate,
            arrivalDate: setArrivalDate,
        }
    };

    const { fieldName } = useFormStyles();
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
                    <Toggle value={verifiedExposure} onChange={handleVerifiedExposureToggle} test-id='knownExposure' />
                </FormRowWithInput>

                <Collapse in={verifiedExposure} className={classes.additionalInformationForm}>
                    <ExposureForm />
                </Collapse>
            </div>

            <Divider />

            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חזרה מחו״ל
                </Typography>

                <FormRowWithInput fieldName='האם חזר מחו״ל?'>
                    <Toggle value={hasBeenAbroad} onChange={handleHasBeenAbroad} test-id='wasPatientAbroad' />
                </FormRowWithInput>

                <Collapse in={hasBeenAbroad} className={classes.additionalInformationForm}>
                    <FlightsForm />
                </Collapse>
            </div>
        </ExposuresContextProvider>
    );
};

export default ExposuresAndFlights;