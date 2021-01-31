import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CircularProgress, Grid, IconButton, MenuItem } from '@material-ui/core';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import CovidPatient from 'models/CovidPatient';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ExposureSearchTextField from './ExposureSearchTextField/ExposureSearchTextField';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './ExposureFormStyles';
import useExposureForm from './useExposureForm';
import ExposureSourceOption from './ExposureSourceOption';

const ExposureForm = (props: Props) => {

	const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index, onExposureDeleted } = props;

	const classes = useStyles();
	const formClasses = useFormStyles();
	const { control, setValue, errors } = useFormContext();

	const [exposureSourceSearchString, setExposureSourceSearchString] = useState<string>('');
	const [isOptionalPatientsLoading, setOptionalPatientsLoading] = useState<boolean>(false);
	const [optionalCovidPatients, setOptionalCovidPatients] = useState<CovidPatient[]>([]);
	const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

	const { fetchOptionalCovidPatients, selectedExposureSourceDisplay } = useExposureForm({
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
				return 'תאריך לא ולידי'
			}
			return dateError.message;
		}
		return 'תאריך'
	};

	const currentErrors = errors ? (errors.exposures ? errors.exposures[index] : {}) : {};
	const dateError = currentErrors ? currentErrors.exposureDate : undefined;

	return (
		<Grid className={formClasses.form} container justify='flex-start'>
			<Grid container justify='space-between' xs={12}>
                <Grid item xs={11}>
					<FormRowWithInput fieldName='פרטי החולה:'>
						<Controller
							control={control}
							name={`exposures[${index}].${fieldsNames.exposureSource}`}
							defaultValue={exposureAndFlightsData.exposureSource}
							render={(props) => {
								return (
									<ExposureSearchTextField
										name={`exposures[${index}].${fieldsNames.exposureSource}`}
										className={classes.exposureSourceTextFied}
										onChange={(value) => {
											setExposureSourceSearchString(value);
											(!value || !value.includes(':')) &&
												handleChangeExposureDataAndFlightsField(index, fieldsNames.exposureSource, null);
										}}
										value={exposureSourceSearchString}
										test-id='exposureSource'
										onSearchClick={setOptionalCovidPatientsAsync}
										onKeyDown={(e: React.KeyboardEvent) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												setOptionalCovidPatientsAsync()
											}
										}}
									/>
								);
							}}
						/>
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
                <Grid item xs={11}>
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