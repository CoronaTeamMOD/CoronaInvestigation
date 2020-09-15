import {  Grid } from '@material-ui/core';
import React, { useContext } from 'react';
    
import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import ContactType from 'models/enums/ContactType';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';

import useStyles from './ContactFormStyles';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventContactFields from '../../InteractionsEventDialogContext/InteractionEventContactFields';

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonFirstName: string = 'שם פרטי';
const contactedPersonLastName: string = 'שם משפחה';
const contactedPersonID: string = 'ת.ז';
const contactTypeField: string = 'סוג מגע';
const contactTypeMoreDetails: string = 'פירוט נוסף על אופי המגע'

const ContactForm : React.FC<Props> = (props: Props) : JSX.Element => {

    const { updatedContactIndex } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();
    
    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const { contacts } = interactionEventDialogData;
    const contact = contacts[updatedContactIndex];
    const { extraInfo, contactType, lastName, firstName, phoneNumber, id } = contact;

    React.useEffect(() => {
        onChange(ContactType.TIGHT, InteractionEventContactFields.CONTACT_TYPE);
    }, [])

    const updateContacts = (updatedContact: Contact) => {
        const updatedContacts = [...contacts];
        updatedContacts.splice(updatedContactIndex, 1, updatedContact);
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onChange = (newValue: any, updatedField: InteractionEventContactFields) =>
        updateContacts({...contact, [updatedField]: newValue});

    return (
        <div className={classes.addContactFields} key='addContactFields'>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonFirstName}>
                        <CircleTextField id='contactedPersonFirstName' key='contactedPersonFirstName'
                        className={classes.newContactField}
                        value={firstName}
                        onChange={event => onChange(event.target.value, InteractionEventContactFields.FIRST_NAME)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonLastName}>
                        <CircleTextField id='contactedPersonLastName' key='contactedPersonLastName'
                        className={classes.newContactField}
                        value={lastName}
                        onChange={event => onChange(event.target.value, InteractionEventContactFields.LAST_NAME)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonPhone}>
                        <PhoneNumberTextField id='contactedPersonPhone' key='contactedPersonPhone'
                            className={classes.newContactField}
                            value={phoneNumber.number}
                            isValid={phoneNumber.isValid}
                            setIsValid={isValid => onChange(
                                {
                                    ...phoneNumber,
                                    isValid: isValid
                                }, 
                                InteractionEventContactFields.PHONE_NUMBER
                            )
                            }
                            onChange={event => onChange(
                                {
                                    ...phoneNumber,
                                    number: event.target.value,
                                }, 
                                InteractionEventContactFields.PHONE_NUMBER
                            )} 
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={4}>
                    <FormInput fieldName={contactedPersonID}>
                        <CircleTextField  id='contactedPersonID'
                        className={classes.newContactField}
                        value={id}
                        onChange={event => onChange(event.target.value, InteractionEventContactFields.ID)}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={contactTypeField}>
                        <CircleSelect id='contactType'
                        className={classes.newContactField}
                        value={contactType}
                        onChange={event => onChange(event.target.value as string, InteractionEventContactFields.CONTACT_TYPE)}
                        options={Object.values(ContactType)}
                        />
                    </FormInput>
                </Grid>
            </Grid>
            <FormInput fieldName={contactTypeMoreDetails}>
                <CircleTextField className={classes.moreContactDetails}
                        id='extraInfo'
                        value={extraInfo}
                        onChange={event => onChange(event.target.value, InteractionEventContactFields.EXTRA_INFO)}
                />
            </FormInput>
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
}