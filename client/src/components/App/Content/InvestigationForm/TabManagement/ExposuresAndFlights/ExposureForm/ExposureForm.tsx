import React, {useContext} from 'react';
import {Grid, MenuItem} from '@material-ui/core';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import RoundedSelect from 'commons/RoundedSelect/RoundedSelect';
import useFormStyles from 'styles/formStyles';
import {exposuresContext} from "Contexts/ExposuresAndFlights";

const ExposureForm = () => {
    const placeholderText = 'הכנס שם...';
    const classes = useFormStyles();

    const {exposureData, setExposureData} = useContext(exposuresContext);
    const {exposingPersonName, placeType, exposureLocation} = exposureData;
    const {exposingPersonName: setExposingPersonName, placeType: setPlaceType, exposureLocation: setExposureLocation} = setExposureData;

    const placeTypeOptions = [
        {id: 1, name: 'מקום ציבורי'},
        {id: 2, name: 'מקום דת'},
        {id: 3, name: 'מקום מקומי'}
    ];

    const selectPlaceType = (event: React.ChangeEvent<any>) => setPlaceType(event.target.value);
    const handlePersonNameInput = (event: React.ChangeEvent<HTMLInputElement>) =>setExposingPersonName(event.target.value);
    const handlePlaceNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setExposureLocation(event.target.value);

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='שם החולה:'>
                <CircleTextField value={exposingPersonName} onChange={handlePersonNameInput}
                                 placeholder={placeholderText}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='שם מקום החשיפה:'>
                <CircleTextField value={exposureLocation} onChange={handlePlaceNameInput}
                                 placeholder={placeholderText}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='סוג מקום החשיפה:'>
                <RoundedSelect value={placeType} onChange={selectPlaceType}>
                    {
                        placeTypeOptions.map(placeName =>
                            <MenuItem key={placeName.id} value={placeName.name}>{placeName.name}</MenuItem>
                        )
                    }
                </RoundedSelect>
            </FormRowWithInput>
        </Grid>
    );
};

export default ExposureForm;