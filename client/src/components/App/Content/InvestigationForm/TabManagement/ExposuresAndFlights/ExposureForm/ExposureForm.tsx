import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import useFormStyles from 'styles/formStyles';
import { exposuresContext } from "commons/Contexts/ExposuresAndFlights";
import LocationInput, { GoogleApiPlace } from 'commons/LocationInputField/LocationInput';

const ExposureForm = () => {
    const placeholderText = 'הכנס שם...';
    const classes = useFormStyles();

    const { exposureData, setExposureData } = useContext(exposuresContext);
    const { exposingPersonName, placeType, exposureLocation } = exposureData;
    const { exposingPersonName: setExposingPersonName, placeType: setPlaceType, exposureLocation: setExposureLocation } = setExposureData;

    const placeTypeOptions = [
        { id: 1, name: 'מקום ציבורי' },
        { id: 2, name: 'מקום דת' },
        { id: 3, name: 'מקום מקומי' }
    ];

    const selectPlaceType = (event: React.ChangeEvent<any>) => setPlaceType(event.target.value);
    const handlePersonNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setExposingPersonName(event.target.value);
    const onLocationChange = (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => setExposureLocation(newValue);

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='שם החולה:'>
                <CircleTextField value={exposingPersonName} onChange={handlePersonNameInput}
                    placeholder={placeholderText} test-id='confirmedPatientName' />
            </FormRowWithInput>

            <FormRowWithInput fieldName='שם מקום החשיפה:' testId='exposureLocation'>
                <LocationInput selectedAddress={exposureLocation as (GoogleApiPlace | null)} setSelectedAddress={onLocationChange} />
            </FormRowWithInput>

            <FormRowWithInput fieldName='סוג מקום החשיפה:'>
                <CircleSelect isNameUnique={false}
                    value={placeType} onChange={selectPlaceType} options={placeTypeOptions} test-id='locationType' />
            </FormRowWithInput>
        </Grid>
    );
};

export default ExposureForm;