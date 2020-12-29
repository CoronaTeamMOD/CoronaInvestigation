import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CircularProgress, Grid, MenuItem } from '@material-ui/core';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import CovidPatient from 'models/CovidPatient';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import ExposureFields from 'models/enums/ExposureFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ExposureSearchTextField from 'commons/AlphabetTextField/ExposureSearchTextField';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './ExposureFormStyles';
import useExposureForm from './useExposureForm';
import ExposureSourceOption from './ExposureSourceOption';
import { FormData } from '../../ExposuresAndFlightsInterfaces';
import { Exposure } from 'commons/Contexts/ExposuresAndFlights';

const INSERT_EXPOSURE_SOURCE_SEARCH = 'הזן שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';
const MAX_DATE_ERROR_MESSAGE = 'לא ניתן להזין תאריך מאוחר מתאריך תחילת המחלה';
const INVALID_DATE_ERROR_MESSAGE = 'תאריך לא חוקי';

export const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;

interface Props {
	exposureAndFlightsData: any; 
	fieldsNames: any; 
	handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
	index : number; 
}

const ExposureForm = (props: Props) => {
	const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, index } = props;

	const classes = useStyles();
	const formClasses = useFormStyles();

	const { control , setValue , errors } = useFormContext();

	const [exposureSourceSearchString, setExposureSourceSearchString] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [optionalCovidPatients, setOptionalCovidPatients] = useState<CovidPatient[]>([]);

	const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

	const { fetchOptionalCovidPatients, selectedExposureSourceDisplay } = useExposureForm({
		exposureAndFlightsData,
		exposureSourceSearchString,
	});
	useEffect(() => {
		const setOptionalCovidPatientsAsync = async () => {
			const optionalCovidPatients = await fetchOptionalCovidPatients({ setIsLoading });
			setOptionalCovidPatients(optionalCovidPatients);
		};
		setOptionalCovidPatientsAsync();
	}, [exposureSourceSearchString]);

	useEffect(() => {
		if (Boolean(exposureAndFlightsData.exposureSource)) {
			setExposureSourceSearchString(selectedExposureSourceDisplay(exposureAndFlightsData.exposureSource));
		}
    }, [exposureAndFlightsData.exposureSource]);

    useEffect(() => {
        setValue(`exposures[${index}].${fieldsNames.placeType}`, exposureAndFlightsData[fieldsNames.placeType] )
		setValue(`exposures[${index}].${fieldsNames.placeSubType}`, exposureAndFlightsData[fieldsNames.placeSubType] )
    } , []);

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
	const dateError = currentErrors ? currentErrors.exposureDate : undefined;

	return (
		<Grid className={formClasses.form} container justify='flex-start'>
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
										handleChangeExposureDataAndFlightsField(
											index,
											fieldsNames.exposureSource,
											null
										);
								}}
								value={exposureSourceSearchString}
								test-id='exposureSource'
								placeholder={INSERT_EXPOSURE_SOURCE_SEARCH}
							/>
						);
					}}
				/>
			</FormRowWithInput>

			{(isLoading || optionalCovidPatients?.length > 0) && (
				<FormRowWithInput fieldName=''>
					<div className={classes.optionalExposureSources}>
						{isLoading ? (
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
												setValue(`${fieldsNames.exposureSource}[${index}]`, exposureSource);
												setOptionalCovidPatients([]);
												handleChangeExposureDataAndFlightsField(
													index,
													fieldsNames.exposureSource,
													exposureSource
												);
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
                                handleChangeExposureDataAndFlightsField(index , fieldsNames.address, newAddress)
                                }
                            }
                            selectedAddress={exposureAndFlightsData[fieldsNames.address]}
                        />
                        )
                    }}
                    />
			</FormRowWithInput>
            <PlacesTypesAndSubTypes
				size='Tab'
				placeTypeName={`exposures[${index}].${fieldsNames.placeType}`}
				placeSubTypeName={`exposures[${index}].${fieldsNames.placeSubType}`}
				placeType={exposureAndFlightsData[fieldsNames.placeType]}
				placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
				onPlaceTypeChange={(value) => {
					setValue(`exposures[${index}].${fieldsNames.placeType}` , value);
				}}
				onPlaceSubTypeChange={(placeSubType: PlaceSubType | null) => {
					setValue(`exposures[${index}].${fieldsNames.placeSubType}` , placeSubType);
					}
				}
            />
		</Grid>
	);
};

export default ExposureForm;
