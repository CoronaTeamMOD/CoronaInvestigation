import React from 'react';
import { useSelector } from 'react-redux';
import { differenceInYears, format } from 'date-fns';
import { Grid, Typography } from '@material-ui/core';

import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InvolvedContact from 'models/InvolvedContact';
import formatDate from 'Utils/DateUtils/formatDate';

const contactedPersonPhone: string = 'טלפון ראשי';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactType: string = 'סוג המגע';
const contactedBirthdate: string = 'תאריך לידה';
const contactedAge: string = 'גיל';
const contactedGrade: string = 'כיתה';
const contactedInstitutionName: string = 'שם מוסד';
const contactedIsInIsolation: string = 'האם הוקם בידוד';
const contactedIsInIsolationAnswer: string = 'כן';
const recoveryDate = 'תאריך החלמה';
const serologicStartDate = 'תחילת חסינות סרולוגית';
const serologicExpieryDate = 'תוקף חסינות סרולוגית';
const vaccineEffectivenessDate = 'אפקטיביות חיסון';
const vaccineExpieryDate = 'תוקף חיסון';


const noDataIndication = '---';
const birthDateFormat = 'dd/MM/yyyy';

const EducationContact: React.FC<Props> = (props: Props): JSX.Element => {

    const { contact } = props;

    const formClasses = useFormStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    const {epidemiologicStatus} = contact;

    return (
        <>
            <Grid item xs={12} className={formClasses.formRow}>
                <FormInput xs={2} fieldName={contactedPersonFirstName}>
                    <Typography variant='caption'>
                        {contact.firstName || noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedPersonLastName}>
                    <Typography variant='caption'>
                        {contact.lastName || noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedPersonID}>
                    <Typography variant='caption'>
                        {contact.identificationNumber || noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedBirthdate}>
                    <Typography variant='caption'>
                        {contact.birthDate ? format(new Date(contact.birthDate), birthDateFormat) : noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedAge}>
                    <Typography variant='caption'>
                        {contact.birthDate ? differenceInYears(new Date(), new Date(contact.birthDate)) : noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedPersonPhone}>
                    <Typography variant='caption'>
                        {contact.phoneNumber || noDataIndication}
                    </Typography>
                </FormInput>
            </Grid>
            <Grid item xs={12} className={formClasses.formRow}>
                <FormInput xs={2} fieldName={contactedInstitutionName}>
                    <Typography variant='caption'>
                        {contact.institutionName || noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedGrade}>
                    <Typography variant='caption'>
                        {contact.educationGrade ? (contact.educationGrade + contact.educationClassNumber) : noDataIndication}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactType}>
                    <Typography variant='caption'>
                        {contactTypes.get(+contact.contactType)?.displayName}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={contactedIsInIsolation}>
                    <Typography variant='caption'>
                        {contactedIsInIsolationAnswer}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={recoveryDate}>
                    <Typography variant='caption'>
                        {formatDate(epidemiologicStatus?.recoveryDate)}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={serologicStartDate}>
                    <Typography variant='caption'>
                        {formatDate(epidemiologicStatus?.serologicImmunityStartDate)}
                    </Typography>
                </FormInput>
            </Grid>
            <Grid item xs={12} className={formClasses.formRow}>
                <FormInput xs={2} fieldName={serologicExpieryDate}>
                    <Typography variant='caption'>
                        {formatDate(epidemiologicStatus?.serologicImmunityExpirationDate)}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={vaccineEffectivenessDate}>
                    <Typography variant='caption'>
                        {formatDate(epidemiologicStatus?.vaccineEffectivenessStartDate)}
                    </Typography>
                </FormInput>
                <FormInput xs={2} fieldName={vaccineExpieryDate}>
                    <Typography variant='caption'>
                        {formatDate(epidemiologicStatus?.vaccineExpirationDate)}
                    </Typography>
                </FormInput>
            </Grid>
        </>
    );
};

export default EducationContact;

interface Props {
    contact: InvolvedContact;
}