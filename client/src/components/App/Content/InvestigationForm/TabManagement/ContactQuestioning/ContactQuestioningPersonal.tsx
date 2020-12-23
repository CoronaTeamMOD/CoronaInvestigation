import React, { useState, useEffect } from 'react';
import { differenceInYears } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';
import { Avatar, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import useContactFields from 'Utils/Contacts/useContactFields';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import IdentificationTextField from 'commons/IdentificationTextField/IdentificationTextField';

import useStyles from './ContactQuestioningStyles';
import { ADDITIONAL_PHONE_LABEL } from '../PersonalInfoTab/PersonalInfoTab';

const ContactQuestioningPersonal: React.FC<Props> = (
    props: Props
): JSX.Element => {
    const { control, getValues } = useFormContext();

    const { index, interactedContact } = props;

    const [shouldIdDisable, setShouldIdDisable] = useState<boolean>(false);

    const formValues = getValues().form
        ? getValues().form[index]
        : interactedContact;
    const { isFieldDisabled } = useContactFields(formValues.contactStatus);
    const [isPassport, setIsPassport] = useState<boolean>(
        formValues.identificationType === IdentificationTypes.PASSPORT
    );

    const classes = useStyles();
    const age: number = differenceInYears(
        new Date(),
        new Date(interactedContact.birthDate)
    );
    const contactAge =
        interactedContact.birthDate && !isNaN(age as number)
            ? age === 0
                ? '0'
                : age
            : null;
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
    }, [interactedContact.contactStatus]);

    return (
        <Grid item xs={4}>
            <Grid container direction="column" spacing={4}>
                <Grid container item direction="row" alignItems="center">
                    <Avatar className={classes.avatar}>1</Avatar>
                    <Typography>
                        <b>פרטים אישיים נוספים</b>
                    </Typography>
                </Grid>
                <Grid item container>
                    <FieldName fieldName="תעודה מזהה:" />
                    <Grid item xs={3}>
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.IDENTIFICATION_TYPE}`}
                            defaultValue={formValues.identificationType}
                            render={(props) => {
                                return (
                                    <Toggle
                                        disabled={isFieldDisabled}
                                        test-id="identificationType"
                                        firstOption={IdentificationTypes.ID}
                                        secondOption={IdentificationTypes.PASSPORT}
                                        value={isPassport}
                                        onChange={(event, value) => {
                                            if (value !== null) {
                                                setIsPassport(value);
                                                props.onChange(
                                                    value
                                                        ? IdentificationTypes.PASSPORT
                                                        : IdentificationTypes.ID
                                                );
                                            }
                                        }}
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <FieldName fieldName="מספר תעודה:" />
                    <Grid item xs={3}>
                        <Controller
                            control={control}
                            name={`form[${index}].${InteractedContactFields.IDENTIFICATION_NUMBER}`}
                            defaultValue={
                                interactedContact.identificationNumber
                            }
                            render={(props) => {
                                return (
                                    <IdentificationTextField
                                        {...props}
                                        disabled={shouldIdDisable}
                                        testId="identificationNumber"
                                        onChange={(newValue: string) => {
                                            props.onChange(newValue);
                                        }}
                                        placeholder="מספר תעודה"
                                        className={classes.idTextField}
                                    />
                                );
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container item alignItems="center">
                    <FieldName xs={5} fieldName="תאריך לידה:" />
                    <Controller
                        control={control}
                        name={`form[${index}].${InteractedContactFields.BIRTH_DATE}`}
                        defaultValue={interactedContact.birthDate}
                        render={(props) => {
                            return (
                                <DatePick
                                    {...props}
                                    disabled={isFieldDisabled}
                                    testId="contactBirthDate"
                                    maxDate={new Date()}
                                    useBigCalender={false}
                                    onChange={(newDate: Date) => {
                                        props.onChange(newDate);
                                    }}
                                />
                            );
                        }}
                    />
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName="גיל:" />
                    <AlphanumericTextField
                        disabled={isFieldDisabled}
                        name="age"
                        testId="contactAge"
                        value={contactAge}
                        onChange={() => {}}
                        placeholder="בחר תאריך לידה"
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
                                    disabled={isFieldDisabled}
                                    testId="phoneNumber"
                                    placeholder="הכנס טלפון:"
                                />
                            );
                        }}
                    />
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName={ADDITIONAL_PHONE_LABEL} />
                    <Controller
                        control={control}
                        name={`form[${index}].${InteractedContactFields.ADDITIONAL_PHONE_NUMBER}`}
                        defaultValue={interactedContact.additionalPhoneNumber}
                        render={(props) => {
                            return (
                                <NumericTextField
                                    {...props}
                                    disabled={isFieldDisabled}
                                    testId="additionalPhoneNumber"
                                    onChange={(newValue: string) => {
                                        props.onChange(newValue);
                                    }}
                                    placeholder="הכנס טלפון נוסף:"
                                />
                            );
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ContactQuestioningPersonal;

interface Props {
    index: number;
    interactedContact: InteractedContact;
}
