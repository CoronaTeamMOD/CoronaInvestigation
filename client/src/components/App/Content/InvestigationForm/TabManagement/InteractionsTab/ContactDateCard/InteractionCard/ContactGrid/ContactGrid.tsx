import React from 'react';
import { useSelector } from 'react-redux';
import { Delete } from '@material-ui/icons';
import {Grid, Typography, IconButton, Tooltip} from '@material-ui/core';

import Contact from 'models/Contact';
import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';

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
                    <Grid item xs={3}>
                        <FormInput fieldName={contactedPersonFirstName}>
                            <Typography variant='caption'>
                                {contact.firstName}
                            </Typography>
                        </FormInput>
                    </Grid>
                    <Grid item xs={3}>
                        <FormInput fieldName={contactedPersonLastName}>
                            <Typography variant='caption'>
                                {contact.lastName}
                            </Typography>
                        </FormInput>
                    </Grid>
                    <Grid item xs={3}>
                        {
                            contact.phoneNumber && <FormInput fieldName={contactedPersonPhone}>
                                <Typography variant='caption'>
                                    {contact.phoneNumber}
                                </Typography>
                            </FormInput>
                        }
                    </Grid>
                    <Grid item xs={3}>
                        {
                            contact.idNumber && <FormInput fieldName={contactedPersonID}>
                                <Typography variant='caption'>
                                    {contact.idNumber}
                                </Typography>
                            </FormInput>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12} className={formClasses.formRow}>
                    <Grid item xs={3}>
                        <FormInput fieldName={contactType}>
                            <Typography variant='caption'>
                                {contactTypes.get(+contact.contactType)?.displayName}
                            </Typography>
                        </FormInput>
                    </Grid>
                    <Grid item xs={9}>
                        {
                            contact.extraInfo && <FormInput fieldName={contactTypeMoreDetails}>
                                <Typography variant='caption'>
                                    {contact.extraInfo}
                                </Typography>
                            </FormInput>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <div className={classes.deleteIconDiv}>
                <CompletedQuestioningTooltip>
                    <IconButton disabled={isContactComplete} test-id='deleteContactLocation' onClick={() => {
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