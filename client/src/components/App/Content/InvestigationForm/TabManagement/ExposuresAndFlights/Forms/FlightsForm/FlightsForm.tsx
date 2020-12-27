import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Controller , useFormContext } from 'react-hook-form';

import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import AirportInput from './AirportInput/AirportInput';


const FlightsForm = (props: any) => {
  const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index } = props;

  const {control , errors} = useFormContext();

  const classes = useFormStyles();

  const getDateLabel = (dateError : {message? : string , type? : string}) => {
		if(dateError) {
			if(dateError.type === "typeError") {
				return 'תאריך לא ולידי'
			}
			return dateError.message;
		}
		return 'תאריך'
	}

  const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
  const startDateError = currentErrors ? currentErrors.flightStartDate : undefined;
  const endDateError = currentErrors ? currentErrors.flightEndDate : undefined;

  return (
		<Grid className={classes.form} container justify='flex-start'>
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

			<FormRowWithInput fieldName='תאריך טיסה:'>
				<div className={classes.inputRow}>
					<Typography variant='caption'>מתאריך</Typography>
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
									labelText={getDateLabel(startDateError)}
									error={Boolean(startDateError)}
									onChange={(newDate: Date) => {
										props.onChange(newDate);
									}}
								/>
							);
						}}
					/>

					<Typography variant='caption'>עד תאריך</Typography>
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
									labelText={getDateLabel(endDateError)}
									error={Boolean(endDateError)}
									onChange={(newDate: Date) => {
										props.onChange(newDate);
									}}
								/>
							);
						}}
					/>
				</div>
			</FormRowWithInput>

			<FormRowWithInput fieldName='חברת תעופה:'>
				<Controller
					control={control}
					name={`exposures[${index}].${fieldsNames.airline}`}
					defaultValue={exposureAndFlightsData[fieldsNames.airline]}
					render={(props) => {
						return (
							<AlphanumericTextField
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

			<FormRowWithInput fieldName='מספר טיסה:'>
				<Controller
					control={control}
					name={`exposures[${index}].${fieldsNames.flightNumber}`}
					defaultValue={exposureAndFlightsData[fieldsNames.flightNumber]}
					render={(props) => {
						return (
							<AlphanumericTextField
								{...props}
								testId='airlineNumber'
								onChange={(value) => {
									props.onChange(value);
									}
								}
								placeholder='הזן מספר טיסה'
							/>
						);
					}}
				/>
			</FormRowWithInput>
		</Grid>
  );
};

export default FlightsForm;
