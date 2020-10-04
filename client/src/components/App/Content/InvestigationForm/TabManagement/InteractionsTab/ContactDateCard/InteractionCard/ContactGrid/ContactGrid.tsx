import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import Contact from 'models/Contact';
import ContactType from 'models/ContactType';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactType: string = 'סוג המגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const ContactGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { contact } = props;

    const formClasses = useFormStyles();

    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    return (
        <>
            <Grid className={formClasses.formRow} container justify='flex-start' key='addContactFields'>
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
                    <FormInput fieldName={contactedPersonPhone}>
                        <Typography variant='caption'>
                            {contact.phoneNumber && contact.phoneNumber.number}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    {
                        contact.id && <FormInput fieldName={contactedPersonID}>
                            <Typography variant='caption'>
                                {contact.id}
                            </Typography>
                        </FormInput>
                    }
                </Grid>
            </Grid>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={3}>
                    <FormInput fieldName={contactType}>
                        <Typography variant='caption'>
                            {contactTypes.get(+contact.contactType)?.displayName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={9}>
                    <FormInput fieldName={contactTypeMoreDetails}>
                        <Typography variant='caption'>
                            {contact.extraInfo}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
        </>
    );
};

export default ContactGrid;

interface Props {
    contact: Contact;
}