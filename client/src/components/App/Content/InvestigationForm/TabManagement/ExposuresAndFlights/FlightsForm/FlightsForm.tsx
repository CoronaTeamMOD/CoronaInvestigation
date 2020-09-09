import React, {useContext} from 'react';
import {Grid, Typography} from '@material-ui/core';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import DatePick from 'commons/DatePick/DatePick';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import AirportInput from './AirportInput/AirportInput';
import useFormStyles from 'styles/formStyles';
import {exposuresContext} from "commons/Contexts/ExposuresAndFlights";
import {format} from "date-fns";

const FlightsForm = () => {
    const classes = useFormStyles();
    const {exposureData, setExposureData} = useContext(exposuresContext);
    const {fromAirport, toAirport, departureDate, arrivalDate, airline,flightNumber} = exposureData;
    const {fromAirport: setFromAirport, toAirport: setToAirport, departureDate: setDepartureDate,
        arrivalDate: setArrivalDate, airline: setAirline, flightNumber:setFlightNumber} = setExposureData;

    const handleFlightNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => setFlightNumber(event.target.value);
    const handleAirlineInput = (event: React.ChangeEvent<HTMLInputElement>) => setAirline(event.target.value);
    const handleStartDateInput = (event: React.ChangeEvent<HTMLInputElement>) => setDepartureDate(new Date(event.target.value));
    const handleEndDateInput = (event: React.ChangeEvent<HTMLInputElement>) => setArrivalDate(new Date(event.target.value));

    const dateFormat = 'yyyy-MM-dd';
    const formattedDate = (date: Date | undefined) => date ? format(date, dateFormat) : dateFormat;

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='טיסה הלוך:'>
                <AirportInput airport={fromAirport} setAirport={setFromAirport}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='טיסה חזור:'>
                <AirportInput airport={toAirport} setAirport={setToAirport}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='תאריך טיסה:'>
                <div className={classes.formRow}>
                    <Typography variant='caption'>מתאריך</Typography>
                    <DatePick value={formattedDate(departureDate)} onChange={handleStartDateInput} type='date'/>
                    <Typography variant='caption'>עד תאריך</Typography>
                    <DatePick value={formattedDate(arrivalDate)} onChange={handleEndDateInput} type='date'/>
                </div>
            </FormRowWithInput>

            <FormRowWithInput fieldName='חברת תעופה:'>
                <CircleTextField value={airline} onChange={handleAirlineInput}
                                 placeholder='הזן חברת תעופה'/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='מספר טיסה:'>
                <CircleTextField value={flightNumber} onChange={handleFlightNumberInput}
                                 placeholder='הזן מספר טיסה'/>
            </FormRowWithInput>
        </Grid>
    );
};

export default FlightsForm;