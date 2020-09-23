import React from 'react';
import { Grid, TextField } from '@material-ui/core';

import useStyles from './ExposureFormStyles';
import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import LocationInput from 'commons/LocationInputField/LocationInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import { useForm } from 'react-hook-form';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

const ExposureForm = (props: any) => {
    const {
        exposureAndFlightsData,
        fieldsNames,
        handleChangeExposureDataAndFlightsField,
    } = props;

  const classes = useStyles();
  const { errors, setError, clearErrors } = useForm();

    return (
        <Grid className={classes.exposureForm} container justify="flex-start">
            <FormRowWithInput fieldName="שם החולה:">
                <div className={classes.exposureContactNameFields}>
                    <AlphanumericTextField
                        className={classes.exposureContactName}
                        required
                        errors={errors}
                        value={exposureAndFlightsData[fieldsNames.firstName]}
                        onChange={(value : string) =>
                            handleChangeExposureDataAndFlightsField(
                                fieldsNames.firstName,
                                value
                            )
                        }
                        setError={setError}
                        clearErrors={clearErrors}
                        name={fieldsNames.firstName}
                        placeholder="שם פרטי"
                        label="שם פרטי"
                    />
                    <AlphanumericTextField
                        className={classes.exposureContactName}
                        required
                        errors={errors}
                        value={exposureAndFlightsData[fieldsNames.lastName]}
                        onChange={(value : string) =>
                            handleChangeExposureDataAndFlightsField(
                                fieldsNames.lastName,
                                value
                            )
                        }
                        name={fieldsNames.lastName}
                        setError={setError}
                        clearErrors={clearErrors}
                        placeholder="שם משפחה"
                        label="שם משפחה"
                    />
                </div>
            </FormRowWithInput>
            <FormRowWithInput fieldName="תאריך החשיפה:">
                <div className={classes.exposureDate}>
                    <DatePick
                        labelText="תאריך"
                        value={exposureAndFlightsData[fieldsNames.date]}
                        onChange={(newDate: Date) =>
                            handleChangeExposureDataAndFlightsField(fieldsNames.date, newDate)
                        }
                    />
                </div>
            </FormRowWithInput>
            <div className={classes.exposureAddress}>
                <FormRowWithInput fieldName="כתובת החשיפה:">
                    <div>
                        <LocationInput
                            selectedAddress={exposureAndFlightsData[fieldsNames.address]}
                            setSelectedAddress={(e, newValue) =>
                                handleChangeExposureDataAndFlightsField(fieldsNames.address, newValue)}
                        />
                    </div>
                </FormRowWithInput>
            </div>
            <PlacesTypesAndSubTypes
                required
                placeType={exposureAndFlightsData[fieldsNames.placeType]}
                placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
                onPlaceTypeChange={(value) =>
                    handleChangeExposureDataAndFlightsField(fieldsNames.placeType, value)
                }
                onPlaceSubTypeChange={(value) =>
                    handleChangeExposureDataAndFlightsField(
                        fieldsNames.placeSubType,
                        value
                    )
                }
            />
        </Grid>
    );
};

export default ExposureForm;
