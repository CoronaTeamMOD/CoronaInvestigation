import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form'

import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import InvalidFormIcon from 'commons/Icons/InvalidFormIcon';
import FamilyContactIcon from 'commons/Icons/FamilyContactIcon';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import GroupedContactIcon from 'commons/Icons/GroupedContactIcon';
import GetGroupedInvestigationsIds from 'Utils/GroupedInvestigationsContacts/getGroupedInvestigationIds';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import formatDate from 'Utils/DateUtils/formatDate';

const ContactDetails = (props: Props) => {
    const { errors } = useFormContext();
    const { index , interactedContact } = props;

    const formErrors = errors.form ? (errors.form[index] ? errors.form[index] : {}) : {};
    const formHasErrors = Object.entries(formErrors)
        .some(([key, value]) => value !== undefined);

    const { isInvolvedThroughFamily } = useInvolvedContact();
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(
        (state) => state.contactTypes
    );

    const { isGroupedContact } = GetGroupedInvestigationsIds();

    const highestContactType = interactedContact.contactEvents.reduce((prev, current) => {
        if(current.contactType === 1)  {
            if(prev.contactType === 1) {
                return (new Date(prev.date).getTime() > new Date(current.date).getTime()) ? prev : current
            }
            return current
        }
        return prev;
    });

    const tooltipText = highestContactType.contactType === 1 
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

            <Typography variant='body2'>
                <b>שם פרטי:</b> {interactedContact.firstName}
            </Typography>
            <Typography variant='body2'>
                <b>שם משפחה:</b> {interactedContact.lastName}
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
}
