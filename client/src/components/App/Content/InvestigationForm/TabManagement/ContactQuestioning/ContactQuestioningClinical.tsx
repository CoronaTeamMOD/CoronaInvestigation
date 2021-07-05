import React, { useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { Controller, DeepMap, FieldError, useFormContext } from 'react-hook-form';
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
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import HebrewTextField from 'commons/NoContextElements/HebrewTextField';
import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';
import useContactFields, { ValidationReason } from 'Utils/Contacts/useContactFields';
import AddressForm, { AddressFormFields } from 'commons/NoContextElements/AddressForm';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningFieldsNames from './ContactQuestioningFieldsNames';
import { FormInputs } from './ContactQuestioningInterfaces';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {

    const { errors, watch, ...methods } = useFormContext<FormInputs>();

    const { index, familyRelationships, interactedContact, isFamilyContact, isViewMode } = props;

    const classes = useStyles();

    const { shouldDisableContact } = useStatusUtils();

    const shouldDisableIdByReopen = interactedContact.creationTime
        ? shouldDisableContact(interactedContact.creationTime)
        : false;

    const { alertError, alertWarning } = useCustomSwal();

    const { isFieldDisabled, validateContact } = useContactFields(interactedContact.contactStatus);

    const daysToIsolate = 14;
    const isolationEndDate = addDays(new Date(interactedContact.contactDate), daysToIsolate);
    const formattedIsolationEndDate = format(new Date(isolationEndDate), 'dd/MM/yyyy');

    const isolationAddressErrors = errors && errors.form && (errors.form[InteractedContactFields.ISOLATION_ADDRESS] as DeepMap<FlattenedDBAddress, FieldError>);

    const addressFormFields: AddressFormFields = {
        cityField: {
            name: `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`,
            className: classes.addressTextField,
            testId: 'contactedPersonCity',
            defaultValue: interactedContact.isolationAddress?.city?.id
        },
        streetField: {
            name: `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`,
            className: classes.addressTextField,
            defaultValue: interactedContact.isolationAddress?.street?.id || null
        },
        houseNumberField: {
            name: `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`,
            className: classes.addressTextField,
            defaultValue: interactedContact.isolationAddress?.houseNum,
        },
        apartmentField: {
            name: `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`,
            className: classes.addressTextField,
            defaultValue: interactedContact.isolationAddress?.apartment
        }
    };

    const isUnreachable = interactedContact.contactStatus === 6
    const isUncooperative = interactedContact.contactStatus === 7

    const formatContactToValidate = () => {
        return {
            ...interactedContact,
            firstName: interactedContact.firstName,
            lastName: interactedContact.lastName,
            contactType: interactedContact.contactType,
        }
    };

    const isIdAndPhoneNumValid = (): boolean => {
        const isDoesNeedIsolationIsTheLastFormError = errors && errors.form && Object.keys(errors.form).length === 1 && Object.keys(errors.form)[0] === 'doesNeedIsolation'
        if (errors && errors.form && !isDoesNeedIsolationIsTheLastFormError) {
            return Boolean(errors.form.id) || Boolean(errors.form.phoneNumber)
        }
        return true;
    };

    const statusFieldName = `${InteractedContactFields.CONTACT_STATUS}`;
    const watchStatus = watch(statusFieldName);
    

    useEffect(() => {
        if (watchStatus || isFieldDisabled) {
            methods.trigger();
        }
    }, [watchStatus, isFieldDisabled]);

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

    const handelOnChangeDoesNeedIsolation = (event: any, booleanValue: boolean, onChange: (...event: any[]) => void) => {
        if (booleanValue === false || isUnreachable || isUncooperative) {
            onChange(booleanValue)
        }

        if (booleanValue === true && !isUncooperative && !isUnreachable) {
            handleIsolation(booleanValue, onChange)
        }
    }

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={2}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>2</Avatar>
                    <Typography><b>פרטי מגע וכניסה לבידוד</b></Typography>
                </Grid>

                <Grid item container>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.FAMILY_RELATIONSHIP} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.FAMILY_RELATIONSHIP}`}
                            defaultValue={interactedContact.familyRelationship}
                            render={(props) => {
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <Select
                                            {...props}
                                            disabled={isFieldDisabled || isFamilyContact || isViewMode}
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
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.RELATIONSHIP} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.RELATIONSHIP}`}
                            defaultValue={interactedContact.relationship}
                            render={(props) => {
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <HebrewTextField
                                            {...props}
                                            error={ errors && errors.form && errors.form[InteractedContactFields.ADDITIONAL_PHONE_NUMBER]?.message}
                                            disabled={isFieldDisabled || isViewMode}
                                            testId='relationship'
                                            onChange={(newValue: string) => {
                                                props.onChange(newValue)
                                            }}
                                            placeholder='קשר'
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.ISOLATION_PLACE} />
                    <Grid container item xs={5}>
                        <AddressForm
                            unsized={true}
                            disabled={isFieldDisabled ||isViewMode}
                            control={methods.control}
                            watch={watch}
                            errors={isolationAddressErrors}
                            {...addressFormFields}
                        />
                    </Grid>
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.DOES_NEED_HELP_IN_ISOLATION} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION}`}
                            defaultValue={interactedContact.doesNeedHelpInIsolation}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled||isViewMode}
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
                        //error={formErrors && formErrors[InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]}
                        error={ undefined}
                    />
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.DOES_NEED_ISOLATION} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.DOES_NEED_ISOLATION}`}
                            defaultValue={interactedContact.doesNeedIsolation}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || (shouldDisableIdByReopen && interactedContact.doesNeedIsolation === true)||isViewMode}
                                        test-id='doesNeedIsolation'
                                        onChange={(event, booleanValue) => handelOnChangeDoesNeedIsolation(event, booleanValue, props.onChange)}
                                    />
                                )
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        //error={formErrors && formErrors[InteractedContactFields.DOES_NEED_ISOLATION]}
                        error={ undefined}
                    />
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.ISOLATION_END_DATE} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <FormControl variant='outlined' fullWidth>
                            <AlphanumericTextField
                                disabled
                                testId='isolationEndDate'
                                name='isolationEndDate'
                                value={formattedIsolationEndDate}
                                onChange={() => {
                                }}
                            />
                        </FormControl>
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
    // control: any;
    // watch: any
    // formValues: InteractedContact;
    // formErrors?: DeepMap<InteractedContact, FieldError> | any;
    // trigger: () => {};
    //contactStatus: number;
    isViewMode?: boolean;
};
