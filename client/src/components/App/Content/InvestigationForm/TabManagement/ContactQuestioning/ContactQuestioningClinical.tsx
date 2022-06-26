import React, { useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { Controller, DeepMap, FieldError, useFormContext } from 'react-hook-form';
import { Avatar, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

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
import ContactStatusCodes from 'models/enums/ContactStatusCodes';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningFieldsNames from './ContactQuestioningFieldsNames';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import { setInteractedContact } from 'redux/InteractedContacts/interactedContactsActionCreators';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import Country from 'models/Country';
import { Autocomplete } from '@material-ui/lab';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { ALPHANUMERIC_RICH_TEXT_REGEX } from 'commons/Regex/Regex';
import { alphaNumericSpecialCharsErrorMessage, max400LengthErrorMessage } from 'commons/Schema/messages';
import * as yup from 'yup';
import { checkForContactsFromAboardId } from 'services/contactQuestioning.service';
import { setInvestigationContactFromAboardId } from 'redux/Investigation/investigationActionCreators';
import TabNames from 'models/enums/TabNames';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {

    const { errors, watch, ...methods } = useFormContext<GroupedInteractedContact>();

    const { familyRelationships, interactedContact, isFamilyContact, isViewMode, ifContactNeedIsolation } = props;

    const classes = useStyles();

    const dispatch = useDispatch()

    const { shouldDisableContact } = useStatusUtils();

    const shouldDisableIdByReopen = interactedContact.creationTime
        ? shouldDisableContact(interactedContact.creationTime)
        : false;

    const { alertError, alertWarning } = useCustomSwal();

    const { isFieldDisabled, validateContact } = useContactFields(methods.getValues("contactStatus"));

    const daysToIsolate = 14;
    const isolationEndDate = addDays(new Date(interactedContact.contactDate), daysToIsolate);
    const formattedIsolationEndDate = format(new Date(isolationEndDate), 'dd/MM/yyyy');

    const countries = useSelector<StoreStateType, Map<string, Country>>((state) => state.countries);
    const countryOptions = Array.from(countries).map(([name, value]) => value);

    const isolationAddressErrors = errors && (errors[InteractedContactFields.ISOLATION_ADDRESS] as DeepMap<FlattenedDBAddress, FieldError>);

    const addressFormFields: AddressFormFields = {
        cityField: {
            name: `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`,
            className: classes.addressTextField,
            testId: 'contactedPersonCity',
            defaultValue: interactedContact.isolationAddress?.city?.id || interactedContact.isolationAddress?.city
        },
        streetField: {
            name: `${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`,
            className: classes.addressTextField,
            defaultValue: interactedContact.isolationAddress?.street?.id || interactedContact.isolationAddress?.street || null
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

    const isInvestigationComplited = interactedContact.contactStatus === ContactStatusCodes.COMPLETED
    const isUnreachable = interactedContact.contactStatus === ContactStatusCodes.CANT_REACH
    const isUncooperative = interactedContact.contactStatus === ContactStatusCodes.DONT_COOPERATE

    const formatContactToValidate = () => {
        return {
            ...interactedContact,
            firstName: interactedContact.firstName,
            lastName: interactedContact.lastName,
            contactType: interactedContact.contactType,
        }
    };

    const isIdAndPhoneNumValid = (): boolean => {
        const isDoesNeedIsolationIsTheLastFormError = errors && Object.keys(errors).length === 1 && Object.keys(errors)[0] === 'doesNeedIsolation'
        if (errors && Object.keys(errors).length != 0 && !isDoesNeedIsolationIsTheLastFormError) {
            return Boolean(errors.id) || Boolean(errors.phoneNumber)
        }
        return true;
    };

    const stringAlphabet = yup
        .string()
        .matches(ALPHANUMERIC_RICH_TEXT_REGEX, alphaNumericSpecialCharsErrorMessage)
        .max(400, max400LengthErrorMessage);


    useEffect(() => {
        methods.trigger();
    }, []);

    const handleIsolation = (value: boolean, onChange: (...event: any[]) => void) => {
        const contactWithIsolationRequirement = { ...formatContactToValidate(), doesNeedIsolation: value };
        const contactValidation = validateContact(contactWithIsolationRequirement, ValidationReason.HANDLE_ISOLATION);
        if (!contactValidation.valid) {
            alertError(contactValidation.error)
        } else if (!isIdAndPhoneNumValid()) {
            alertError('ישנם שדות לא תקינים ולכן לא ניתן להקים דיווח בידוד');
        } else {
            if (value) {
                alertWarning('האם להקים דיווח בידוד?', {
                    showCancelButton: true,
                    cancelButtonText: 'בטל',
                    cancelButtonColor: theme.palette.error.main,
                    confirmButtonColor: theme.palette.primary.main,
                    confirmButtonText: 'כן, המשך',
                }).then((result) => {
                    if (result.value) {
                        onChange(true);
                        dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_NEED_ISOLATION, true));
                    }
                })
            }
            else {
                onChange(false);
                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_NEED_ISOLATION, false));
            }
        }
    };

    const handelOnChangeDoesNeedIsolation = (event: any, booleanValue: boolean, onChange: (...event: any[]) => void) => {
        if (booleanValue === false || isInvestigationComplited || isUnreachable || isUncooperative) {
            onChange(booleanValue);
            dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_NEED_ISOLATION, booleanValue));
        }

        if (booleanValue === true && !isInvestigationComplited && !isUncooperative && !isUnreachable) {
            handleIsolation(booleanValue, onChange);
        }
    }
    const resetIsStayAnotherCountryFields = () => {
        methods.setValue(InteractedContactFields.TRANSIT_DATE, null);
        dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.TRANSIT_DATE, null));
        methods.setValue(InteractedContactFields.FROM_COUNTRY, null);
        dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.FROM_COUNTRY, null));
        methods.setValue(InteractedContactFields.OVERSEAS_COMMENTS, '');
        dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.OVERSEAS_COMMENTS, ''));
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
                                                props.onChange(event.target.value);
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.FAMILY_RELATIONSHIP, event.target.value as number));
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
                                            error={errors && errors[InteractedContactFields.RELATIONSHIP]?.message}
                                            disabled={isFieldDisabled || isViewMode}
                                            testId='relationship'
                                            onChange={(newValue: string) => {
                                                props.onChange(newValue)
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.RELATIONSHIP, newValue));
                                            }}
                                            onBlur={() => {
                                                props.onBlur();
                                            }}
                                            placeholder='קשר'
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                {ifContactNeedIsolation &&
                    <>

                        <Grid container item>
                            <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.ISOLATION_PLACE} />
                            <Grid container item xs={5}>
                                <AddressForm
                                    unsized={true}
                                    disabled={isFieldDisabled || isViewMode}
                                    control={methods.control}
                                    watch={watch}
                                    errors={isolationAddressErrors}
                                    onBlur={() => { dispatch(setInteractedContact(interactedContact.id, 'isolationAddress', methods.getValues().isolationAddress)) }}
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
                                                disabled={isFieldDisabled || isViewMode}
                                                test-id='doesNeedHelpInIsolation'
                                                onChange={(event, booleanValue) => {
                                                    if (booleanValue !== null) {
                                                        props.onChange(booleanValue);
                                                        dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION, booleanValue));
                                                    }
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </Grid>
                            <InlineErrorText
                                error={errors && errors[InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION]}
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
                                                disabled={isFieldDisabled || (shouldDisableIdByReopen && interactedContact.doesNeedIsolation === true) || isViewMode}
                                                test-id='doesNeedIsolation'
                                                onChange={(event, booleanValue) => handelOnChangeDoesNeedIsolation(event, booleanValue, props.onChange)}
                                            />
                                        )
                                    }}
                                />
                            </Grid>
                            <InlineErrorText
                                error={errors && errors[InteractedContactFields.DOES_NEED_ISOLATION]}
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
                                        onChange={() => { }}
                                        onBlur={() => { }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                }
                <Grid item container>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.IS_STAY_ANOTHER_COUNTRY} className={classes.fieldName} />
                    <Controller
                        control={methods.control}
                        name={`${InteractedContactFields.IS_STAY_ANOTHER_COUNTRY}`}
                        defaultValue={interactedContact.isStayAnotherCountry}
                        render={(props) => {
                            return (
                                <Toggle
                                    {...props}
                                    disabled={ isFieldDisabled || isViewMode }
                                    test-id='isStayAnotherCountry'
                                    onChange={(event, booleanValue) => {
                                        if (booleanValue !== null) {
                                            props.onChange(booleanValue);
                                            dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.IS_STAY_ANOTHER_COUNTRY, booleanValue));
                                            if (booleanValue === false){
                                                resetIsStayAnotherCountryFields();
                                            }
                                            const investigationContactFromAboardId = checkForContactsFromAboardId(TabNames.CONTACT_QUESTIONING);
                                            if (investigationContactFromAboardId) {
                                                dispatch(setInvestigationContactFromAboardId(investigationContactFromAboardId));
                                            } 
                                        }
                                    }}
                                />
                            )
                        }}
                    />

                    <InlineErrorText
                        error={errors && errors[InteractedContactFields.IS_STAY_ANOTHER_COUNTRY]}
                    />
                </Grid>

                {interactedContact.isStayAnotherCountry == true &&
                    <>

                        <Grid container item alignItems='center'>
                            <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.TRANSIT_DATE} className={classes.fieldName} />
                            <Grid item xs={5}>
                                <Controller
                                    control={methods.control}
                                    name={`${InteractedContactFields.TRANSIT_DATE}`}
                                    defaultValue={interactedContact.transitDate}
                                    render={(props) => {
                                        return (
                                            <FormControl variant='outlined' fullWidth>
                                                <DatePick
                                                    {...props}
                                                    disabled={ isFieldDisabled || isViewMode }
                                                    testId='transitDate'
                                                    labelText={errors[InteractedContactFields.TRANSIT_DATE] ? errors[InteractedContactFields.TRANSIT_DATE]?.message : ''}
                                                    useBigCalender={false}
                                                    error={Boolean(errors && errors[InteractedContactFields.TRANSIT_DATE])}
                                                    onChange={(newDate: Date) => {
                                                        props.onChange(newDate);
                                                        dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.TRANSIT_DATE, methods.getValues(InteractedContactFields.TRANSIT_DATE)));
                                                    }}
                                                />
                                            </FormControl>
                                        );
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.FROM_COUNTRY} className={classes.fieldName} />
                            <Grid item xs={5}>
                                <Controller
                                    control={methods.control}
                                    name={`${InteractedContactFields.FROM_COUNTRY}`}
                                    defaultValue={interactedContact.fromCountry}
                                    render={(props) => {
                                        return (
                                            <Autocomplete
                                                options={countryOptions}
                                                getOptionLabel={(option: Country) => option.displayName}
                                                value={props.value}
                                                onChange={(e, value) => {
                                                    props.onChange(value);
                                                    dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.FROM_COUNTRY, value))
                                                }
                                                }
                                                renderInput={(params) =>
                                                    <TextField
                                                        label={ContactQuestioningFieldsNames.FROM_COUNTRY}
                                                        {...params}
                                                        placeholder={ContactQuestioningFieldsNames.FROM_COUNTRY}
                                                        error={errors && Boolean(errors[InteractedContactFields.FROM_COUNTRY])}
                                                    />}
                                                disabled={isFieldDisabled || isViewMode}
                                            />
                                        );
                                    }}
                                />

                            </Grid>
                        </Grid>
                        <Grid container item>
                            <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.OVERSEAS_COMMENTS} className={classes.fieldName} />
                            <Grid item xs={5}>
                                <Controller
                                    control={methods.control}
                                    name={`${InteractedContactFields.OVERSEAS_COMMENTS}`}
                                    defaultValue={interactedContact.overseasComments}
                                    render={(props) => {
                                        return (
                                            <FormControl variant='outlined' fullWidth>
                                                <TypePreventiveTextField
                                                    {...props}
                                                    testId='overseasComments'
                                                    validationSchema={stringAlphabet}
                                                    onChange={(newValue: string) => {
                                                        props.onChange(newValue)
                                                    }}
                                                    onBlur={() => dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.OVERSEAS_COMMENTS, methods.getValues(InteractedContactFields.OVERSEAS_COMMENTS)))}
                                                    placeholder={ContactQuestioningFieldsNames.OVERSEAS_COMMENTS}
                                                    disabled={isFieldDisabled || isViewMode}
                                                />
                                            </FormControl>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </>}
            </Grid>
        </Grid>
    )
};

export default ContactQuestioningClinical;

interface Props {
    familyRelationships: FamilyRelationship[];
    interactedContact: InteractedContact;
    isFamilyContact: boolean;
    isViewMode?: boolean;
    ifContactNeedIsolation?: boolean;
};
