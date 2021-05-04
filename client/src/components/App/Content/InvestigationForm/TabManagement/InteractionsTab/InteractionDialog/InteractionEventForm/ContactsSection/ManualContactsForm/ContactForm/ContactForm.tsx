import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, Grid, MenuItem, Select } from '@material-ui/core';

import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import IdentificationType from 'models/IdentificationType';
import ContactFieldName from 'models/enums/ContactFieldName';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import useContactFields from 'Utils/Contacts/useContactFields';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import IdentificationTypesCodes from 'models/enums/IdentificationTypesCodes';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import IdentificationTextField from 'commons/IdentificationTextField/IdentificationTextField';
import AlphabetWithDashTextField from 'commons/AlphabetWithDashTextField/AlphabetWithDashTextField';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';

import useStyles from './ContactFormStyles';
import ContactTypeKeys from './ContactTypeKeys';

const FIRST_NAME_LABEL = 'שם פרטי*';
const LAST_NAME_LABEL = 'שם משפחה*';
const PHONE_NUMBER_LABEL = 'מספר טלפון';

const ContactForm: React.FC<Props> = ({ updatedContactIndex, contactStatus, personInfo, contactCreationTime, contactIdentificationType }: Props): JSX.Element => {
    const { control, setValue, getValues, watch, trigger, errors } = useFormContext();

    const classes = useStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    const identificationTypes = useSelector<StoreStateType, IdentificationType[]>(state => state.identificationTypes);
    const { isFieldDisabled } = useContactFields(contactStatus);
    const isExistingPerson = Boolean(personInfo);

    const { shouldDisableContact } = useStatusUtils();

    const [isId, setIsId] =  useState<boolean>(false);

    const identificationTypeFieldName = `${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.IDENTIFICATION_TYPE}`;
	const identificationNumberFieldName = `${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.IDENTIFICATION_NUMBER}`;

    const identificationTypeErrorText = errors?.contacts && errors?.contacts[updatedContactIndex] && errors?.contacts[updatedContactIndex].identificationType?.message;
    const identificationTypeError =  get(errors, identificationTypeFieldName);

	const watchIdentificationType = watch(identificationTypeFieldName);
    const watchIdentificationNumber = watch(identificationNumberFieldName);

	useEffect(() => {
        if (watchIdentificationType || watchIdentificationNumber){
            trigger(identificationTypeFieldName);
            trigger(identificationNumberFieldName); 
        }
        if (watchIdentificationType === IdentificationTypesCodes.PALESTINE_ID || watchIdentificationType === IdentificationTypesCodes.ID) {
            setIsId(true);
        } else {
            setIsId(false);
        }
    }, [watchIdentificationType, watchIdentificationNumber]);
    
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
                <FormInput xs={4} labelLength={3} fieldName={ContactFieldName.FIRST_NAME}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.FIRST_NAME}`}
                        control={control}
                        render={(props) => (
                            <AlphabetWithDashTextField
                                disabled={isExistingPerson}
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
                <FormInput xs={4} labelLength={3} fieldName={ContactFieldName.LAST_NAME}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.LAST_NAME}`}
                        control={control}
                        render={(props) => (
                            <AlphabetWithDashTextField
                                disabled={isExistingPerson}
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
                <FormInput xs={4} labelLength={3} fieldName={ContactFieldName.PHONE}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.PHONE_NUMBER}`}
                        control={control}
                        render={(props) => (
                            <NumericTextField
                                disabled={isExistingPerson}
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
                <FormInput xs={4} labelLength={3} fieldName={ContactFieldName.IDENTIFICATION_TYPE}>
                    <FormControl fullWidth error={identificationTypeError}>
                        <div>
                            <Controller                                        
                                defaultValue={contactIdentificationType?.id ? contactIdentificationType?.id : null}
                                name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.IDENTIFICATION_TYPE}`}
                                control={control}
                                render={(props) => (
                                    <Select
                                        disabled={isFieldDisabled}
                                        test-id='identificationType'
                                        value={props.value}
                                        className={classes.inputForm}
                                        onChange={(event) => {
                                            props.onChange(event.target.value as number)
                                        }}
                                    >
                                        {
                                            identificationTypes.map((identificationType: IdentificationType) => (
                                                <MenuItem key={identificationType.id} value={identificationType.id}>
                                                    {identificationType.type}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>                                        
                                )}
                            />
                            {identificationTypeError && <FormHelperText>{identificationTypeErrorText}</FormHelperText>}
                        </div>
                    </FormControl>
                </FormInput>
                <FormInput xs={4} labelLength={3} fieldName={ContactFieldName.IDENTIFICATION_NUMBER}>
                    <Controller
                        name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.IDENTIFICATION_NUMBER}`}
                        control={control}
                        render={(props) => (
                            <IdentificationTextField
                                disabled={isFieldDisabled || (contactCreationTime ? shouldDisableContact(contactCreationTime) : false)}
                                name={props.name}
                                value={props.value}
                                onChange={(newValue: string) => {
                                    props.onChange(newValue === '' ? null : newValue as string)
                                }}
                                onBlur={props.onBlur}
                                className={classes.inputForm}
                                isId={isId}
                            />
                        )}
                    />
                </FormInput>
                <FormInput xs={4} labelLength={3} fieldName={ContactFieldName.CONTACT_TYPE}>
                    <FormControl fullWidth>
                        <div>
                            <Controller
                                name={`${InteractionEventDialogFields.CONTACTS}[${updatedContactIndex}].${InteractionEventContactFields.CONTACT_TYPE}`}
                                control={control}
                                render={(props) => (
                                    <Select
                                        disabled={isFieldDisabled}
                                        test-id='contactType'
                                        defaultValue={Array.from(contactTypes.keys())[ContactTypeKeys.CONTACT_TYPE_TIGHT]}
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
                <FormInput xs={12} labelLength={2} fieldName={ContactFieldName.EXTRA_INFO}>
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
    personInfo?: number;
    contactStatus?: InteractedContact['contactStatus'];
    contactCreationTime?: Date;
    contactIdentificationType?: IdentificationType;
};
