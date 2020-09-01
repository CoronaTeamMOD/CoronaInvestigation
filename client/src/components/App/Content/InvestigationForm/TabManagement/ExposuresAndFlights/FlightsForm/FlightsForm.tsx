import React from 'react';
import {Grid, TextField} from "@material-ui/core";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import DatePick from "commons/DatePick/DatePick";
import useFormStyles from 'styles/formStyles';
import {Airport} from "../ExposuresAndFlights";
import AirportInput from "./AirportInput/AirportInput";

const FlightsForm = () => {
    const classes = useFormStyles();
    const [fromAirport, setFromAirport] = React.useState<Airport|null>(null);
    const [toAirport, setToAirport] = React.useState<Airport|null>(null);
    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='טיסה הלוך:'>
                <AirportInput airport={fromAirport} setAirport={setFromAirport}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='טיסה חזור:'>
                <AirportInput airport={toAirport} setAirport={setToAirport}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='תאריך טיסה'>
                <div className={classes.rowDiv}>
                    <b>מתאריך</b>
                    <DatePick datePickerType='date'/>
                    <b>עד תאריך</b>
                    <DatePick datePickerType='date'/>
                </div>
            </FormRowWithInput>

            <FormRowWithInput fieldName='חברת תעופה'>
            <TextField
                InputProps={{classes:{ root: classes.roundedTextField }}}
                variant='outlined' placeholder='הזן חברת תעופה'/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='מספר טיסה'>
                <TextField
                    InputProps={{classes:{ root: classes.roundedTextField }}}
                    variant='outlined' placeholder='הזן מספר טיסה'/>
            </FormRowWithInput>
        </Grid>
    );
};

export default FlightsForm;