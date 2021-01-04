import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { addDays, format } from 'date-fns';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useFormContext } from 'react-hook-form';
import { Avatar, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core';

import City from 'models/City';
import theme from 'styles/theme';
import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import {getStreetByCity} from 'Utils/Address/AddressUtils';
import Street from 'models/Street';
import InteractedContactFields from 'models/enums/InteractedContact';
import HebrewTextField from 'commons/HebrewTextField/HebrewTextField';
import useContactFields, { ValidationReason } from 'Utils/Contacts/useContactFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';
import AddressForm from 'commons/Forms/AddressForm/AddressForm';

const emptyFamilyRelationship: FamilyRelationship = {
    id: null as any,
    displayName: '',
};

const ContactQuestioningClinical: React.FC<Props> = (props: Props): JSX.Element => {
    const {control , getValues , watch , errors} = useFormContext();
    const { index, familyRelationships, interactedContact, isFamilyContact } = props;

    const classes = useStyles();

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const [streetsInCity, setStreetsInCity] = React.useState<Map<string, Street>>(new Map());
    const watchAddress = watch(`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}`);

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableIdByReopen = interactedContact.creationTime ?
        shouldDisableContact(interactedContact.creationTime) : false;

    const { alertError, alertWarning } = useCustomSwal();

    const formValues = getValues().form ? getValues().form[index] : interactedContact;
    const { isFieldDisabled, validateContact } = useContactFields(formValues.contactStatus);

    const daysToIsolate = 14;
    const isolationEndDate = addDays(new Date(interactedContact.contactDate), daysToIsolate);
    const formattedIsolationEndDate = format(new Date(isolationEndDate), 'dd/MM/yyyy');

    useEffect(() => {
        if (watchAddress?.city) {
            getStreetByCity(formValues.isolationAddress.city, setStreetsInCity);
        } else {
            setStreetsInCity(new Map())
        }
    }, [watchAddress?.city]);

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
                                cityField={{name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`, className: classes.addressTextField, testId: 'contactedPersonCity'}}
                                streetField={{name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`, className: classes.addressTextField}}
                                houseNumberField={{name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`}}
                                floorField={{name: `form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`}}
                            />
                            {/* <Controller
                                control={control}
                                name={`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_CITY}`}
                                defaultValue={interactedContact.isolationAddress?.city?.id}
                                render={(props) => {
                                    return (
                                        <Autocomplete className={classes.addressTextField}
                                            disabled={isFieldDisabled}
                                            value={props.value && {id: props.value as string, value: cities.get(props.value) as City}}
                                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                            getOptionLabel={(option) => option?.value ? option.value.displayName : ''}
                                            onChange={(event, selectedCity) => props.onChange(selectedCity?.id)}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    test-id='contactedPersonCity'
                                                    placeholder='עיר'
                                                />
                                            }
                                        />
                                    )
                                }}
                            />
                            <Controller
                                control={control}
                                name={`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_STREET}`}
                                defaultValue={interactedContact.isolationAddress?.street?.id}
                                render={(props) => (
                                    <Autocomplete className={classes.addressTextField}
                                        options={Array.from(streetsInCity, ([id, value]) => ({ id, value }))}
                                        getOptionLabel={(option) => option?.value?.displayName || ''}
                                        value={props.value && {id: props.value as string, value: streetsInCity.get(props.value) as Street}}
                                        onChange={(event, selectedStreet) => {
                                            props.onChange(selectedStreet?.id || '')
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                placeholder='רחוב'
                                            />
                                        }
                                    />
                                )}
                            /> */}
                            {/* <Controller
                                control={control}
                                name={`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}`}
                                defaultValue={interactedContact.isolationAddress?.houseNum}
                                render={(props) => (
                                    <AlphanumericTextField className={classes.addressTextField}
                                        name={InteractedContactFields.CONTACTED_PERSON_HOUSE_NUMBER}
                                        value={props.value}
                                        onChange={props.onChange}
                                        onBlur={props.onBlur}
                                        placeholder='מספר בית'
                                    />
                                )}
                            /> */}
                            {/* <Controller
                                control={control}
                                name={`form[${index}].${InteractedContactFields.ISOLATION_ADDRESS}.${InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}`}
                                defaultValue={interactedContact.isolationAddress?.apartment}
                                render={(props) => (
                                    <AlphanumericTextField className={classes.addressTextField}
                                        name={InteractedContactFields.CONTACTED_PERSON_APARTMENT_NUMBER}
                                        value={props.value}
                                        onChange={props.onChange}
                                        onBlur={props.onBlur}
                                        placeholder='מספר דירה'
                                    />
                                )}
                            /> */}
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
