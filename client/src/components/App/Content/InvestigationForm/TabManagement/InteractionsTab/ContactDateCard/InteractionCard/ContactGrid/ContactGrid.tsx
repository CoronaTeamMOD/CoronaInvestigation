import React from 'react';
import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import {Grid, Typography, IconButton, Tooltip} from '@material-ui/core';

import Contact from 'models/Contact';
import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';

import useStyles from './ContactGridStyles';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactType: string = 'סוג המגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const ContactGrid: React.FC<Props> = (props: Props): JSX.Element => {

    const { contact, onDeleteContactClick, eventId, isContactComplete } = props;

    const formClasses = useFormStyles();
    const classes = useStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);
    
    const { shouldDisableContact } = useStatusUtils();
    const shouldDisableDeleteContact = isContactComplete || shouldDisableContact(contact.creationTime) || (contact.involvedContactId && contact.involvedContactId !== null) as boolean;

    const CompletedQuestioningTooltip = ({children}: {children: React.ReactElement}) => (
        isContactComplete ?
            <Tooltip title='המגע בסטטוס הושלם'>
                <span>{children}</span>
            </Tooltip>
            : children
    );

    return (
        <>
            <Grid className={formClasses.formRow + ' ' + classes.fullWidthGrid} container justify='flex-start' key='addContactFields'>
                <Grid item xs={12} className={formClasses.formRow}>
                    <FormInput xs={3} fieldName={contactedPersonFirstName}>
                        <Typography variant='caption'>
                            {contact.firstName}
                        </Typography>
                    </FormInput>
                    <FormInput xs={3} fieldName={contactedPersonLastName}>
                        <Typography variant='caption'>
                            {contact.lastName}
                        </Typography>
                    </FormInput>
                    {
                        contact.phoneNumber && <FormInput xs={3} fieldName={contactedPersonPhone}>
                            <Typography variant='caption'>
                                {contact.phoneNumber}
                            </Typography>
                        </FormInput>
                    }
                    {
                        contact.idNumber && <FormInput xs={3} fieldName={contactedPersonID}>
                            <Typography variant='caption'>
                                {contact.idNumber}
                            </Typography>
                        </FormInput>
                    }
                </Grid>
                <Grid item xs={12} className={formClasses.formRow}>
                    <FormInput xs={3} fieldName={contactType}>
                        <Typography variant='caption'>
                            {contactTypes.get(+contact.contactType)?.displayName}
                        </Typography>
                    </FormInput>
                    {
                        contact.extraInfo && <FormInput xs={9} fieldName={contactTypeMoreDetails}>
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
                            contact.serialId && onDeleteContactClick(contact.serialId, eventId)
                        }}>
                        <Delete />
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
};
