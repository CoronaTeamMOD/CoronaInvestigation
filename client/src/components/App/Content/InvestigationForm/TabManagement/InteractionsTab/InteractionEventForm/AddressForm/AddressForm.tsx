import React from 'react';
import { Grid } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import { GeocodeResponse } from 'commons/LocationInputField/LocationInput';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import useStyles from './AddressFormStyles';

const AddressForm: React.FC = (): JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

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
                                    setSelectedAddress={(newSelectedAddress) => props.onChange(newSelectedAddress)}
                                />
                            )}
                        />
                    </div>
                </FormInput>
            </Grid>
        </Grid>
    )};

export default AddressForm;