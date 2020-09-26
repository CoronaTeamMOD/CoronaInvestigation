import React from 'react';
import { useFormContext } from 'react-hook-form'
import { Grid } from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import LocationInput from "commons/LocationInputField/LocationInput";
import useFormStyles from 'styles/formStyles';

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields'
import useStyles from './AddressFormStyles';

const AddressForm : React.FC = () : JSX.Element => {
    const { getValues, control } = useFormContext();
    const { locationAddress } = getValues();

    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    return (
        <>
            <Grid container justify='flex-start' className={[formClasses.formRow, additionalClasses.addressRow].join(' ')}>
                <Grid item xs={6}>
                    <FormInput fieldName='כתובת'>
                        <LocationInput 
                            control={control} 
                            name={InteractionEventDialogFields.LOCATION_ADDRESS}
                            selectedAddress={locationAddress}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={6}/>
            </Grid>
        </>
    );
};

export default AddressForm;