import React from 'react';
import {AddCircle as AddCircleIcon} from '@material-ui/icons';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {Grid, IconButton, Typography} from '@material-ui/core';

import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import ContactForm from './ContactForm/ContactForm';
import useStyles from '../../InteractionSection/InteractionEventFormStyles';

const defaultContact: Contact = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    identificationNumber: '',
    contactType: -1,
    creationTime: new Date(),
    involvedContact: null,
    identificationType: IdentificationTypes.ID
};

const addContactText = 'הוסף מגע';
const additionalContactText = ' נוסף';

const ManualContactsForm = () => {
    const { control } = useFormContext();
    const { fields: contacts, append } = useFieldArray<Contact>({ control, name: InteractionEventDialogFields.CONTACTS });

    const addContactButton = contacts.length > 0 ? addContactText.concat(additionalContactText): addContactText;

    const formClasses = useFormStyles();
    const classes = useStyles();

    return (
        <Grid container>
            <div className={classes.newContactFieldsContainer}>
                {
                    contacts.map((contact, index: number) => (
                        <Grid key={index} item className={classes.contactedPersonContainer}>
                            <ContactForm
                                key={index}
                                updatedContactIndex={index}
                                personInfo={contact.personInfo}
                                contactStatus={contact.contactStatus}
                                contactCreationTime={contact.creationTime}
                                contactIdentificationType={contact.identificationType}
                            />
                        </Grid>
                    ))
                }
                <Grid item>
                    <IconButton
                        test-id='addContact'
                        onClick={() => append(defaultContact)}
                    >
                        <AddCircleIcon color='primary'/>
                    </IconButton>
                    <Typography
                        variant='caption'
                        className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}
                    >
                        {addContactButton}
                    </Typography>
                </Grid>
            </div>
        </Grid>
    );
};

export default ManualContactsForm;
