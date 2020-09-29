import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import _ from 'lodash'

import useFormStyles from 'styles/formStyles';
import ContactType from 'models/enums/ContactType';
import FormInput from 'commons/FormInput/FormInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactFormStyles';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from '../../InteractionsEventDialogContext/InteractionEventContactFields';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactTypeField: string = 'סוג מגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const ContactForm: React.FC<Props> = ({ updatedContactIndex }: Props): JSX.Element => {
    const { control, errors, setError, clearErrors, setValue} = useFormContext();

    const classes = useStyles();
    const formClasses = useFormStyles();

    useEffect(() => {
        setValue(`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`, ContactType.TIGHT);
    }, [])

    return (
        <div className={classes.addContactFields} key='addContactFields'>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonFirstName}>
                        <Controller 
                            name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.FIRST_NAME}`}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    key='contactedPersonFirstName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    className={classes.newContactField}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonLastName}>
                        <Controller 
                            name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.LAST_NAME}`}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={props.name}
                                    key='contactedPersonLastName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    className={classes.newContactField}
                                />
                            )}
                        />
                        
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonPhone}>
                        <Controller 
                            name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.PHONE_NUMBER}`}
                            control={control}
                            render={(props) => (
                                <TextField 
                                    error={_.get(errors, props.name)}
                                    label={_.get(errors, props.name)?.message}
                                    value={props.value}
                                    onChange={event => props.onChange(event.target.value as string)}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonID}>
                        <Controller 
                            name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.ID}`}
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
                                    className={classes.newContactField}
                                />
                            )}
                        />
                        
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactTypeField}>
                        <FormControl fullWidth>
                            <InputLabel>סוג מגע</InputLabel>
                            <Controller 
                                name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`}
                                control={control}
                                render={(props) => (
                                    <Select
                                        test-id='contactType'
                                        defaultValue={ContactType.TIGHT}
                                        value={props.value}
                                        onChange={event => props.onChange(event.target.value as string)}
                                        label='סוג מגע'  
                                    >
                                        {
                                            Object.values(ContactType).map((currentContactType) => (
                                                <MenuItem  key={currentContactType} value={currentContactType}>
                                                    {currentContactType}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </FormInput>
                </Grid>
            </Grid>
            <FormInput fieldName={contactTypeMoreDetails}>
                <Controller 
                    name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.EXTRA_INFO}`}
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
                            className={classes.moreContactDetails}
                        />
                    )}
                />
                
            </FormInput>
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
}