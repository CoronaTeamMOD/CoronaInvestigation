import React from 'react';
import { Grid } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from './AddressFormStyles';

const AddressForm: React.FC = (): JSX.Element => {
    
    const { control } = useFormContext();

    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    return (
        <Grid container justify='flex-start' className={[formClasses.formRow, additionalClasses.addressRow].join(' ')}>
            <FormInput xs={8} fieldName='מקום/כתובת' className={additionalClasses.addressText}>
                        <Controller
                            name={InteractionEventDialogFields.LOCATION_ADDRESS}
                            control={control}
                            render={(props) => (
                                <Map
                                    name={InteractionEventDialogFields.LOCATION_ADDRESS}
                                    selectedAddress={props.value}
                                    setSelectedAddress={(newSelectedAddress) => props.onChange(newSelectedAddress)}
                                />
                            )}
                        />
            </FormInput>
        </Grid>
    )
};

export default AddressForm;