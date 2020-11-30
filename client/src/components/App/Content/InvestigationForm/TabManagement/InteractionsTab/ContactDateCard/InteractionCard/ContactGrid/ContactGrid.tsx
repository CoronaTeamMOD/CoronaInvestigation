import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import { differenceInYears, format } from 'date-fns';
import {Grid, Typography, IconButton, Tooltip} from '@material-ui/core';

import Contact from 'models/Contact';
import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';

import useStyles from './ContactGridStyles';
import InvolvedContact from 'models/InvolvedContact';
import FamilyContactIcon from 'commons/Icons/FamilyContactIcon';

const contactedPersonPhone: string = 'טלפון ראשי';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactType: string = 'סוג המגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע';
const contactedBirthdate: string = 'תאריך לידה';
const contactedAge: string = 'גיל';
const contactedAdditionalPhone: string = 'טלפון משני';
const contactedIsolationCity: string = 'יישוב השהייה בבידוד';
const contactedFamilyRelationshop: string = 'קרבה משפחתית';

const noDataIndication = '---';
const birthDateFormat = 'dd/MM/yyyy';

const ContactGrid: React.FC<Props> = (props: Props): JSX.Element => {

    const { contact, onDeleteContactClick, eventId, isContactComplete } = props;

    const formClasses = useFormStyles();
    const classes = useStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableDeleteContact = isContactComplete || shouldDisableContact(contact.creationTime);
    const { isInvolved, isInvolvedThroughFamily } = useInvolvedContact();

    const CompletedQuestioningTooltip = ({children}: {children: React.ReactElement}) => (
        isContactComplete ?
            <Tooltip title='המגע בסטטוס הושלם'>
                <span>{children}</span>
            </Tooltip>
            : children
    );

    const involvementReason = contact.involvedContact?.involvementReason || null;

    const involvedContactsAdditionalFields = () => {
        const { birthDate, familyRelationship, isolationCity, additionalPhoneNumber } = contact.involvedContact as InvolvedContact;
        return (<>
            {
                <FormInput xs={3} fieldName={contactedFamilyRelationshop}>
                    <Typography variant='caption'>
                        {familyRelationship || noDataIndication}
                    </Typography>
                </FormInput>
            }
            <FormInput xs={2} fieldName={contactedAdditionalPhone}>
                <Typography variant='caption'>
                    {additionalPhoneNumber || noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedBirthdate}>
                <Typography variant='caption'>
                    {birthDate ? format(new Date(birthDate), birthDateFormat) : noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedAge}>
                <Typography variant='caption'>
                    {birthDate ? differenceInYears(new Date(), new Date(birthDate)) : noDataIndication}
                </Typography>
            </FormInput>
            <FormInput xs={2} fieldName={contactedIsolationCity}>
                <Typography variant='caption'>
                    {isolationCity || noDataIndication}
                </Typography>
            </FormInput>
        </>)
    }

    return (
        <>
            <Grid className={formClasses.formRow + ' ' + classes.fullWidthGrid} container justify='flex-start' key='addContactFields'>
                <Grid item xs={12} className={formClasses.formRow}>
                    {
                        (isInvolved(involvementReason) && isInvolvedThroughFamily(involvementReason)) &&
                        <Grid item xs={1}>
                            <FamilyContactIcon/>
                        </Grid>
                    }
                    <FormInput xs={2} fieldName={contactedPersonFirstName}>
                        <Typography variant='caption'>
                            {contact.firstName || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={3} fieldName={contactedPersonLastName}>
                        <Typography variant='caption'>
                            {contact.lastName || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={contactedPersonID}>
                        <Typography variant='caption'>
                            {contact.idNumber || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={contactedPersonPhone}>
                        <Typography variant='caption'>
                            {contact.phoneNumber || noDataIndication}
                        </Typography>
                    </FormInput>
                    <FormInput xs={2} fieldName={contactType}>
                        <Typography variant='caption'>
                            {contactTypes.get(+contact.contactType)?.displayName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={12} className={formClasses.formRow}>
                    {
                        isInvolved(involvementReason) ?
                            involvedContactsAdditionalFields()
                        : contact.extraInfo && 
                            <FormInput fieldName={contactTypeMoreDetails}>
                                <Typography variant='caption'>
                                    {contact.extraInfo}
                                </Typography>
                            </FormInput>
                    }
                </Grid>
            </Grid>
            <div className={classes.deleteIconDiv}>
                <CompletedQuestioningTooltip>
                    <IconButton 
                        disabled={shouldDisableDeleteContact}
                        test-id='deleteContactLocation' 
                        onClick={() => {
                        contact.serialId && onDeleteContactClick(
                            contact.serialId,
                            eventId
                        )
                    }}>
                        <Delete/>
                    </IconButton>
                </CompletedQuestioningTooltip>
            </div>
        </>
    );
};

export default ContactGrid;

interface Props {
    contact: Contact;
    onDeleteContactClick: (contactedPersonId: number, contactEventId: number) => void;
    eventId: number;
    isContactComplete: boolean;
}