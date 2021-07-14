import { useSelector, useDispatch } from 'react-redux';
import { differenceInYears } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Controller, DeepMap, FieldError, useFormContext } from 'react-hook-form';
import { Avatar, Grid, Typography, Select, MenuItem, FormHelperText, FormControl } from '@material-ui/core';


import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import IdentificationType from 'models/IdentificationType';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import useContactFields from 'Utils/Contacts/useContactFields';
import InteractedContactFields from 'models/enums/InteractedContact';
import { invalidDateText, requiredText } from 'commons/Schema/messages';
import NumericTextField from 'commons/NoContextElements/NumericTextField';
import IdentificationTypesCodes from 'models/enums/IdentificationTypesCodes';
import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';
import IdentificationTextField from 'commons/NoContextElements/IdentificationTextField';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import useContactQuestioning from './useContactQuestioning';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningFieldsNames from './ContactQuestioningFieldsNames';
import { FormInputs } from './ContactQuestioningInterfaces';
import { ErrorSharp } from '@material-ui/icons';
import { setInteractedContact } from 'redux/InteractedContacts/interactedContactsActionCreators';

const ContactQuestioningPersonal: React.FC<Props> = (props: Props): JSX.Element => {
    const interactedContacts = useSelector<StoreStateType, GroupedInteractedContact[]>(state => state.interactedContacts.interactedContacts);


    const { errors, watch, ...methods } = useFormContext<GroupedInteractedContact>();
    const { interactedContact, isViewMode } = props;

    const dispatch = useDispatch();
    const identificationTypes = useSelector<StoreStateType, IdentificationType[]>(state => state.identificationTypes);

    const calcAge = (birthDate: Date) => {
        const newAge: number = differenceInYears(new Date(), new Date(birthDate));
        return birthDate && !isNaN(newAge as number)
            ? newAge === 0
                ? '0'
                : String(newAge)
            : ''
    };

    const [shouldIdDisable, setShouldIdDisable] = useState<boolean>(false);

    const [age, setAge] = useState<string>(calcAge(interactedContact.birthDate));
    const [isId, setIsId] = useState<boolean>(false);

    const { isFieldDisabled } = useContactFields(methods.getValues("contactStatus"));
    const classes = useStyles();

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableIdByReopen = interactedContact.creationTime
        ? shouldDisableContact(interactedContact.creationTime)
        : false;

    const identificationTypeFieldName = `${InteractedContactFields.IDENTIFICATION_TYPE}`;
    const identificationNumberFieldName = `${InteractedContactFields.IDENTIFICATION_NUMBER}`;

    const watchIdentificationType = watch(identificationTypeFieldName);
    const watchIdentificationNumber = watch(identificationNumberFieldName);

    useEffect(() => {
        methods.trigger();
        const shouldDisable =
            (shouldDisableIdByReopen &&
                !!interactedContact.identificationNumber);
        setShouldIdDisable(shouldDisable);
    }, []);

    useEffect(() => {
        if (watchIdentificationType || watchIdentificationNumber) {
            methods.trigger(identificationTypeFieldName);
            methods.trigger(identificationNumberFieldName);
            setIsId(watchIdentificationType === IdentificationTypesCodes.PALESTINE_ID || watchIdentificationType === IdentificationTypesCodes.ID);

        }
    }, [watchIdentificationType, watchIdentificationNumber]);


    const validateIdentityData = (id: number, identityType: number, identityNumber: string) => {
        let duplicate = [];
        if (id && identityType && identityNumber) {
            duplicate = interactedContacts.filter(contact => {
                return id !== contact.id && identityType === contact.identificationType?.id && identityNumber === contact.identificationNumber;
            })
        }

        return duplicate.length == 0;
    }

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={2}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>1</Avatar>
                    <Typography>
                        <b>פרטים אישיים נוספים</b>
                    </Typography>
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.IDENTIFICATION_TYPE} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.IDENTIFICATION_TYPE}`}
                            defaultValue={interactedContact.identificationType?.id}
                            render={(props) => (
                                <FormControl
                                    error={errors ? !!((errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.IDENTIFICATION_TYPE]) : false}
                                    variant='outlined'
                                    fullWidth
                                >
                                    <Select
                                        {...props}
                                        disabled={isFieldDisabled || shouldIdDisable || isViewMode}
                                        onChange={(event) => {
                                            if (validateIdentityData(interactedContact.id, event.target.value as number, methods.getValues("identificationNumber"))) {
                                                props.onChange(event.target.value);
                                                let identityObject = identificationTypes.find(obj => obj.id == event.target.value);
                                                dispatch(setInteractedContact(interactedContact.id, 'identificationType', identityObject as IdentificationType, methods.formState));
                                            }
                                            else {
                                                methods.setError(InteractedContactFields.IDENTIFICATION_TYPE, { message: "מזהה זה כבר קיים" });
                                            }
                                        }}
                                        MenuProps={{
                                            anchorOrigin: {
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            },
                                            transformOrigin: {
                                                vertical: 'top',
                                                horizontal: 'left'
                                            },
                                            getContentAnchorEl: null
                                        }}
                                    >
                                        {Object.values(identificationTypes).map((identificationType: IdentificationType) => (
                                            <MenuItem
                                                className={classes.smallSizeText}
                                                key={identificationType.id}
                                                value={identificationType.id}>
                                                {identificationType.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        {errors && <FormHelperText>{(errors as any)[InteractedContactFields.IDENTIFICATION_TYPE]?.message}</FormHelperText>}
                        {/* {errors && (errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.IDENTIFICATION_TYPE] && <FormHelperText>{requiredText}</FormHelperText>} */}
                    </Grid>
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.IDENTIFICATION_NUMBER} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.IDENTIFICATION_NUMBER}`}
                            defaultValue={
                                interactedContact.identificationNumber
                            }
                            render={(props) => {
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <IdentificationTextField
                                            {...props}
                                            error={(errors && (errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.IDENTIFICATION_NUMBER]?.message) || ''}
                                            disabled={isFieldDisabled || shouldIdDisable || isViewMode}
                                            testId='identificationNumber'
                                            onChange={(newValue: string) => {
                                                props.onChange(newValue);

                                            }}
                                            onBlur={() => {
                                                if (validateIdentityData(interactedContact.id, methods.getValues("identificationType") as any, methods.getValues("identificationNumber"))) {
                                                    dispatch(setInteractedContact(interactedContact.id, 'identificationNumber', methods.getValues("identificationNumber"), methods.formState))
                                                }
                                                else {
                                                    methods.setError(InteractedContactFields.IDENTIFICATION_NUMBER, { message: "מזהה זה כבר קיים" });
                                                }
                                            }}
                                            placeholder='מספר תעודה'
                                            isId={isId}
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item alignItems='center'>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.BIRTH_DATE} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.BIRTH_DATE}`}
                            defaultValue={interactedContact.birthDate}
                            render={(props) => {
                                const dateError = errors && (errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.BIRTH_DATE]?.message;
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <DatePick
                                            {...props}
                                            disabled={isFieldDisabled || isViewMode}
                                            testId='contactBirthDate'
                                            maxDate={new Date()}
                                            maxDateMessage='תאריך לידה לא יכול להיות יותר מאוחר מהיום'
                                            useBigCalender={false}
                                            labelText={dateError ? invalidDateText : undefined}
                                            error={Boolean(dateError)}
                                            onChange={(newDate: Date) => {
                                                props.onChange(newDate);
                                                setAge(calcAge(newDate));
                                                dispatch(setInteractedContact(interactedContact.id, 'birthDate', newDate, methods.formState));

                                            }}
                                        />
                                    </FormControl>
                                );
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.AGE} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <FormControl variant='outlined' fullWidth>
                            <AlphanumericTextField
                                disabled={true}
                                name='age'
                                testId='contactAge'
                                value={age}
                                onChange={() => { }}
                                placeholder='בחר תאריך לידה'
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.PHONE} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.PHONE_NUMBER}`}
                            defaultValue={interactedContact.phoneNumber}
                            render={(props) => {
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <NumericTextField
                                            {...props}
                                            error={errors && (errors as DeepMap<InteractedContact, FieldError>)[InteractedContactFields.PHONE_NUMBER]?.message}
                                            disabled={isFieldDisabled || isViewMode}
                                            testId='phoneNumber'
                                            placeholder='הכנס טלפון:'
                                            onBlur={() => dispatch(setInteractedContact(interactedContact.id, 'phoneNumber', methods.getValues('phoneNumber'), methods.formState))}
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container item>
                    <Grid item xs={12}>
                        <Typography >
                            <b>אירועים בהם בא המגע עם המאומת</b>
                        </Typography>
                    </Grid>
                    {
                        interactedContact.contactEvents.map((event: any) => {
                            return (
                                <Grid container item xs={12} className={classes.eventRow}>
                                    <Grid item>
                                        <Typography>
                                            {formatDate(event.date)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {event.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </Grid>

                <Grid container item>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.EXTRA_INFO} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.EXTRA_INFO}`}
                            defaultValue={interactedContact.extraInfo}
                            render={(props) => {
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <AlphanumericTextField
                                            {...props}
                                            testId='extrainfo'
                                            onChange={(newValue: string) => {
                                                props.onChange(newValue)
                                            }}
                                            onBlur={() => {
                                                dispatch(setInteractedContact(interactedContact.id, 'extraInfo', methods.getValues('extraInfo'), methods.formState));
                                            }
                                            }
                                            placeholder='הערות נוספות'
                                            disabled={isViewMode}
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

}
export default ContactQuestioningPersonal;

interface Props {
    interactedContact: GroupedInteractedContact;
    isViewMode?: boolean;
};