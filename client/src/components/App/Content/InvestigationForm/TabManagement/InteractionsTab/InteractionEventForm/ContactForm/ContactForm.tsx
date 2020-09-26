import React, { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import ContactType from 'models/enums/ContactType';
import FormInput from 'commons/FormInput/FormInput';
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

const ContactForm: React.FC<Props> = (props: Props): JSX.Element => {
    const { control, errors, setError, clearErrors} = useFormContext();

    const { updatedContactIndex } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();

    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { contacts } = interactionEventDialogData;
    const contact = contacts[updatedContactIndex];

    React.useEffect(() => {
        onChange(ContactType.TIGHT, InteractionEventContactFields.CONTACT_TYPE);
    }, [])

    const updateContacts = (updatedContact: Contact) => {
        const updatedContacts = [...contacts];
        updatedContacts.splice(updatedContactIndex, 1, updatedContact);
        setInteractionEventDialogData({ ...interactionEventDialogData, contacts: updatedContacts });
    }

    const onChange = (newValue: any, updatedField: InteractionEventContactFields) =>
        updateContacts({ ...contact, [updatedField]: newValue });

    return (
        <div className={classes.addContactFields} key='addContactFields'>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonFirstName}>
                        <Controller 
                            name={InteractionEventContactFields.FIRST_NAME}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventContactFields.FIRST_NAME}
                                    key='contactedPersonFirstName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
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
                            name={InteractionEventContactFields.LAST_NAME}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventContactFields.LAST_NAME}
                                    key='contactedPersonLastName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
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
                            name={InteractionEventContactFields.PHONE_NUMBER}
                            control={control}
                            render={(props) => (
                                <TextField 
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
                            name={InteractionEventContactFields.ID}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={InteractionEventContactFields.ID}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
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
                                name={InteractionEventContactFields.CONTACT_TYPE}
                                control={control}
                                render={(props) => (
                                    <Select
                                        test-id='contactType'
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
                    name={InteractionEventContactFields.EXTRA_INFO}
                    control={control}
                    render={(props) => (
                        <AlphanumericTextField 
                            name={InteractionEventContactFields.EXTRA_INFO}
                            value={props.value}
                            onChange={(newValue: string) => props.onChange(newValue as string)}
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