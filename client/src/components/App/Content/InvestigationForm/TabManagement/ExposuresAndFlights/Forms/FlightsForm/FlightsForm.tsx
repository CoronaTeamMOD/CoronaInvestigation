import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Controller , useFormContext } from 'react-hook-form';
import { Grid, IconButton, TextField } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import { invalidDateText } from 'commons/Schema/messages';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AirelineTextField from 'commons/AirelineTextField/AirelineTextField';
import FlightNumberTextField from 'commons/FlightNumberTextField/FlightNumberTextField';

import useStyles from './FlightFormStyles';
import AirportInput from './AirportInput/AirportInput';
import StoreStateType from 'redux/storeStateType';
import UseFlightForm from './useFlightForm';

const startDateLabel = '*מתאריך';
const endDateLabel = '*עד תאריך';
const airlineLabel = 'חברת תעופה';
const flightNumLabel = 'מספר טיסה';

const FlightsForm = (props: Props) => {
	const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index, onExposureDeleted } = props;
    
	const [flights, setFlights] = useState<string[]>([]);
	
	const airlines = useSelector<StoreStateType, Map<number, string>>(state => state.airlines);
	const formattedAirlines = Array.from(airlines).map(airline => {return {id: airline[0] , displayName : airline[1]}})

	const { setFlightsByAirlineID } = UseFlightForm({setFlights});

	const {control , errors, trigger, watch} = useFormContext();
    const classes = useStyles();
    const formClasses = useFormStyles();

	const flightStartDateFieldName = `exposures[${index}].${fieldsNames.flightStartDate}`;
	const flightEndDateFieldName = `exposures[${index}].${fieldsNames.flightEndDate}`;

	const watchFlightStartDate = watch(flightStartDateFieldName);
    const watchFlightEndDate = watch(flightEndDateFieldName);

	React.useEffect(() => {
        trigger(flightStartDateFieldName);
        trigger(flightEndDateFieldName);
    }, [watchFlightStartDate, watchFlightEndDate]);

    const getDateLabel = (dateError : {message? : string , type? : string}, isStart: boolean) => {
		if(dateError) {
			if(dateError.type === 'typeError') {
				return invalidDateText;
			}
			return dateError.message;
		}
		return (isStart ? startDateLabel : endDateLabel)
	};

	const getAirlineByDisplayName = (displayName : string) => {
		return formattedAirlines.find(airline => airline.displayName === displayName);
	};

    const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
    const startDateError = currentErrors ? currentErrors.flightStartDate : undefined;
    const endDateError = currentErrors ? currentErrors.flightEndDate : undefined;
    const airlineError = currentErrors ? currentErrors.airline : undefined;


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
                <Grid item container xs={11}>
					<FormRowWithInput fieldName='חברת תעופה:'>
						<Grid item xs={3}>
							<Controller
								control={control}
								name={`exposures[${index}].${fieldsNames.airline}`}
								defaultValue={exposureAndFlightsData[fieldsNames.airline]}
								render={(props) => {
									return (
										<Autocomplete
											options={formattedAirlines}
											getOptionLabel={(option) => option.displayName }
											value={props.value?.id ? props.value : getAirlineByDisplayName(props.value)}
											onChange={(event, newAirline) => { 
												newAirline && setFlightsByAirlineID(newAirline.id);
												handleChangeExposureDataAndFlightsField(fieldsNames.airline, newAirline?.displayName ?? '');
												props.onChange(newAirline ?? null);
											}}
											renderInput={(params) => 
												<TextField
													error={Boolean(airlineError)}
													label={airlineError ? airlineError : airlineLabel}
													{...params}
													placeholder={airlineLabel}
												/>}
										/>
									);
								}}
							/>
						</Grid>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12}>
                <Grid item container xs={11}>
					<FormRowWithInput fieldName='מספר טיסה:'>
						<Grid item xs={3}>
							<Controller
								control={control}
								name={`exposures[${index}].${fieldsNames.flightNumber}`}
								defaultValue={exposureAndFlightsData[fieldsNames.flightNumber]}
								render={(props) => {
									return (
											<Autocomplete
												options={flights}
												value={props.value}
												onChange={(event, newFlight) => { 
													const data = newFlight ?? '';
													props.onChange(data);
													handleChangeExposureDataAndFlightsField(fieldsNames.flightNumber , data);
												}}
												renderInput={(params) => 
													<TextField
														error={Boolean(airlineError)}
														label={airlineError ? airlineError : flightNumLabel}
														{...params}
														placeholder={flightNumLabel}
													/>
												}
											/>
									);
								}}
							/>
						</Grid>
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