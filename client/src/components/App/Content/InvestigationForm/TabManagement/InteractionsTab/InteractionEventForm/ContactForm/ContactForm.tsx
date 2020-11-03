import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';

import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AlphabetTextField from 'commons/AlphabetTextField/AlphabetTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import useContactFields from 'Utils/vendor/useContactFields';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';
import InteractedContact from 'models/InteractedContact';

import useStyles from './ContactFormStyles';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactTypeName: string = 'סוג מגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע';

const FIRST_NAME_LABEL = 'שם פרטי*';
const LAST_NAME_LABEL = 'שם משפחה*';
const PHONE_NUMBER_LABEL = 'מספר טלפון';

const ContactForm: React.FC<Props> = ({ updatedContactIndex, contactStatus }: Props): JSX.Element => {
    const { control, setValue, getValues } = useFormContext();

    const classes = useStyles();
    const formClasses = useFormStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    const { isFieldDisabled } = useContactFields(contactStatus);

    useEffect(() => {
        const values = getValues();
        const contactContactType: number = values.contacts[updatedContactIndex]?.contactType ? values.contacts[updatedContactIndex]?.contactType : Array.from(contactTypes.keys())[0];
        setValue(`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`, contactContactType);
    }, []);

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
                                    disabled={isFieldDisabled}
                                    name={props.name}
                                    key='contactedPersonFirstName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    label={FIRST_NAME_LABEL}
                                    onBlur={props.onBlur}
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
                                    disabled={isFieldDisabled}
                                    name={props.name}
                                    key='contactedPersonLastName'
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    onBlur={props.onBlur}
                                    label={LAST_NAME_LABEL}
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
                                <NumericTextField
                                    disabled={isFieldDisabled}
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue === '' ? null : newValue as String)}
                                    onBlur={props.onBlur}
                                    label={PHONE_NUMBER_LABEL}
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
                                <NumericTextField
                                    disabled={isFieldDisabled}
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue === '' ? null : newValue as string)}
                                    onBlur={props.onBlur}
                                    className={classes.newContactField}
                                />
                            )}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactTypeName}>
                        <FormControl fullWidth>
                            <div className={classes.newContactField}>
                                <InputLabel>{contactTypeName}</InputLabel>
                                    <Controller
                                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`}
                                        control={control}
                                        render={(props) => (
                                            <Select
                                                disabled={isFieldDisabled}
                                                test-id='contactType'
                                                defaultValue={Array.from(contactTypes.keys())[0]}
                                                value={props.value}
                                                onChange={event => props.onChange(event.target.value as number)}
                                                label={contactTypeName}
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
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
    contactStatus?: InteractedContact['contactStatus'];
};
