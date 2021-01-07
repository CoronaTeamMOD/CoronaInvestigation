import React, { useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';
import { Avatar, FormControl, Grid, MenuItem, Select, Typography } from '@material-ui/core';

import theme from 'styles/theme';
import Toggle from 'commons/Toggle/Toggle';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import InteractedContactFields from 'models/enums/InteractedContact';
import HebrewTextField from 'commons/HebrewTextField/HebrewTextField';
import AddressForm, { AddressFormFields } from 'commons/Forms/AddressForm/AddressForm';
import useContactFields, { ValidationReason } from 'Utils/Contacts/useContactFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {
    const { control , getValues , errors, setValue } = useFormContext();
    const { index, familyRelationships, interactedContact, isFamilyContact } = props;

    const classes = useStyles();

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableIdByReopen = interactedContact.creationTime ?
        shouldDisableContact(interactedContact.creationTime) : false;

    const { alertError, alertWarning } = useCustomSwal();

    const formValues = getValues().form ? getValues().form[index] : interactedContact;
    const { isFieldDisabled, validateContact } = useContactFields(formValues.contactStatus);
    
    const daysToIsolate = 14;
    const isolationEndDate = addDays(new Date(interactedContact.contactDate), daysToIsolate);
    const formattedIsolationEndDate = format(new Date(isolationEndDate), 'dd/MM/yyyy');
  
    const addressFormFields: AddressFormFields = {
        cityField: {
            name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`, 
            className: classes.addressTextField, 
            testId: 'contactedPersonCity',
            defaultValue: interactedContact.isolationAddress?.city?.id
        },
        streetField: {
            name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`, 
            className: classes.addressTextField,
            defaultValue: interactedContact.isolationAddress?.street?.id
        },
        houseNumberField: {
            name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`,
            defaultValue: interactedContact.isolationAddress?.houseNum
        },
        floorField: {
            name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`,
            className: classes.appartmentNumber,
            defaultValue: interactedContact.isolationAddress?.apartment
        }
    }

    useEffect(() => {
        if (isFieldDisabled) {
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`, interactedContact.isolationAddress?.city?.id);
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`, interactedContact.isolationAddress?.street?.id);
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`, interactedContact.isolationAddress?.houseNum);
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`, interactedContact.isolationAddress?.apartment);
        } else {
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`, null);
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`, null);
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`, null);
            setValue(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`, null);
        }
    }, [isFieldDisabled])

    const formatContactToValidate = () => {
        return {
            ...formValues,
            firstName: interactedContact.firstName,
            lastName: interactedContact.lastName,
            contactType: interactedContact.contactType,
        }
    }

    const isIdAndPhoneNumValid = (): boolean => {
        const formErrors = errors.form;
        if (formErrors) {
            const currentFormErrors = formErrors[index];
            if (currentFormErrors) {
                return Boolean(formErrors[index].id) || Boolean(formErrors[index].phoneNumber)
            }
        }
        return true;
    };

    const handleIsolation = (value: boolean, onChange: (...event: any[]) => void) => {
        const contactWithIsolationRequirement = { ...formatContactToValidate(), doesNeedIsolation: value };
        const contactValidation = validateContact(contactWithIsolationRequirement, ValidationReason.HANDLE_ISOLATION);
        if (!contactValidation.valid) {
            alertError(contactValidation.error)
        } else if (!isIdAndPhoneNumValid()) {
            alertError('שים לב, ישנם שדות לא ולידים ולכן לא ניתן להקים דיווח בידוד');
        } else {
            value ?
                alertWarning('האם אתה בטוח שתרצה להקים דיווח בידוד?', {
                    showCancelButton: true,
                    cancelButtonText: 'בטל',
                    cancelButtonColor: theme.palette.error.main,
                    confirmButtonColor: theme.palette.primary.main,
                    confirmButtonText: 'כן, המשך',
                }).then((result) => {
                    if (result.value) {
                        onChange(true);
                    }
                })
                :
                onChange(false)
        }
    };

    return (
        <Grid item xs={3}>
            <Grid container direction='column' spacing={4}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>2</Avatar>
                    <Typography><b>פרטי מגע וכניסה לבידוד</b></Typography>
                </Grid>
                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName='קרבה משפחתית:' />
                        <Grid item xs={7}>
                            <Controller
                                control={control}
                                name={`form[${index}].${InteractedContactFields.FAMILY_RELATIONSHIP}`}
                                defaultValue={interactedContact.familyRelationship}
                                render={(props) => {
                                    return (<FormControl>
                                        <Select
                                            {...props}
                                            disabled={isFieldDisabled || isFamilyContact}
                                            test-id='familyRelationshipSelect'
                                            placeholder='קרבה משפחתית'
                                            onChange={(event) => {
                                                props.onChange(event.target.value)
                                            }}
                                        >
                                            {
                                                familyRelationships?.length > 0 &&
                                                [emptyFamilyRelationship].concat(familyRelationships).map((familyRelationship) => (
                                                    <MenuItem className={classes.menuItem}
                                                        key={familyRelationship.id}
                                                        value={familyRelationship.id}>
                                                        {familyRelationship.displayName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>)
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName='קשר:' />
                    <Grid item xs={7}>
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.RELATIONSHIP}`}
                            defaultValue={interactedContact.relationship}
                            render={(props) => {
                                return (
                                    <HebrewTextField
                                        {...props}
                                        disabled={isFieldDisabled}
                                        testId='relationship'
                                        onChange={(newValue: string) => {
                                            props.onChange(newValue)
                                        }}
                                        placeholder='קשר'
                                    />)
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid container item>
                        <FieldName xs={5} fieldName='מיקום השהייה בבידוד:' />
                        <Grid container item xs={7}>
                            <AddressForm
                                unsized={true}
                                disabled={isFieldDisabled}
                                {...addressFormFields}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={6} fieldName='האם נדרש סיוע עבור מקום בידוד?' />
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION}`}
                            defaultValue={interactedContact.doesNeedHelpInIsolation}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled}
                                        test-id='doesNeedHelpInIsolation'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                props.onChange(booleanValue);
                                            }
                                        }
                                        } />
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={6} fieldName='הקמת דיווח בידוד' />
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.DOES_NEED_ISOLATION}`}
                            defaultValue={interactedContact.doesNeedIsolation}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || (shouldDisableIdByReopen && interactedContact.doesNeedIsolation === true)}
                                        test-id='doesNeedIsolation'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                handleIsolation(booleanValue, props.onChange)
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container item>
                    <FieldName xs={6} fieldName='תאריך סיום בידוד:' />
                    <Grid item xs={6}>
                        <AlphanumericTextField
                            disabled
                            testId='isolationEndDate'
                            name='isolationEndDate'
                            value={formattedIsolationEndDate}
                            onChange={() => {
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default ContactQuestioningClinical;

interface Props {
    index: number;
    familyRelationships: FamilyRelationship[];
    interactedContact: InteractedContact;
    isFamilyContact: boolean;
};
