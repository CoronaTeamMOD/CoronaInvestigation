import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
    
import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import useStyles from './ContactFormStyles';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import {Person} from "../../../../../../../../models/Person";

const contactedPersonPhone: string = 'מספר טלפון';
const contactedPersonName: string = 'שם';
const contactedPersonID: string = 'ת.ז';

const ContactForm : React.FC<Props> = (props: Props) : JSX.Element => {

    const classes = useStyles();
    const formClasses = useFormStyles();

    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { contacts } = interactionEventDialogData;
    const { updatedContactIndex } = props;
    const { personalInfo, extraInfo, needsToBeQuarantined } = contacts[updatedContactIndex];
    
    const updateContacts = (updatedContact: Contact) => {
        const updatedContacts = [...contacts];
        updatedContacts.splice(updatedContactIndex, 1, updatedContact);
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const updatedContactedPersonalInfo: Person = {...personalInfo, firstName: event.target.value as string}
        updateContacts({...contacts[updatedContactIndex], personalInfo: updatedContactedPersonalInfo});
    }

    const onIDChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const updatedContactedPersonalInfo: Person = {...personalInfo, identificationNumber: event.target.value as string}
        updateContacts({...contacts[updatedContactIndex], personalInfo: updatedContactedPersonalInfo});
    }

    const onPhoneNumberChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const updatedContactedPersonalInfo: Person = {...personalInfo, phoneNumber: event.target.value as string}
        updateContacts({...contacts[updatedContactIndex], personalInfo: updatedContactedPersonalInfo});
    }

    const onNeedsToBeQuarantinedChange = (quarantineCondition: boolean) => {
        updateContacts({...contacts[updatedContactIndex], needsToBeQuarantined: quarantineCondition});
    }

    const onMoreDetailsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateContacts({...contacts[updatedContactIndex], extraInfo: event.target.value as string});
    }

    return (
        <div className={classes.addContactFields} key='addContactFields'>
            <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonName + ': '}</Typography>
            <CircleTextField id='contactedPersonName' key='contactedPersonName'
                                className={classes.newContactField}
                                value={personalInfo.firstName}
                                placeholder={contactedPersonName}
                                onChange={onNameChange}
            />
            <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonPhone + ': '}</Typography>
            <CircleTextField id='contactedPersonPhone' key='contactedPersonPhone'
                                className={classes.newContactField}
                                value={personalInfo.identificationNumber}
                                placeholder={contactedPersonPhone}
                                onChange={onPhoneNumberChange}
                                required={false}
            />
            <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonID + ': '}</Typography>
            <CircleTextField  id='contactedPersonID'
                                className={classes.newContactField}
                                value={personalInfo.phoneNumber}
                                placeholder={contactedPersonID}
                                onChange={onIDChange}
            />
            <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>
                צריך בידוד?
            </Typography>
            <Toggle
                className={formClasses.formToggle}
                value={needsToBeQuarantined}
                id='needsToBeQuarantinedToggle'
                onChange={(event, val) => {
                    onNeedsToBeQuarantinedChange(val)
                }}
            />
            <CircleTextField className={classes.moreContactDetails}
                placeholder={'פירוט נוסף על אופי המגע'}
                id='moreDetails'
                value={extraInfo}
                onChange={onMoreDetailsChange}
            />
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
}