import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CircularProgress, Collapse, Grid, IconButton, MenuItem, Select, TextField } from '@material-ui/core';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import CovidPatient from 'models/CovidPatient';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import { invalidDateText } from 'commons/Schema/messages';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ExposureSearchTextField from './SearchCovidPatients/ExposureSearchTextField';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './ExposureFormStyles';
import useExposureForm from './useExposureForm';
import ExposureSourceOption from './ExposureSourceOption';
import queryByTypes from './SearchCovidPatients/queryByTypes';
import SearchByPersonalDetails from './SearchCovidPatients/SearchByPersonalDetails';
import PersonalDetailsQueryParams from 'models/ExposureForm/PersonalDetailsQueryParams';
import SearchByEpidemiologyNumber from './SearchCovidPatients/SearchByEpidemiologyNumber';

const ExposureForm = (props: Props) => {

	const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index, onExposureDeleted } = props;

	const classes = useStyles();
	const formClasses = useFormStyles();
	const { control, setValue, errors, trigger } = useFormContext();

	const [exposureSourceSearchString, setExposureSourceSearchString] = useState<string>('');
	const [isOptionalPatientsLoading, setOptionalPatientsLoading] = useState<boolean>(false);
	const [optionalCovidPatients, setOptionalCovidPatients] = useState<CovidPatient[]>([]);
	const [queryBy, setQueryBy] = useState<number>(0);
	const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

	const { fetchOptionalCovidPatients, selectedExposureSourceDisplay, fetchCovidPatientsByPersonalDetails, fetchCovidPatientsByEpidemiologyNumber } = useExposureForm({
		exposureAndFlightsData,
		exposureSourceSearchString,
		setOptionalPatientsLoading
	});

	const setOptionalCovidPatientsAsync = async () => {
		const optionalCovidPatients = await fetchOptionalCovidPatients();
		setOptionalCovidPatients(optionalCovidPatients);
	};

	useEffect(() => {
		if (Boolean(exposureAndFlightsData.exposureSource)) {
			setExposureSourceSearchString(selectedExposureSourceDisplay(exposureAndFlightsData.exposureSource));
		}
	}, [exposureAndFlightsData.exposureSource]);

	useEffect(() => {
		if(exposureSourceSearchString === '') {
			setOptionalCovidPatients([]);
		}
	}, [exposureSourceSearchString]);

	useEffect(() => {
		setValue(`exposures[${index}].${fieldsNames.placeType}`, exposureAndFlightsData[fieldsNames.placeType])
		setValue(`exposures[${index}].${fieldsNames.placeSubType}`, exposureAndFlightsData[fieldsNames.placeSubType])
	}, []);

	const getDateLabel = (dateError: { message?: string, type?: string }) => {
		if (dateError) {
			if (dateError.type === 'typeError') {
				return invalidDateText;
			}
			return dateError.message;
		}
		return 'תאריך'
	};

	const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
	const dateError = currentErrors ? currentErrors.exposureDate : undefined;

	const handlePersonalDetailsSearchButton = async (params : PersonalDetailsQueryParams) => {
		const optionalCovidPatients = await fetchCovidPatientsByPersonalDetails(params);
		optionalCovidPatients && setOptionalCovidPatients(optionalCovidPatients);
	};

	const handleEpidemiologyNumberSearchButton = async (query : string) => {
		const optionalCovidPatients = await fetchCovidPatientsByEpidemiologyNumber(query);
		optionalCovidPatients && setOptionalCovidPatients(optionalCovidPatients);
	};

	return (
		<Grid className={formClasses.form} container justify='flex-start'>
			<Grid item xs={9} />
			<Grid item container alignItems='center' xs={12} spacing={3}>
				<Grid xs={3} />
				<Grid xs={9}>
					<Select
						value={queryBy}
						onChange={(e) => {
							if(typeof e.target.value === 'number') {
								setQueryBy(e.target.value as number);
							}
						}}
					>
						<MenuItem value={queryByTypes.BY_PERSONAL_DETAILS}>חיפוש לפי פרטים אישיים</MenuItem>
						<MenuItem value={queryByTypes.BY_EPIDEMIOLOGY_NUMBER}>חיפוש לפי מספר אפידמיולוגי</MenuItem>
					</Select>
				</Grid>
				<Grid xs={3} />
				<Grid item container alignItems='center' xs={9}>
					{
						queryBy === queryByTypes.BY_PERSONAL_DETAILS 
							? 	<SearchByPersonalDetails 
									getQueryParams={handlePersonalDetailsSearchButton}
								/>
							:	<SearchByEpidemiologyNumber 
									getQueryParams={handleEpidemiologyNumberSearchButton}
								/>
					}
				</Grid>
			</Grid>
			<Grid container justify='space-between' xs={12} className={classes.patientDetailsWrapper}>
                <Grid item xs={11}>
					<FormRowWithInput fieldName='פרטי החולה:'>
						<Grid item xs={7}>
						<Controller
							control={control}
							name={`exposures[${index}].${fieldsNames.exposureSource}`}
							defaultValue={exposureAndFlightsData.exposureSource}
							render={(props) => {
								return (
									<ExposureSearchTextField
										fullWidth
										disabled={true}
										name={`exposures[${index}].${fieldsNames.exposureSource}`}
										onChange={(value) => {
											setExposureSourceSearchString(value);
											(!value || !value.includes(':')) &&
												handleChangeExposureDataAndFlightsField(index, fieldsNames.exposureSource, null);
												props.onChange(null)
										}}
										value={exposureSourceSearchString}
										test-id='exposureSource'
									/>
								);
							}}
						/>
						</Grid>
					</FormRowWithInput>
				</Grid>

				<Grid item xs={1} alignItems='center' justify='flex-start'>
					<IconButton onClick={onExposureDeleted}>
							<Delete />
					</IconButton>
				</Grid>
			</Grid>

			{(isOptionalPatientsLoading || optionalCovidPatients?.length > 0) && (
				<FormRowWithInput fieldName=''>
					<div className={classes.optionalExposureSources}>
						{isOptionalPatientsLoading ? (
							<div className={classes.loadingDiv}>
								<CircularProgress className={classes.loadingSpinner} size='5vh' />
							</div>
						) : (
								<div>
									{optionalCovidPatients
										.filter(
											(exposureSource) => exposureSource.epidemiologyNumber !== epidemiologyNumber
										)
										.map((exposureSource) => (
											<MenuItem
												className={classes.optionalExposureSource}
												key={exposureSource.epidemiologyNumber}
												value={exposureSource.epidemiologyNumber}
												onClick={() => {
													setValue(`exposures[${index}].${fieldsNames.exposureSource}`, exposureSource);
													setOptionalCovidPatients([]);
													handleChangeExposureDataAndFlightsField(index, fieldsNames.exposureSource, exposureSource);
													trigger(`exposures[${index}].${fieldsNames.exposureSource}`)
												}}
											>
												<ExposureSourceOption
													exposureSource={exposureSource}
													exposureSourceSearchString={exposureSourceSearchString}
												/>
											</MenuItem>
										))}
								</div>
							)}
					</div>
				</FormRowWithInput>
			)}

			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11}>
					<FormRowWithInput fieldName='תאריך החשיפה:'>
						<Controller
							control={control}
							name={`exposures[${index}].${fieldsNames.date}`}
							defaultValue={exposureAndFlightsData[fieldsNames.date]}
							render={(props) => {
								return (
									<DatePick
										{...props}
										maxDateMessage={''}
										invalidDateMessage={''}
										maxDate={new Date()}
										testId='exposureDate'
										labelText={getDateLabel(dateError)}
										error={Boolean(dateError)}
										onChange={(newDate: Date) => {
											props.onChange(newDate);
										}
										}
									/>
								);
							}}
						/>
					</FormRowWithInput>
				</Grid>
			</Grid>

			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11}>
					<FormRowWithInput testId='exposureAddress' fieldName='כתובת החשיפה:'>
						<Controller
							control={control}
							name={`exposures[${index}].${fieldsNames.address}`}
							defaultValue={exposureAndFlightsData[fieldsNames.address]}
							render={(props) => {
								return (
									<Map
										name={fieldsNames.address}
										setSelectedAddress={(newAddress) => {
											props.onChange(newAddress);
											handleChangeExposureDataAndFlightsField(index, fieldsNames.address, newAddress)
										}
										}
										selectedAddress={exposureAndFlightsData[fieldsNames.address]}
									/>
								)
							}}
						/>
					</FormRowWithInput>
				</Grid>
			</Grid>
			
			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11} className={classes.placeTypeSpace}>
					<PlacesTypesAndSubTypes
						size='Tab'
						placeTypeName={`exposures[${index}].${fieldsNames.placeType}`}
						placeSubTypeName={`exposures[${index}].${fieldsNames.placeSubType}`}
						onPlaceTypeChange={(value) => {
							setValue(`exposures[${index}].${fieldsNames.placeType}`, value);
						}}
						onPlaceSubTypeChange={(placeSubType: PlaceSubType | null) => {
							setValue(`exposures[${index}].${fieldsNames.placeSubType}`, placeSubType?.id || null);
						}}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

interface Props {
	exposureAndFlightsData: any;
	fieldsNames: any;
	handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
	index: number;
	onExposureDeleted: () => void;
};

export default ExposureForm;