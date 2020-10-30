import React from 'react';
import { differenceInYears } from 'date-fns';
import { Avatar, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';
import { ADDITIONAL_PHONE_LABEL } from '../PersonalInfoTab/PersonalInfoTab';

const ContactQuestioningPersonal: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { interactedContact, changeIdentificationType, updateInteractedContact } = props;

    const age: number = differenceInYears(new Date(), new Date(interactedContact.birthDate));
    const contactAge = interactedContact.birthDate && !isNaN(age as number) ? age === 0 ? '0' : age : null;

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={4}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>1</Avatar>
                    <Typography><b>פרטים אישיים נוספים</b></Typography>
                </Grid>
                <Grid item container>
                    <FieldName fieldName='תעודה מזהה:'/>
                    <Grid item xs={3}>
                        <Toggle
                            test-id='identificationType'
                            firstOption='ת.ז'
                            secondOption='דרכון'
                            value={interactedContact.identificationType !== IdentificationTypes.ID}
                            onChange={(event, value) => value !== null && changeIdentificationType(interactedContact, value)}
                        />
                    </Grid>
                    <FieldName fieldName='מספר תעודה:'/>
                    <Grid item xs={3}>
                        <AlphanumericTextField
                            testId='identificationNumber'
                            name={InteractedContactFields.IDENTIFICATION_NUMBER}
                            value={interactedContact.identificationNumber}
                            onChange={(newValue: string) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_NUMBER, newValue as string
                            )}
                            placeholder='מספר תעודה'
                            className={classes.idTextField}
                        />
                    </Grid>
                </Grid>
                <Grid container item alignItems='center'>
                    <FieldName xs={5} fieldName='תאריך לידה:'/>
                     <DatePick
                         testId='contactBirthDate'
                         maxDate={new Date()}
                            useBigCalender={false}
                            value={interactedContact.birthDate}
                            onChange={(newDate: Date) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.BIRTH_DATE, newDate)
                            }
                        />
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName='גיל:'/>
                        <AlphanumericTextField
                            name='age'
                            testId='contactAge'
                            value={contactAge}
                            onChange={() => {}}
                            placeholder='בחר תאריך לידה'
                        />
                </Grid>
                <Grid container item>
                    <FieldName xs={5} fieldName={ADDITIONAL_PHONE_LABEL}/>
                     <NumericTextField
                         testId='additionalPhoneNumber'
                         name={InteractedContactFields.ADDITIONAL_PHONE_NUMBER}
                            value={interactedContact.additionalPhoneNumber}
                            onChange={(newValue: string) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.ADDITIONAL_PHONE_NUMBER, newValue)
                            }
                            placeholder='הכנס טלפון:'
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

export default ContactQuestioningPersonal;

interface Props {
    interactedContact: InteractedContact;
    updateInteractedContact: (interactedContact: InteractedContact, fieldToUpdate: InteractedContactFields, value: any) => void;
    changeIdentificationType: (interactedContact: InteractedContact, booleanValue: boolean) => void;
};
