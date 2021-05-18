import React, { useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { Controller, DeepMap, FieldError } from 'react-hook-form';
import { Avatar, FormControl, Grid, MenuItem, Select, Typography } from '@material-ui/core';

import theme from 'styles/theme';
import Toggle from 'commons/Toggle/Toggle';
import FlattenedDBAddress from 'models/DBAddress';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import InteractedContactFields from 'models/enums/InteractedContact';
import HebrewTextField from 'commons/NoContextElements/HebrewTextField';
import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';
import useContactFields, { ValidationReason } from 'Utils/Contacts/useContactFields';
import AddressForm, { AddressFormFields } from 'commons/NoContextElements/AddressForm';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';

import useStyles from './ContactQuestioningStyles';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {
    const { index, familyRelationships, interactedContact, isFamilyContact, 
            control, watch, formValues, formErrors, trigger, contactStatus } = props;

    const classes = useStyles();

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableIdByReopen = interactedContact.creationTime ?
        shouldDisableContact(interactedContact.creationTime) : false;

    const { alertError, alertWarning } = useCustomSwal();

    const { isFieldDisabled, validateContact } = useContactFields(formValues.contactStatus);
    
    const daysToIsolate = 14;
    const isolationEndDate = addDays(new Date(interactedContact.contactDate), daysToIsolate);
    const formattedIsolationEndDate = format(new Date(isolationEndDate), 'dd/MM/yyyy');

    const isolationAddressErrors = formErrors && (formErrors[InteractedContactFields.ISOLATION_ADDRESS] as DeepMap<FlattenedDBAddress , FieldError>);

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
            defaultValue: interactedContact.isolationAddress?.street?.id  || null
        },
        houseNumberField: {
            name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`,
            defaultValue: interactedContact.isolationAddress?.houseNum,
        },
        apartmentField: {
            name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`,
            defaultValue: interactedContact.isolationAddress?.apartment
        }
    }


    const isUnreachable = formValues.contactStatus === 6
    const isUncooperative = formValues.contactStatus === 7

    const formatContactToValidate = () => {
        return {
            ...formValues,
            firstName: interactedContact.firstName,
            lastName: interactedContact.lastName,
            contactType: interactedContact.contactType,
        }
    }

    const isIdAndPhoneNumValid = (): boolean => {
        const isDoesNeedIsolationIsTheLastFormError = formErrors && Object.keys(formErrors).length===1 && Object.keys(formErrors)[0]==='doesNeedIsolation'
        if (formErrors && !isDoesNeedIsolationIsTheLastFormError) {
            return Boolean(formErrors.id) || Boolean(formErrors.phoneNumber)
        }
        return true;
    };

    const statusFieldName = `form[${index}].${InteractedContactFields.CONTACT_STATUS}`;
    const watchStatus = watch(statusFieldName);

    useEffect(() => {
        if (watchStatus || contactStatus){
            trigger();
        }
    }, [watchStatus, contactStatus]);

    const handleIsolation = (value: boolean, onChange: (...event: any[]) => void) => {
        const contactWithIsolationRequirement = { ...formatContactToValidate(), doesNeedIsolation: value };
        const contactValidation = validateContact(contactWithIsolationRequirement, ValidationReason.HANDLE_ISOLATION);
        if (!contactValidation.valid) {
            alertError(contactValidation.error)
        } else if (!isIdAndPhoneNumValid()) {
            alertError('ישנם שדות לא תקינים ולכן לא ניתן להקים דיווח בידוד');
        } else {
            value ?
                alertWarning('האם להקים דיווח בידוד?', {
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

    const handelOnChangeDoesNeedIsolation = (event:any, booleanValue: boolean, onChange: (...event: any[]) => void) => {
        if (booleanValue === false || isUnreachable || isUncooperative) {
            onChange(booleanValue)
        }
        
        if (booleanValue === true && !isUncooperative && !isUnreachable) {
            handleIsolation(booleanValue, onChange)
        }
    }

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
                                        error={formErrors && formErrors[InteractedContactFields.ADDITIONAL_PHONE_NUMBER]?.message}
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
                                control={control}
                                watch={watch}
                                errors={isolationAddressErrors}
                                {...addressFormFields}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={6} fieldName='נדרש סיוע עבור מקום בידוד?' />
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
                    <InlineErrorText
                        error={formErrors && formErrors[InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]}
                    />
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
                                        onChange={(event, booleanValue) => handelOnChangeDoesNeedIsolation(event, booleanValue, props.onChange)}
                                    />
                                )
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        error={formErrors && formErrors[InteractedContactFields.DOES_NEED_ISOLATION]}
                    />
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
    control: any;
    watch: any
    formValues: InteractedContact;
    formErrors?: DeepMap<InteractedContact, FieldError> | any;
    trigger: () => {};
    contactStatus: number;
};
