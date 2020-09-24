import React from 'react';
import {useForm} from 'react-hook-form';
import { Grid } from '@material-ui/core';

import useStyles from './FlightFormStyles';
import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import AirportInput from './AirportInput/AirportInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

const FlightsForm = (props: any) => {
    const {
        exposureAndFlightsData,
        fieldsNames,
        handleChangeExposureDataAndFlightsField,
    } = props;
    const formClasses = useFormStyles();
    const classes = useStyles();
    const {errors, setError, clearErrors} = useForm();

    return (
        <Grid className={formClasses.form} container justify='flex-start'>
            <Grid item xs={2} className={classes.flightDetails}>
                <FormRowWithInput fieldName='יעד:'>
                    <AirportInput
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        country={exposureAndFlightsData[fieldsNames.destinationCountry]}
                        countryFieldName={fieldsNames.destinationCountry}
                        city={exposureAndFlightsData[fieldsNames.destinationCity]}
                        cityFieldName={fieldsNames.destinationCity}
                        airport={exposureAndFlightsData[fieldsNames.destinationAirport]}
                        airportFieldName={fieldsNames.destinationAirport}
                        handleChangeExposureDataAndFlightsField={
                            handleChangeExposureDataAndFlightsField
                        }
                    />
                </FormRowWithInput>
            </Grid>
            <Grid item xs={2} className={classes.flightDetails}>
                <FormRowWithInput fieldName='מוצא:'>
                    <AirportInput
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        country={exposureAndFlightsData[fieldsNames.originCountry]}
                        countryFieldName={fieldsNames.originCountry}
                        city={exposureAndFlightsData[fieldsNames.originCity]}
                        cityFieldName={fieldsNames.originCity}
                        airport={exposureAndFlightsData[fieldsNames.originAirport]}
                        airportFieldName={fieldsNames.originAirport}
                        handleChangeExposureDataAndFlightsField={
                            handleChangeExposureDataAndFlightsField
                        }
                    />
                </FormRowWithInput>
            </Grid>
            <FormRowWithInput fieldName='תאריך טיסה:'>
                <div className={classes.flightDates}>
                    <Grid item xs={2}>
                        <DatePick
                            required
                            labelText='מתאריך'
                            value={exposureAndFlightsData[fieldsNames.flightStartDate]}
                            onChange={(newDate: Date) =>
                                handleChangeExposureDataAndFlightsField(
                                    fieldsNames.flightStartDate,
                                    newDate
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.flightDetails}>
                        <DatePick
                            required
                            labelText='עד'
                            value={exposureAndFlightsData[fieldsNames.flightEndDate]}
                            onChange={(newDate: Date) =>
                                handleChangeExposureDataAndFlightsField(
                                    fieldsNames.flightEndDate,
                                    newDate
                                )
                            }
                        />
                    </Grid>
                </div>
            </FormRowWithInput>
            <Grid item xs={2} className={classes.flightDetails}>
                <FormRowWithInput fieldName='חברת תעופה:'>
                    <AlphanumericTextField
                        className={classes.additionalFlightDetails}
                        name={fieldsNames.airline}
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        required
                        value={exposureAndFlightsData[fieldsNames.airline]}
                        onChange={(value) =>
                            handleChangeExposureDataAndFlightsField(
                                fieldsNames.airline,
                                value
                            )
                        }
                        placeholder='הזן חברת תעופה'
                    />
                </FormRowWithInput>
            </Grid>
            <Grid item xs={2} className={classes.flightDetails}>
                <FormRowWithInput fieldName='מספר טיסה:'>
                    <AlphanumericTextField
                        className={classes.additionalFlightDetails}
                        name={fieldsNames.flightNumber}
                        required
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        value={exposureAndFlightsData[fieldsNames.flightNumber]}
                        onChange={(value) =>
                            handleChangeExposureDataAndFlightsField(
                                fieldsNames.flightNumber,
                                value
                            )
                        }
                        placeholder='הזן מספר טיסה'
                    />
                </FormRowWithInput>
            </Grid>
        </Grid>
    );
};

export default FlightsForm;