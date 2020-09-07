import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import useFormStyles from 'styles/formStyles';
import {exposuresContext} from "Contexts/ExposuresAndFlights";

const ExposureForm = () => {
    const insertNamePlaceHolder = 'הכנס שם...';
    const firstNamePlaceHolder = 'שם פרטי...';
    const lastNamePlaceHolder = 'שם משפחה...';
    const classes = useFormStyles();

    const {exposureData, setExposureData} = useContext(exposuresContext);
    const {exposingPersonFirstName, exposingPersonLastName, placeType, exposureLocation} = exposureData;
    const {exposingPersonFirstName: setExposingPersonFirstName, exposingPersonLastName: setExposingPersonLastName, placeType: setPlaceType, exposureLocation: setExposureLocation} = setExposureData;

    const placeTypeOptions = [
        {id: 1, name: 'מקום ציבורי'},
        {id: 2, name: 'מקום דת'},
        {id: 3, name: 'מקום מקומי'}
    ];

    const selectPlaceType = (event: React.ChangeEvent<any>) => setPlaceType(event.target.value);
    const handlePersonFirstNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setExposingPersonFirstName(event.target.value);
    const handlePersonLastNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setExposingPersonLastName(event.target.value);
    const handlePlaceNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setExposureLocation(event.target.value);

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='שם החולה:'>
                <>
                    <CircleTextField value={exposingPersonFirstName} onChange={handlePersonFirstNameInput}
                                    placeholder={firstNamePlaceHolder}/>
                    <CircleTextField value={exposingPersonLastName} onChange={handlePersonLastNameInput}
                                    placeholder={lastNamePlaceHolder}/>
                </>
            </FormRowWithInput>

            <FormRowWithInput fieldName='שם מקום החשיפה:'>
                <CircleTextField value={exposureLocation} onChange={handlePlaceNameInput}
                                 placeholder={insertNamePlaceHolder}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='סוג מקום החשיפה:'>
                <CircleSelect isNameUnique={false}
                              value={placeType} onChange={selectPlaceType} options={placeTypeOptions}/>
            </FormRowWithInput>
        </Grid>
    );
};

export default ExposureForm;