import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import useContactFields from 'Utils/Contacts/useContactFields';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AlphabetTextField from 'commons/AlphabetTextField/AlphabetTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import IdentificationNumberTextField from 'commons/IdentificationNumberTextField/IdentificationNumberTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import { contactType, extraInfo, firstName, identificationNumber, identificationType, lastName, phone } from 'Utils/Contacts/contactsFieldsNames';

import useStyles from './ContactFormStyles';
import ContactTypeKeys from '../../../InteractionSection/ContactForm/ContactTypeKeys';
import Contact from 'models/Contact';

const FIRST_NAME_LABEL = 'שם פרטי*';
const LAST_NAME_LABEL = 'שם משפחה*';
const PHONE_NUMBER_LABEL = 'מספר טלפון';

const ContactForm: React.FC<Props> = ({ updatedContactIndex, contactStatus, contactCreationTime, contactIdentificationType }: Props): JSX.Element => {
    const { control, setValue, getValues } = useFormContext();

    const classes = useStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    const { isFieldDisabled } = useContactFields(contactStatus);

    const formValues = getValues().form
        ? getValues().form[updatedContactIndex].identificationType : contactIdentificationType;
    const [isPassport, setIsPassport] = useState<boolean>(
        formValues === IdentificationTypes.PASSPORT
    );
    
    const { shouldDisableContact } = useStatusUtils();

    useEffect(() => {
        const values = getValues();
        const contactContactType: number = values.contacts[updatedContactIndex]?.contactType ? values.contacts[updatedContactIndex]?.contactType : Array.from(contactTypes.keys())[ContactTypeKeys.CONTACT_TYPE_NOT_TIGHT];
        setValue(`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`, contactContactType);
    }, []);

    const getSelectableContactTypeValues = (): ContactType[] => {
        return Array.from(contactTypes.values()).filter((ct: ContactType) => ct.id !== ContactTypeKeys.CONTACT_TYPE_OPTIONAL);
    }

    return (
        <div test-id='contactFormContainer' key='addContactFields'>
            <Grid container justify='flex-start' spacing={6}>
                <FormInput xs={4} labelLength={3} fieldName={firstName}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.FIRST_NAME}`}
                        control={control}
                        render={(props) => (
                            <AlphabetTextField
                                disabled={isFieldDisabled}
                                name={props.name}
                                key='firstName'
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue as string)}
                                label={FIRST_NAME_LABEL}
                                onBlur={props.onBlur}
                                className={classes.inputForm}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={4} labelLength={3} fieldName={lastName}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.LAST_NAME}`}
                        control={control}
                        render={(props) => (
                            <AlphabetTextField
                                disabled={isFieldDisabled}
                                name={props.name}
                                key='lastName'
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue as string)}
                                onBlur={props.onBlur}
                                label={LAST_NAME_LABEL}
                                className={classes.inputForm}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={4} labelLength={3} fieldName={phone}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.PHONE_NUMBER}`}
                        control={control}
                        render={(props) => (
                            <NumericTextField
                                disabled={isFieldDisabled}
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue === '' ? null : newValue as String)}
                                onBlur={props.onBlur}
                                label={PHONE_NUMBER_LABEL}
                                className={classes.inputForm}
                            />
                        )}
                    />
                </FormInput>
            </Grid>
            <Grid container justify='flex-start' spacing={6}>
                <FormInput xs={4} labelLength={3} fieldName={identificationType}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.IDENTIFICATION_TYPE}`}
                        control={control}
                        defaultValue={formValues}
                        render={(props) => (
                            <Toggle
                                value={isPassport}
                                onChange={(event, value) => {
                                    if (value !== null) {
                                        setIsPassport(value);
                                        props.onChange(
                                            value
                                                ? IdentificationTypes.PASSPORT
                                                : IdentificationTypes.ID
                                        );
                                    }
                                }}
                                disabled={isFieldDisabled}
                                test-id={InteractionEventContactFields.IDENTIFICATION_TYPE}
                                onBlur={props.onBlur}
                                firstOption={IdentificationTypes.ID}
                                secondOption={IdentificationTypes.PASSPORT}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={4} labelLength={3} fieldName={identificationNumber}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.IDENTIFICATION_NUMBER}`}
                        control={control}
                        render={(props) => (
                            <IdentificationNumberTextField
                                disabled={isFieldDisabled || (contactCreationTime ? shouldDisableContact(contactCreationTime) : false)}
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue === '' ? null : newValue as string)}
                                onBlur={props.onBlur}
                                className={classes.inputForm}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={4} labelLength={3} fieldName={contactType}>
                    <FormControl fullWidth>
                        <div>
                            <Controller
                                name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`}
                                control={control}
                                render={(props) => (
                                    <Select
                                        disabled={isFieldDisabled}
                                        test-id='contactType'
                                        defaultValue={Array.from(contactTypes.keys())[ContactTypeKeys.CONTACT_TYPE_NOT_TIGHT]}
                                        value={props.value}
                                        className={classes.inputForm}
                                        onChange={event => props.onChange(event.target.value as number)}
                                    >
                                        {
                                            getSelectableContactTypeValues().map((contactType: ContactType) => (
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
            <Grid container justify='flex-start' spacing={2}>
                <FormInput xs={12} labelLength={2} fieldName={extraInfo}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.EXTRA_INFO}`}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                disabled={isFieldDisabled}
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => props.onChange(newValue as string)}
                                onBlur={props.onBlur}
                                className={classes.moreContactDetails}
                            />
                        )}
                    />
                </FormInput>
            </Grid>
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
    contactStatus?: InteractedContact['contactStatus'];
    contactCreationTime?: Date;
    contactIdentificationType?: string;
};
