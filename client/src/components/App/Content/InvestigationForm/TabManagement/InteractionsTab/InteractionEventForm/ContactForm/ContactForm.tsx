import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import AlphabetTextField from 'commons/AlphabetTextField/AlphabetTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';

import useStyles from './ContactFormStyles';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactTypeField: string = 'סוג מגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const FIRST_NAME_LABEL='שם פרטי*';
const LAST_NAME_LABEL='שם משפחה*';
const PHONE_NUMBER_LABEL='מספר טלפון';


const ContactForm: React.FC<Props> = ({ updatedContactIndex }: Props): JSX.Element => {
    const { control, errors, setError, clearErrors, setValue} = useFormContext();

    const classes = useStyles();
    const formClasses = useFormStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    
    useEffect(() => {
        setValue(`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`, Array.from(contactTypes.keys())[0]);
    }, [])

    return (
        <div test-id='contactFormContainer' className={classes.addContactFields} key='addContactFields'>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonFirstName}>
                        <Controller 
                            name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.FIRST_NAME}`}
                            control={control}
                            render={(props) => (
                                <AlphabetTextField
                                    name={props.name}
                                    key='contactedPersonFirstName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    label={FIRST_NAME_LABEL}
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
                                <AlphabetTextField
                                    name={props.name}
                                    key='contactedPersonLastName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    label={LAST_NAME_LABEL}
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
                                    value={props.value}
                                    onChange={event => props.onChange(event.target.value as string)}
                                    error={get(errors, props.name)}
                                    label={get(errors, props.name)? get(errors, props.name).message: PHONE_NUMBER_LABEL}
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
                                    onChange={(newValue: string) => props.onChange(newValue === "" ? null : newValue as string)}
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
                            <div className={classes.newContactField}>
                                <InputLabel>סוג מגע</InputLabel>
                                    <Controller 
                                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`}
                                        control={control}
                                        render={(props) => (
                                            <Select
                                                test-id='contactType'
                                                defaultValue={Array.from(contactTypes.keys())[0]}
                                                value={props.value}
                                                onChange={event => props.onChange(event.target.value as number)}
                                                label='סוג מגע'  
                                            >
                                                {
                                                    Array.from(contactTypes.values()).map((contactType) => (
                                                    <MenuItem key={contactType.id} value={contactType.id}>
                                                        {contactType.displayName}
                                                    </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    />
                            </div>
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
};
