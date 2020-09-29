import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField, Typography } from '@material-ui/core';
import _ from 'lodash';

import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import useFormStyles from 'styles/formStyles';

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const businessContactFirstNameField = 'שם פרטי';
const businessContactLastNameField = 'שם משפחה';
const businessContactNumField = 'טלפון';

const BusinessContactForm : React.FC = () : JSX.Element => {
        
    const { control, errors, setError, clearErrors} = useFormContext();

    const formClasses = useFormStyles();

    return (
        <div>
            <Typography variant='body1' className={formClasses.fieldName}>פרטי איש קשר:</Typography>
            <Grid container className={formClasses.formRow}>
                <Grid item xs={3} className={classes.detailsItemField}>
                    <FormInput fieldName={businessContactFirstNameField}>
                        <Controller 
                            name={InteractionEventDialogFields.CONTACT_PERSON_FIRST_NAME}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    testId='businessContactFirstName'
                                    value={props.value ? props.value : null}
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
                <Grid item xs={3} className={classes.detailsItemField}>
                    <FormInput fieldName={businessContactLastNameField}>
                        <Controller 
                            name={InteractionEventDialogFields.CONTACT_PERSON_LAST_NAME}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    testId='businessContactLastName'
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
                <Grid item xs={3} className={classes.detailsItemField}>
                    <FormInput fieldName={businessContactNumField}>
                        <Controller 
                            name={InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER}
                            control={control}
                            render={(props) => (
                                <TextField
                                    value={props.value}
                                    onChange={event => props.onChange(event.target.value as string)}
                                    error={_.get(errors, props.name)}
                                    label={_.get(errors, props.name)?.message}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </Grid>
        </div>
    );
};

export default BusinessContactForm;