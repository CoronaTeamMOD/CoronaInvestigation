import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';

import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactFormStyles';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventContactFields from '../../InteractionsEventDialogContext/InteractionEventContactFields';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactTypeField: string = 'סוג מגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const ContactForm: React.FC<Props> = (props: Props): JSX.Element => {

    const {updatedContactIndex} = props;

    const classes = useStyles();
    const formClasses = useFormStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { contacts } = interactionEventDialogData;
    const contact = contacts[updatedContactIndex];
    const {extraInfo, contactType, lastName, firstName, phoneNumber, id} = contact;

    React.useEffect(() => {
        !contactType && onChange(Array.from(contactTypes.keys())[0], InteractionEventContactFields.CONTACT_TYPE);
    }, [])

    const updateContacts = (updatedContact: Contact) => {
        const updatedContacts = [...contacts];
        updatedContacts.splice(updatedContactIndex, 1, updatedContact);
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onChange = (newValue: any, updatedField: InteractionEventContactFields) =>
        updateContacts({...contact, [updatedField]: newValue});

    const {errors, setError, clearErrors} = useForm();

    return (
        <div className={classes.addContactFields} key='addContactFields'>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4} className={classes.contactAdditionalDetails}>
                    <FormInput fieldName={contactedPersonFirstName}>
                        <AlphanumericTextField
                            className={classes.newContactField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventContactFields.FIRST_NAME}
                            key='contactedPersonFirstName'
                            value={firstName}
                            onChange={newValue => onChange(newValue, InteractionEventContactFields.FIRST_NAME)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4} className={classes.contactAdditionalDetails}>
                    <FormInput fieldName={contactedPersonLastName}>
                        <AlphanumericTextField
                            className={classes.newContactField}
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventContactFields.LAST_NAME}
                            key='contactedPersonLastName'
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
                <Grid item xs={4} className={classes.contactAdditionalDetails}>
                    <FormInput fieldName={contactedPersonID}>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventContactFields.ID}
                            value={id}
                            onChange={newValue => onChange(newValue, InteractionEventContactFields.ID)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4} className={classes.contactAdditionalDetails}>
                    <FormInput fieldName={contactTypeField}>
                        <FormControl fullWidth>
                            <InputLabel>סוג מגע</InputLabel>
                            <Select
                                test-id={'contactType'}
                                label='סוג מגע'
                                value={contactType}
                                onChange={event => onChange(event.target.value as number, InteractionEventContactFields.CONTACT_TYPE)}
                            >
                                {
                                    Array.from(contactTypes.values()).map((contactType) => (
                                        <MenuItem key={contactType.id} value={contactType.id}>{contactType.displayName}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </FormInput>
                </Grid>
                <Grid item xs={6} className={classes.additionalInfoItem}>
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
                </Grid>
            </Grid>
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
}