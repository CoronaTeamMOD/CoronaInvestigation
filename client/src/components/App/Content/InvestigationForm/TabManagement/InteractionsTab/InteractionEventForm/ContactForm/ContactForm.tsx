import {  FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
   
import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import ContactType from 'models/enums/ContactType';
import FormInput from 'commons/FormInput/FormInput';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactFormStyles';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventContactFields from '../../InteractionsEventDialogContext/InteractionEventContactFields';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactTypeField: string = 'סוג מגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const ContactForm : React.FC<Props> = (props: Props) : JSX.Element => {

    const { updatedContactIndex } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();
    
    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { contacts } = interactionEventDialogData;
    const contact = contacts[updatedContactIndex];
    const { extraInfo, contactType, lastName, firstName, phoneNumber, id } = contact;

    React.useEffect(() => {
        onChange(ContactType.TIGHT, InteractionEventContactFields.CONTACT_TYPE);
    }, [])

    const updateContacts = (updatedContact: Contact) => {
        const updatedContacts = [...contacts];
        updatedContacts.splice(updatedContactIndex, 1, updatedContact);
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onChange = (newValue: any, updatedField: InteractionEventContactFields) =>
        updateContacts({...contact, [updatedField]: newValue});

    const {errors, setError, clearErrors } = useForm();

    return (
        <div className={classes.addContactFields} key='addContactFields'>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonFirstName}>
                        <AlphanumericTextField
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventContactFields.FIRST_NAME}
                        key='contactedPersonFirstName'
                        className={classes.newContactField}
                        value={firstName}
                        onChange={newValue => onChange(newValue, InteractionEventContactFields.FIRST_NAME)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonLastName}>
                        <AlphanumericTextField
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventContactFields.LAST_NAME}
                        key='contactedPersonLastName'
                        className={classes.newContactField}
                        value={lastName}
                        onChange={newValue => onChange(newValue, InteractionEventContactFields.LAST_NAME)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonPhone}>
                        <PhoneNumberTextField id='contactedPersonPhone' key='contactedPersonPhone'
                            required={firstName.length > 0}
                            className={classes.newContactField}
                            value={phoneNumber.number}
                            isValid={phoneNumber.isValid}
                            setIsValid={isValid => onChange(
                                {
                                    ...phoneNumber,
                                    isValid: isValid
                                }, 
                                InteractionEventContactFields.PHONE_NUMBER
                            )
                            }
                            onChange={event => onChange(
                                {
                                    ...phoneNumber,
                                    number: event.target.value,
                                }, 
                                InteractionEventContactFields.PHONE_NUMBER
                            )} 
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonID}>
                        <AlphanumericTextField
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventContactFields.ID}
                        className={classes.newContactField}
                        value={id}
                        onChange={newValue => onChange(newValue, InteractionEventContactFields.ID)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactTypeField}>
                        <FormControl fullWidth>
                            <InputLabel>סוג מגע</InputLabel>
                            <Select
                                label='סוג מגע'
                                value={contactType}
                                onChange={event => onChange(event.target.value as string, InteractionEventContactFields.CONTACT_TYPE)}
                            >
                                {
                                    Object.values(ContactType).map((currentContactType) => (
                                        <MenuItem key={currentContactType} value={currentContactType}>{currentContactType}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </FormInput>
                </Grid>
            </Grid>
            <FormInput fieldName={contactTypeMoreDetails}>
                <AlphanumericTextField className={classes.moreContactDetails}
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventContactFields.EXTRA_INFO}
                        value={extraInfo}
                        onChange={newValue => onChange(newValue, InteractionEventContactFields.EXTRA_INFO)}
                />
            </FormInput>
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
}