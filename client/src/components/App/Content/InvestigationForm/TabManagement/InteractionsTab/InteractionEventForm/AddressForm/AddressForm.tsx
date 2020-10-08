import React from 'react';
import { Grid } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import { GeocodeResponse } from 'commons/LocationInputField/LocationInput';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from './AddressFormStyles';

const AddressForm: React.FC = (): JSX.Element => {
    const { setValue, getValues, control } = useFormContext();
    const { locationAddress } = getValues();

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
                        <Map
                            name={InteractionEventDialogFields.LOCATION_ADDRESS}
                            selectedAddress={locationAddress}
                            setSelectedAddress={onGoogleApiLocationTextFieldChange}
                            control={control}
                        />
                    </div>
                </FormInput>
            </Grid>
        </Grid>
    )};

export default AddressForm;
