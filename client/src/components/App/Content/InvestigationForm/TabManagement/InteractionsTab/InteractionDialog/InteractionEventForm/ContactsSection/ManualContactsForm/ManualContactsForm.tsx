import React from 'react';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Grid, IconButton, Typography } from '@material-ui/core';

import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import ContactForm from './ContactForm/ContactForm';
import useStyles from '../../InteractionSection/InteractionEventFormStyles';
import { defaultContact } from '../../InteractionSection/InteractionEventForm';

const addContactText = 'הוסף מגע';
const additionalContactText = ' נוסף';

const ManualContactsForm = () => {
    const { control } = useFormContext();
    const { fields, append } = useFieldArray<Contact>({ control, name: InteractionEventDialogFields.CONTACTS });
    const contacts = fields;

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
                                contactStatus={contact.contactStatus}
                                contactCreationTime={contact.creationTime}
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
