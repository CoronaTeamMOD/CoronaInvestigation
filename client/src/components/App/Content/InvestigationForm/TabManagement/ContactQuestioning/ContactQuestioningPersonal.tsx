import { differenceInYears } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Avatar, Grid, Typography, Select, MenuItem } from '@material-ui/core';
import { Controller, DeepMap, FieldError } from 'react-hook-form';

import DatePick from 'commons/DatePick/DatePick';
import formatDate from 'Utils/DateUtils/formatDate';
import FieldName from 'commons/FieldName/FieldName';
import HelpIcon from 'commons/Icons/HelpIcon/HelpIcon';
import InteractedContact from 'models/InteractedContact';
import { invalidDateText } from 'commons/Schema/messages';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import useContactFields from 'Utils/Contacts/useContactFields';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import NumericTextField from 'commons/NoContextElements/NumericTextField';
import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';
import IdentificationTextField from 'commons/NoContextElements/IdentificationTextField';

import useStyles from './ContactQuestioningStyles';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

const passportInfoMessage = 'ניתן להזין בשדה דרכון 10 תווים/ 15 תווים ו-/';
const idInfoMessage = 'ניתן להזין בשדה תז עד 9 תווים'

const ContactQuestioningPersonal: React.FC<Props> = (
    props: Props
): JSX.Element => {
    const { index, interactedContact, currentFormErrors, formValues, control, trigger } = props;

    const [staticFieldsChange, setStaticFieldsChange] = useState<boolean>(false);
    
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

    const { isFieldDisabled } = useContactFields(formValues.contactStatus);
    const [isPassport, setIsPassport] = useState<boolean>(
        formValues.identificationType === IdentificationTypes.PASSPORT
    );

    const classes = useStyles();
    const idTooltipText = isPassport ? passportInfoMessage : idInfoMessage;
    const PHONE_LABEL = 'טלפון';

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableIdByReopen = interactedContact.creationTime
        ? shouldDisableContact(interactedContact.creationTime)
        : false;

    useEffect(() => {
        const shouldDisable =
            isFieldDisabled ||
            (shouldDisableIdByReopen &&
                !!interactedContact.identificationNumber);
        setShouldIdDisable(shouldDisable);
    }, [interactedContact.contactStatus, isFieldDisabled]);

    useEffect(() => {
        trigger(`form[${index}].${InteractedContactFields.IDENTIFICATION_NUMBER}`)
    }, [isPassport]);

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
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.IDENTIFICATION_TYPE}`}
                            defaultValue={formValues.identificationType}
                            render={(props) => (
                                <Select
                                    {...props}
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
                                    {Object.values(IdentificationTypes).map((identificationType: string) => (
                                        <MenuItem
                                            className={classes.smallSizeText}
                                            key={identificationType}
                                            value={identificationType}>
                                            {identificationType}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Grid>
                    <FieldName 
                        fieldName='מספר תעודה:' 
                        className={classes.fieldNameWithIcon}
                        appendantLabelIcon={
                            <HelpIcon 
                                title={idTooltipText} 
                                isWarning={
                                    Boolean(currentFormErrors && currentFormErrors[InteractedContactFields.IDENTIFICATION_NUMBER])
                                } 
                            />
                        }
                    />
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
                                        isPassport={isPassport}
                                        disabled={shouldIdDisable}
                                        testId='identificationNumber'
                                        onChange={(newValue: string) => {
                                            props.onChange(newValue);
                                        }}
                                        placeholder='מספר תעודה'
                                        className={classes.idTextField}
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
                                    maxDateMessage='תאריך לידה לא יכול להיות יותר גדול מהיום'
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
}
