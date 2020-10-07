import React from 'react';
import { Grid } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import { GeocodeResponse } from 'commons/LocationInputField/LocationInput';

import useStyles from './AddressFormStyles';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const AddressForm: React.FC = (): JSX.Element => {
    const { setValue, control } = useFormContext();

    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const onGoogleApiLocationTextFieldChange = (newValue: GeocodeResponse | null) => {
        setValue(InteractionEventDialogFields.LOCATION_ADDRESS, newValue);
    };

    return (
        <Grid container justify='flex-start' className={[formClasses.formRow, additionalClasses.addressRow].join(' ')}>
            <Grid item xs={4}>
                <FormInput fieldName='כתובת'>
                    <div className={additionalClasses.addressAutoCompleteField}>
                    <Controller
                            name={InteractionEventDialogFields.LOCATION_ADDRESS}
                            control={control}
                            render={(props) => (
                                <Map
                                    name={InteractionEventDialogFields.LOCATION_ADDRESS}
                                    selectedAddress={props.value}
                                    setSelectedAddress={onGoogleApiLocationTextFieldChange}
                                />
                            )}
                        />
                    </div>
                </FormInput>
            </Grid>
        </Grid>
    )};

export default AddressForm;
