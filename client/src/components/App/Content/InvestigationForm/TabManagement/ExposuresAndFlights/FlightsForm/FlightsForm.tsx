import React from 'react';
import {Grid} from '@material-ui/core';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import DatePick from 'commons/DatePick/DatePick';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import AirportInput from './AirportInput/AirportInput';
import useFormStyles from 'styles/formStyles';

export interface Country {
    id: string | '';
    name: string | '';
}

export interface City {
    id: string | '';
    name: string | '';
    country: Country;
}

export interface Airport {
    name: string | '';
    city: City;
}

const FlightsForm = () => {
    const classes = useFormStyles();
    const [fromAirport, setFromAirport] = React.useState<Airport | null>(null);
    const [toAirport, setToAirport] = React.useState<Airport | null>(null);
    const [airline, setAirline] = React.useState<string | null>('');
    const [flightNumber, setFlightNumber] = React.useState<string | null>('');
    const [flightStartDate, setFlightStartDate] = React.useState<string | null>('');
    const [flightEndDate, setFlightEndDate] = React.useState<string | null>('');

    const handleFlightNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => setFlightNumber(event.target.value);
    const handleAirlineInput = (event: React.ChangeEvent<HTMLInputElement>) => setAirline(event.target.value);
    const handleStartDateInput = (event: React.ChangeEvent<HTMLInputElement>) => setFlightStartDate(event.target.value);
    const handleEndDateInput = (event: React.ChangeEvent<HTMLInputElement>) => setFlightEndDate(event.target.value);

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='טיסה הלוך:'>
                <AirportInput airport={fromAirport} setAirport={setFromAirport}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='טיסה חזור:'>
                <AirportInput airport={toAirport} setAirport={setToAirport}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='תאריך טיסה:'>
                <div className={classes.rowDiv}>
                    <b>מתאריך</b>
                    <DatePick value={flightStartDate} onChange={handleStartDateInput} datePickerType='date'/>
                    <b>עד תאריך</b>
                    <DatePick value={flightEndDate} onChange={handleEndDateInput} datePickerType='date'/>
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