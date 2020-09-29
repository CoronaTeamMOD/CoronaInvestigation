import React from 'react';
import { Controller, useFormContext } from 'react-hook-form'
import { Grid } from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import useFormStyles from 'styles/formStyles';

import AddressForm from '../AddressForm/AddressForm';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const HospitalEventForm : React.FC = () : JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();

    const formClasses = useFormStyles();

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם בית חולים'>
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
                                />      
                            )}
                        />         
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='מחלקה'>
                        <Controller 
                            name={InteractionEventDialogFields.HOSPITAL_DEPARTMENT}
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
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </div>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default HospitalEventForm;