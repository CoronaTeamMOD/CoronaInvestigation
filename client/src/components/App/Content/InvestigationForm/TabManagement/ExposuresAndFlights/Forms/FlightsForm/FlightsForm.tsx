import React from 'react';
import { Delete } from '@material-ui/icons';
import { Grid, IconButton } from '@material-ui/core';
import { Controller , useFormContext } from 'react-hook-form';

import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AirelineTextField from 'commons/AirelineTextField/AirelineTextField';
import FlightNumberTextField from 'commons/FlightNumberTextField/FlightNumberTextField';

import useStyles from './FlightFormStyles';
import AirportInput from './AirportInput/AirportInput';

const startDateLabel = '*מתאריך';
const endDateLabel = '*עד תאריך';

const FlightsForm = (props: any) => {
  const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index } = props;

  const {control , errors} = useFormContext();

  const classes = useStyles();
  const formClasses = useFormStyles();

  const getDateLabel = (dateError : {message? : string , type? : string}, isStart: boolean) => {
		if(dateError) {
			if(dateError.type === 'typeError') {
				return 'תאריך לא ולידי'
			}
			return dateError.message;
		}
		return (isStart ? startDateLabel : endDateLabel)
	}

  const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
  const startDateError = currentErrors ? currentErrors.flightStartDate : undefined;
  const endDateError = currentErrors ? currentErrors.flightEndDate : undefined;

  return (
		<Grid className={formClasses.form} container justify='flex-start'>
		
			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11}>
					<FormRowWithInput testId='flightStartingPoint' fieldName='מוצא:'>
						<AirportInput
							country={exposureAndFlightsData[fieldsNames.originCountry]}
							countryFieldName={fieldsNames.originCountry}
							city={exposureAndFlightsData[fieldsNames.originCity]}
							cityFieldName={fieldsNames.originCity}
							airport={exposureAndFlightsData[fieldsNames.originAirport]}
							airportFieldName={fieldsNames.originAirport}
							index={index}
							handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
						/>
					</FormRowWithInput>
                </Grid>
                <Grid item xs={1} alignItems='center' justify='flex-start'>
					<IconButton onClick={()=>{}}>
							<Delete />
					</IconButton>
                </Grid>
            </Grid>

			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11} className={classes.deleteRow}>
					<FormRowWithInput testId='flightDestination' fieldName='יעד:'>
						<AirportInput
							country={exposureAndFlightsData[fieldsNames.destinationCountry]}
							countryFieldName={fieldsNames.destinationCountry}
							city={exposureAndFlightsData[fieldsNames.destinationCity]}
							cityFieldName={fieldsNames.destinationCity}
							airport={exposureAndFlightsData[fieldsNames.destinationAirport]}
							airportFieldName={fieldsNames.destinationAirport}
							index={index}
							handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
						/>
					</FormRowWithInput>
				</Grid>
			</Grid>
			
			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11} className={classes.deleteRow}>
					<FormRowWithInput fieldName='תאריך טיסה:'>
						<Grid className={classes.inputRow} item container xs={9} justify='flex-start' alignItems='center' spacing={1}>
							<Grid item>
								<Controller
									control={control}
									name={`exposures[${index}].${fieldsNames.flightStartDate}`}
									defaultValue={exposureAndFlightsData[fieldsNames.flightStartDate]}
									render={(props) => {
										return (
											<DatePick
												{...props}
												maxDateMessage={''}
												invalidDateMessage={''}
												maxDate={new Date()}
												testId='flightFromDate'
												labelText={getDateLabel(startDateError, true)}
												error={Boolean(startDateError)}
												onChange={(newDate: Date) => {
													props.onChange(newDate);
													handleChangeExposureDataAndFlightsField(fieldsNames.flightStartDate, newDate);
												}}
											/>
										);
									}}
								/>
							</Grid>
							<Grid item>
								<Controller
									control={control}
									name={`exposures[${index}].${fieldsNames.flightEndDate}`}
									defaultValue={exposureAndFlightsData[fieldsNames.flightEndDate]}
									render={(props) => {
										return (
											<DatePick
												{...props}
												maxDateMessage={''}
												invalidDateMessage={''}
												maxDate={new Date()}
												testId='flightToDate'
												labelText={getDateLabel(endDateError, false)}
												error={Boolean(endDateError)}
												onChange={(newDate: Date) => {
													props.onChange(newDate);
													handleChangeExposureDataAndFlightsField(fieldsNames.flightEndDate, newDate);
												}}
											/>
										);
									}}
								/>
							</Grid>
						</Grid>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11} className={classes.deleteRow}>
					<FormRowWithInput fieldName='חברת תעופה:'>
						<Controller
							control={control}
							name={`exposures[${index}].${fieldsNames.airline}`}
							defaultValue={exposureAndFlightsData[fieldsNames.airline]}
							render={(props) => {
								return (
									<AirelineTextField
										{...props}
										testId='airlineCompany'
										onChange={(value) => {
											props.onChange(value);
										}}
										placeholder='הזן חברת תעופה'
									/>
								);
							}}
						/>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11} className={classes.deleteRow}>
					<FormRowWithInput fieldName='מספר טיסה:'>
						<Controller
							control={control}
							name={`exposures[${index}].${fieldsNames.flightNumber}`}
							defaultValue={exposureAndFlightsData[fieldsNames.flightNumber]}
							render={(props) => {
								return (
									<FlightNumberTextField
										{...props}
										testId='airlineNumber'
										onChange={(value) => {
											props.onChange(value);
											handleChangeExposureDataAndFlightsField(fieldsNames.flightNumber, value);
										}}
										label='מספר טיסה*'
										placeholder='הזן מספר טיסה'
									/>
								);
							}}
						/>
					</FormRowWithInput>
				</Grid>
			</Grid>
		</Grid>
  );
};

export default FlightsForm;
