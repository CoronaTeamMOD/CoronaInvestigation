import React from 'react';
import { useForm } from 'react-hook-form';
import { differenceInYears } from 'date-fns';
import { Avatar, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import FormInput from 'commons/FormInput/FormInput';
import InteractedContact from 'models/InteractedContact';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractedContactFields from 'models/enums/InteractedContact';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from './ContactQuestioningStyles';
import { ADDITIONAL_PHONE_LABEL } from '../PersonalInfoTab/PersonalInfoTab';
import NumericTextField from "../../../../../../commons/NumericTextField/NumericTextField";

const ContactQuestioningPersonal: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const { errors, setError, clearErrors } = useForm({});

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
                    <Grid item xs={3}>
                        <Typography variant='body2' className={classes.text}><b>תעודה מזהה:</b></Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Toggle
                            firstOption={'ת.ז'}
                            secondOption={'דרכון'}
                            value={interactedContact.identificationType !== IdentificationTypes.ID}
                            onChange={(event, value) => changeIdentificationType(interactedContact, value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='body2' className={classes.text}><b>מספר תעודה:</b></Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <AlphanumericTextField
                            name={InteractedContactFields.IDENTIFICATION_NUMBER}
                            placeholder='מספר תעודה'
                            className={classes.idTextField}
                            value={interactedContact.identificationNumber}
                            onChange={(newValue: string) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.IDENTIFICATION_NUMBER, newValue as string
                                )}
                            setError={setError}
                            clearErrors={clearErrors}
                            errors={errors}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <FormInput fieldName='תאריך לידה'>
                        <DatePick
                            maxDate={new Date()}
                            useBigCalender={false}
                            value={interactedContact.birthDate}
                            onChange={(newDate: Date) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.BIRTH_DATE, newDate)
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item>
                    <FormInput fieldName='גיל'>
                        <AlphanumericTextField
                            name={'age'}
                            placeholder={'בחר תאריך לידה'}
                            value={contactAge}
                            onChange={() => {}}
                            setError={setError}
                            clearErrors={clearErrors}
                            errors={errors}
                        />
                    </FormInput>
                </Grid>
                <Grid item>
                    <FormInput fieldName={ADDITIONAL_PHONE_LABEL}>
                        <NumericTextField
                            name={InteractedContactFields.ADDITIONAL_PHONE_NUMBER}
                            placeholder='הכנס טלפון:'
                            value={interactedContact.additionalPhoneNumber}
                            onChange={(newValue: string) =>
                                updateInteractedContact(interactedContact, InteractedContactFields.ADDITIONAL_PHONE_NUMBER, newValue)
                            }
                            setError={setError}
                            clearErrors={clearErrors}
                            errors={errors}
                        />
                    </FormInput>
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
