import React from 'react';
import {Grid} from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';

import useStyles from './DefaultPlaceEventFormStyles';
import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';

const DefaultPlaceEventForm: React.FC = (): JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();
    
    const classes = useStyles();
    return (
        <>
            <Grid item xs={2}>
                <FormInput fieldName='שם המוסד'>
                    <Controller 
                        name={InteractionEventDialogFields.PLACE_NAME}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue as string)}
                                onBlur={props.onBlur}
                                errors={errors}
                                setError={setError}
                                clearErrors={clearErrors}
                                className={classes.placeNameField}
                            />
                        )}
                    />   
                </FormInput>
            </Grid>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default DefaultPlaceEventForm;
