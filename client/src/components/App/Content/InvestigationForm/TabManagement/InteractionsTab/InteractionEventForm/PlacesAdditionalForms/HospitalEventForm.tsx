import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';

import AddressForm from '../AddressForm/AddressForm';

const HospitalEventForm : React.FC = () : JSX.Element => {
    const { control } = useFormContext();

    const formClasses = useFormStyles();

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={2}>
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
                                />      
                            )}
                        />         
                    </FormInput>
                </Grid>
                <Grid item xs={2}>
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
