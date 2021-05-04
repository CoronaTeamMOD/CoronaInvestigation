import { useSelector } from 'react-redux';
import { differenceInYears } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Controller, DeepMap, FieldError } from 'react-hook-form';
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

import useStyles from './ContactQuestioningStyles';

const PHONE_LABEL = 'טלפון';

const ContactQuestioningPersonal: React.FC<Props> = (props: Props): JSX.Element => {

    const { index, interactedContact, currentFormErrors, formValues, control, trigger, watch} = props;

    const identificationTypes = useSelector<StoreStateType, IdentificationType[]>(state => state.identificationTypes);

    const calcAge = (birthDate: Date) => {
        const newAge: number = differenceInYears(new Date(),new Date(birthDate));
        return birthDate && !isNaN(newAge as number)
            ? newAge === 0
                ? '0'
                : String(newAge)
            : ''
    };

    const [shouldIdDisable, setShouldIdDisable] = useState<boolean>(false);
    const [age, setAge] = useState<string>(calcAge(interactedContact.birthDate));
    const [isId, setIsId] = useState<boolean>(false);

    const { isFieldDisabled } = useContactFields(formValues.contactStatus);

    const classes = useStyles();

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableIdByReopen = interactedContact.creationTime
        ? shouldDisableContact(interactedContact.creationTime)
        : false;

    const identificationTypeFieldName = `form[${index}].${InteractedContactFields.IDENTIFICATION_TYPE}`;
    const identificationNumberFieldName = `form[${index}].${InteractedContactFields.IDENTIFICATION_NUMBER}`;    

    const watchIdentificationType = watch(identificationTypeFieldName);
    const watchIdentificationNumber = watch(identificationNumberFieldName);

    useEffect(() => {
        if (watchIdentificationType || watchIdentificationNumber){
            trigger(identificationTypeFieldName);
            trigger(identificationNumberFieldName); 
            setIsId(watchIdentificationType === IdentificationTypesCodes.PALESTINE_ID || watchIdentificationType === IdentificationTypesCodes.ID);
        }
    }, [watchIdentificationType, watchIdentificationNumber]);
        
    useEffect(() => {
        const shouldDisable =
            isFieldDisabled ||
            (shouldDisableIdByReopen &&
                !!interactedContact.identificationNumber);
        setShouldIdDisable(shouldDisable);
    }, [interactedContact.contactStatus, isFieldDisabled]);

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={4}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>1</Avatar>
                    <Typography>
                        <b>פרטים אישיים נוספים</b>
                    </Typography>
                </Grid>
                <Grid item container alignItems='center'>
                    <FieldName fieldName='סוג תעודה מזהה:' />
                    <Grid item xs={3}> 
                        <FormControl fullWidth error={currentFormErrors ? !!(currentFormErrors[InteractedContactFields.IDENTIFICATION_TYPE]) : false}>
                            <Controller
                                control={control}
                                name={`form[${index}].${InteractedContactFields.IDENTIFICATION_TYPE}`}
                                defaultValue={formValues.identificationType?.id}
                                render={(props) => (
                                    <Select
                                        {...props}
                                        disabled={shouldIdDisable}
                                        className={classes.smallSizeText}
                                        onChange={(event) => {
                                            props.onChange(event.target.value)
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
                                )}
                            />
                            {currentFormErrors && currentFormErrors[InteractedContactFields.IDENTIFICATION_TYPE] && <FormHelperText>{requiredText}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <FieldName fieldName='מספר תעודה:' className={classes.fieldNameWithIcon}/>
                    <Grid item xs={3}>
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.IDENTIFICATION_NUMBER}`}
                            defaultValue={
                                interactedContact.identificationNumber
                            }
                            max={9}
                            render={(props) => {
                                return (
                                    <IdentificationTextField
                                        {...props}
                                        error={(currentFormErrors && currentFormErrors[InteractedContactFields.IDENTIFICATION_NUMBER]?.message ) || ''}
                                        disabled={shouldIdDisable}
                                        testId='identificationNumber'
                                        onChange={(newValue: string) => {
                                            props.onChange(newValue);
                                        }}
                                        placeholder='מספר תעודה'
                                        className={classes.idTextField}
                                        isId={isId}
                                    />
                                );
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container item alignItems='center'>
                    <FieldName xs={5} fieldName='תאריך לידה:' />
                    <Controller
                        control={control}
                        name={`form[${index}].${InteractedContactFields.BIRTH_DATE}`}
                        defaultValue={interactedContact.birthDate}
                        render={(props) => {
                            const dateError = currentFormErrors && currentFormErrors[InteractedContactFields.BIRTH_DATE]?.message;
                            return (
                                <DatePick
                                    {...props}
                                    disabled={isFieldDisabled}
                                    testId='contactBirthDate'
                                    maxDate={new Date()}
                                    maxDateMessage='תאריך לידה לא יכול להיות יותר מאוחר מהיום'
                                    useBigCalender={false}
                                    labelText={dateError ? invalidDateText : 'תאריך לידה'}
                                    error={Boolean(dateError)}
                                    onChange={(newDate: Date) => {
                                        props.onChange(newDate);
                                        setAge(calcAge(newDate));
                                    }}
                                />
                            );
                        }}
                    />
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName='גיל:' />
                    <AlphanumericTextField
                        disabled={true}
                        name='age'
                        testId='contactAge'
                        value={age}
                        onChange={() => {}}
                        placeholder='בחר תאריך לידה'
                    />
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName={PHONE_LABEL} />
                    <Controller
                        control={control}
                        name={`form[${index}].${InteractedContactFields.PHONE_NUMBER}`}
                        defaultValue={interactedContact.phoneNumber}
                        render={(props) => {
                            return (
                                <NumericTextField
                                    {...props}
                                    error={currentFormErrors && currentFormErrors[InteractedContactFields.PHONE_NUMBER]?.message}
                                    disabled={isFieldDisabled}
                                    testId='phoneNumber'
                                    placeholder='הכנס טלפון:'
                                />
                            );
                        }}
                    />
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <Typography >
                            <b>אירועים בהם בא המגע עם המאומת</b>
                        </Typography>
                    </Grid>
                    {
                        interactedContact.contactEvents.map((event) => {
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
                    <Grid item xs={12}>
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.EXTRA_INFO}`}
                            defaultValue={interactedContact.extraInfo}
                            render={(props) => {
                                return (
                                    <AlphanumericTextField
                                        {...props}
                                        disabled={isFieldDisabled}
                                        testId='extrainfo'
                                        onChange={(newValue: string) => {
                                            props.onChange(newValue)
                                        }}
                                        placeholder='הערות נוספות'
                                />)
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ContactQuestioningPersonal;

interface Props {
    index: number;
    interactedContact: GroupedInteractedContact;
    control: any;
    formValues: InteractedContact;
    trigger: (fieldname : string) => {};
    currentFormErrors?: DeepMap<InteractedContact, FieldError>;
    watch: any;
};