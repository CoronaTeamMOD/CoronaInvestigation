import React from 'react';
import {Grid, IconButton, Typography} from "@material-ui/core";
import ContactForm from "./ContactForm/ContactForm";
import {defaultContact} from "../../InteractionEventForm";
import {AddCircle as AddCircleIcon} from "@material-ui/icons";
import {useFieldArray, useFormContext} from "react-hook-form";
import Contact from "../../../../../../../../../models/Contact";
import InteractionEventDialogFields
    from "../../../../../../../../../models/enums/InteractionsEventDialogContext/InteractionEventDialogFields";
import useFormStyles from "../../../../../../../../../styles/formStyles";
import useStyles from "../../InteractionEventFormStyles";

const addContactButton: string = 'הוסף מגע';

const ContactsForms = () => {
    const { control } = useFormContext();
    const { fields, append } = useFieldArray<Contact>({ control, name: InteractionEventDialogFields.CONTACTS });
    const contacts = fields;

    const formClasses = useFormStyles();
    const classes = useStyles();

    return (
        <Grid container
            // className={formClasses.form + ' ' + classes.spacedOutForm}
        >
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

export default ContactsForms;