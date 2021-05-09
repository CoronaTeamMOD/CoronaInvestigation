import React from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { Tooltip, Typography } from '@material-ui/core';

import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import InvalidFormIcon from 'commons/Icons/InvalidFormIcon';
import FamilyContactIcon from 'commons/Icons/FamilyContactIcon';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import GroupedContactIcon from 'commons/Icons/GroupedContactIcon';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import GetGroupedInvestigationsIds from 'Utils/GroupedInvestigationsContacts/getGroupedInvestigationIds';

import useStyles from '../ContactQuestioningStyles';

const TIGHT_CONTACT_STATUS = 1;

const ContactDetails = (props: Props) => {

    const { errors } = useFormContext();
    const { index , interactedContact } = props;
    const classes = useStyles({});

    const formErrors = errors.form ? (errors.form[index] ? errors.form[index] : {}) : {};
    const formHasErrors = Object.entries(formErrors)
        .some(([key, value]) => value !== undefined);

    const { isInvolvedThroughFamily } = useInvolvedContact();
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(
        (state) => state.contactTypes
    );

    const { isGroupedContact } = GetGroupedInvestigationsIds();

    const highestContactType = interactedContact.contactEvents.reduce((prev, current) => {
        if(current.contactType === TIGHT_CONTACT_STATUS)  {
            if(prev.contactType === TIGHT_CONTACT_STATUS) {
                return (new Date(prev.date).getTime() > new Date(current.date).getTime()) ? prev : current
            }
            return current
        }
        return prev;
    });

    const tooltipText = highestContactType.contactType === TIGHT_CONTACT_STATUS 
        ? formatDate(highestContactType.date)
        : '';
    return (
        <>
            {isInvolvedThroughFamily(interactedContact.involvementReason) && (
                <FamilyContactIcon />
            )}
            {isGroupedContact(interactedContact.identificationNumber) && (
                <GroupedContactIcon />
            )}
            {
                formHasErrors && <InvalidFormIcon />
            }

            <Typography variant='body2' className={classes.contactDetail}>
                <b>שם פרטי:</b>{' '}
                {interactedContact.firstName}
            </Typography>
            <Typography variant='body2' className={classes.contactDetail}>
               <b>שם משפחה:</b>{' '}
               {interactedContact.lastName}
            </Typography>
            {interactedContact.contactEvents && (
                <Tooltip title={tooltipText} placement='top' arrow>
                    <Typography variant='body2'>
                        <b>סוג מגע:</b>{' '}
                            {
                                contactTypes.get(highestContactType.contactType)
                                    ?.displayName
                            }
                    </Typography>
                </Tooltip>
            )}
        </>
    );
};

export default ContactDetails;

interface Props {
    interactedContact: GroupedInteractedContact;
    index : number;
};