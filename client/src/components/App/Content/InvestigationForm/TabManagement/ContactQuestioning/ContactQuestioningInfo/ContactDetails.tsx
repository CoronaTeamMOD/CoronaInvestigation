import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form'

import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import InteractedContact from 'models/InteractedContact';
import InvalidFormIcon from 'commons/Icons/InvalidFormIcon';
import FamilyContactIcon from 'commons/Icons/FamilyContactIcon';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';


const ContactDetails = (props: Props) => {
    const { errors } = useFormContext();
    const { index , interactedContact } = props;

    const formErrors = errors.form ? (errors.form[index] ? errors.form[index] : {}) : {};
    const formHasErrors = Object.entries(formErrors)
        .map(([key, value]) => value)
        .some((value) => value !== undefined);

    const { isInvolvedThroughFamily } = useInvolvedContact();
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(
        (state) => state.contactTypes
    );

    return (
        <>
            {isInvolvedThroughFamily(interactedContact.involvementReason) && (
                <FamilyContactIcon />
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
            <Typography variant='body2'>
                <b>תאריך המגע:</b>{' '}
                {format(new Date(interactedContact.contactDate), 'dd/MM/yyyy')}
            </Typography>
            {interactedContact.contactType && (
                <Typography variant='body2'>
                    <b>סוג מגע:</b>{' '}
                    {
                        contactTypes.get(+interactedContact.contactType)
                            ?.displayName
                    }
                </Typography>
            )}
            {interactedContact.extraInfo && (
                <Typography variant='body2'>
                    <b>פירוט אופי המגע:</b> {interactedContact.extraInfo}
                </Typography>
            )}
        </>
    );
};

export default ContactDetails;

interface Props {
    interactedContact: InteractedContact;
    index : number;
}
