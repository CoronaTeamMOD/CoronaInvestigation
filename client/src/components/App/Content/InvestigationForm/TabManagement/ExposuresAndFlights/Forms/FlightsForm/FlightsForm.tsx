import React, { useEffect } from 'react';
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

const FlightsForm = (props: Props) => {

    const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index, onExposureDeleted } = props;

    const {control , errors, trigger} = useFormContext();
    const classes = useStyles();
    const formClasses = useFormStyles();

	const flightStartDateFieldName = `exposures[${index}].${fieldsNames.flightStartDate}`;
	const flightEndDateFieldName = `exposures[${index}].${fieldsNames.flightEndDate}`;

    const getDateLabel = (dateError : {message? : string , type? : string}, isStart: boolean) => {
		if(dateError) {
			if(dateError.type === 'typeError') {
				return 'תאריך לא ולידי'
			}
			return dateError.message;
		}
		return (isStart ? startDateLabel : endDateLabel)
	};

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
					<IconButton onClick={onExposureDeleted}>
							<Delete />
					</IconButton>
                </Grid>
            </Grid>

			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11}>
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
                <Grid item xs={11}>
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
													trigger([flightStartDateFieldName, flightEndDateFieldName])
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
													trigger([flightStartDateFieldName, flightEndDateFieldName])
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
                <Grid item xs={11}>
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
                <Grid item xs={11}>
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

interface Props {
	fieldsNames: any;	
	key: string;
	exposureAndFlightsData: any;
	index: number;
	handleChangeExposureDataAndFlightsField: (fieldName: string, value: any) => void;
	onExposureDeleted: () => void;
};

export default FlightsForm;