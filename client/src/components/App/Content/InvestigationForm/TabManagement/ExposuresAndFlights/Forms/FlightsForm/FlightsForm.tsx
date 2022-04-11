import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, IconButton, TextField } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import { invalidDateText } from 'commons/Schema/messages';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from './FlightFormStyles';
import UseFlightForm from './useFlightForm';
import AirportInput from './AirportInput/AirportInput';
import FlightNumberCodes from 'models/enums/FlightNumberCodes';

const startDateLabel = '*מתאריך';
const endDateLabel = '*עד תאריך';
const airlineLabel = 'חברת תעופה';
const flightNumLabel = 'מספר טיסה';
const otherflightNumLabel = 'מספר טיסה אחר';
const flightSeatNumLabel = 'מספר מושב';
const otherAirlineLabel = 'חברת תעופה אחרת'
const otherFlightNum = 'OTHER';

const FlightsForm = (props: Props) => {
	const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index, onExposureDeleted, isViewMode } = props;

	const [flights, setFlights] = useState<string[]>([]);

	const airlines = useSelector<StoreStateType, Map<string, string>>(state => state.airlines);
	const formattedAirlines = Array.from(airlines).map(airline => { return { id: airline[0], displayName: airline[1] } })

	const { setFlightsByAirlineID } = UseFlightForm({ setFlights });

	const { control, errors, trigger, watch, setValue } = useFormContext();
	const classes = useStyles();
	const formClasses = useFormStyles();

	const flightStartDateFieldName = `exposures[${index}].${fieldsNames.flightStartDate}`;
	const flightEndDateFieldName = `exposures[${index}].${fieldsNames.flightEndDate}`;
	const airlineFieldName = `exposures[${index}].${fieldsNames.airline}`;

	const watchFlightStartDate = watch(flightStartDateFieldName);
	const watchFlightEndDate = watch(flightEndDateFieldName);
	const watchAirline = watch(airlineFieldName);
	const watchFlightNumber = watch(`exposures[${index}].${fieldsNames.flightNumber}`);

	useEffect(() => {
		if (watchAirline) {
			const airlineId = watchAirline.id
				? watchAirline.id
				: getAirlineByDisplayName(watchAirline)?.id
			airlineId && setFlightsByAirlineID(airlineId);
		}
	}, [watchAirline]);

	useEffect(() => {
		trigger(flightStartDateFieldName);
		trigger(flightEndDateFieldName);
	}, [watchFlightStartDate, watchFlightEndDate]);

	const getDateLabel = (dateError: { message?: string, type?: string }, isStart: boolean) => {
		if (dateError) {
			if (dateError.type === 'typeError') {
				return invalidDateText;
			}
			return dateError.message;
		}
		return (isStart ? startDateLabel : endDateLabel)
	};

	const getAirlineByDisplayName = (displayName: string) => {
		return formattedAirlines.find(airline => airline.displayName === displayName);
	};

	const initFlightNumberData = () =>{
		setValue(`exposures[${index}].${fieldsNames.otherAirline}`,'');
		setValue(`exposures[${index}].${fieldsNames.flightNumber}`,undefined);
		setValue(`exposures[${index}].${fieldsNames.otherFlightNum}`,'');	
	}
	
	const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
	const startDateError = currentErrors ? currentErrors.flightStartDate : undefined;
	const endDateError = currentErrors ? currentErrors.flightEndDate : undefined;
	const airlineError = currentErrors ? currentErrors.airline : undefined;
	const flightNumError = currentErrors ? currentErrors[fieldsNames.flightNumber] : undefined;

	return (
		<Grid className={formClasses.form} container justify='flex-start'>
			<Grid container justify='space-between' xs={12}>
				<Grid item xs={11}>
					<FormRowWithInput testId='flightStartingPoint' fieldName='מוצא:'>
						<AirportInput
							country={exposureAndFlightsData[fieldsNames.originCountry]}
							countryFieldName={fieldsNames.originCountry}
							airport={exposureAndFlightsData[fieldsNames.originAirport]}
							airportFieldName={fieldsNames.originAirport}
							index={index}
							handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
							isViewMode={isViewMode}
						/>
					</FormRowWithInput>
				</Grid>
				<Grid item xs={1} alignItems='center' justify='flex-start'>
					<IconButton onClick={onExposureDeleted} disabled={isViewMode}>
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
							airport={exposureAndFlightsData[fieldsNames.destinationAirport]}
							airportFieldName={fieldsNames.destinationAirport}
							index={index}
							handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
							isViewMode={isViewMode}
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
												disabled={isViewMode}
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
												disabled={isViewMode}
											/>
										);
									}}
								/>
							</Grid>
						</Grid>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12} className={classes.airlineRow}>
				<Grid item container xs={11}>
					<FormRowWithInput fieldName='חברת תעופה:'>
						<>
							<Grid item xs={3}>
								<Controller
									control={control}
									name={airlineFieldName}
									defaultValue={exposureAndFlightsData[fieldsNames.airline]}
									render={(props) => {
										return (
											<Autocomplete
												options={formattedAirlines}
												getOptionLabel={(option) => option.displayName}
												value={props.value?.id ? props.value : getAirlineByDisplayName(props.value)}
												onChange={(event, newAirline) => {
													handleChangeExposureDataAndFlightsField(fieldsNames.airline, newAirline?.displayName ?? '');
													props.onChange(newAirline ?? null);
													if (newAirline){
														initFlightNumberData();
													}
												}}
												renderInput={(params) =>
													<TextField
														error={Boolean(airlineError)}
														label={airlineError ? airlineError.message : airlineLabel}
														{...params}
														placeholder={airlineLabel}
													/>}
												disabled={isViewMode}
											/>
										);
									}}
								/>
							</Grid>
							{watchAirline && (watchAirline.id == FlightNumberCodes.OTHER || watchAirline == 'אחר') &&
								<Grid item xs={3}>
									<Controller
										control={control}
										name={`exposures[${index}].${fieldsNames.otherAirline}`}
										render={(props) => {
											return (
												<TextField
													{...props}
													value={props.value}
													onChange={(value) => {
														props.onChange(value);
														handleChangeExposureDataAndFlightsField(fieldsNames.otherAirline, value);
													}}
													placeholder={otherAirlineLabel}
													label={`${otherAirlineLabel}*`}
													disabled={isViewMode}
												/>
											);
										}}
									/>
								</Grid>
							}
						</>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12} className={classes.airlineRow}>
				<Grid item container xs={11}>
					<FormRowWithInput fieldName='מספר טיסה:'>
						<>
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
													handleChangeExposureDataAndFlightsField(fieldsNames.flightNumber, data);
												}}
												renderInput={(params) =>
													<TextField
														error={Boolean(flightNumError)}
														label={flightNumError ? flightNumError.message : flightNumLabel}
														{...params}
														placeholder={flightNumLabel}
													/>
												}
												disabled={isViewMode}
											/>
										);
									}}
								/>
							</Grid>
							{watchFlightNumber == otherFlightNum &&
								<Grid item xs={3}>
									<Controller
										control={control}
										name={`exposures[${index}].${fieldsNames.otherFlightNum}`}
										render={(props) => {
											return (
												<TextField
													{...props}
													value={props.value}
													onChange={(value) => {
														props.onChange(value);
														handleChangeExposureDataAndFlightsField(fieldsNames.otherFlightNum, value);
													}}
													placeholder={otherflightNumLabel}
													label={`${otherflightNumLabel}*`}
													disabled={isViewMode}
												/>
											);
										}}
									/>
								</Grid>
							}
						</>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12} className={classes.airlineRow}>
				<Grid item container xs={11}>
					<FormRowWithInput fieldName={`${flightSeatNumLabel}:`}>
						<Grid item xs={3}>
							<Controller
								control={control}
								name={`exposures[${index}].${fieldsNames.flightSeatNum}`}
								defaultValue={exposureAndFlightsData[fieldsNames.flightSeatNum]}
								render={(props) => {
									return (
										<TextField
											{...props}
											onChange={(value) => {
												props.onChange(value);
												handleChangeExposureDataAndFlightsField(fieldsNames.flightSeatNum, value);
											}}
											placeholder={flightSeatNumLabel}
											label={flightSeatNumLabel}
											disabled={isViewMode}
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
	isViewMode?: boolean;
};

export default FlightsForm;