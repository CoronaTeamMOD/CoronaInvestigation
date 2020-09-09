import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
    
import Contact from 'models/Contact';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import useStyles from './ContactFormStyles';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';

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
    const { personalInfo, moreDetails, needsToBeQuarantined, id } = contacts[updatedContactIndex];
    
    const updateContacts = (updatedContact: Contact) => {
        const updatedContacts = [...contacts];
        updatedContacts.splice(updatedContactIndex, 1, updatedContact);
        setInteractionEventDialogData({...interactionEventDialogData, contacts: updatedContacts});
    }

    const onNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        personalInfo.firstName = event.target.value as string;
        const updatedPersonalInfo = {...personalInfo, firstName: event.target.value as string};
        updateContacts({...contacts[updatedContactIndex], personalInfo: updatedPersonalInfo});
    }

    const onIDChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateContacts({...contacts[updatedContactIndex], id: event.target.value as string});
    }

    const onPhoneNumberChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        personalInfo.firstName = event.target.value as string;
        const updatedPersonalInfo = {...personalInfo, phoneNumber: event.target.value as string};
        updateContacts({...contacts[updatedContactIndex], personalInfo: updatedPersonalInfo});
    }

    const onNeedsToBeQuarantinedChange = (quarantineCondition: boolean) => {
        updateContacts({...contacts[updatedContactIndex], needsToBeQuarantined: quarantineCondition});
    }

    const onMoreDetailsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateContacts({...contacts[updatedContactIndex], moreDetails: event.target.value as string});
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
                                value={personalInfo.phoneNumber}
                                placeholder={contactedPersonPhone}
                                onChange={onPhoneNumberChange}
                                required={false}
            />
            <Typography variant='caption' className={formClasses.fieldName + ' ' + classes.fieldNameNoWrap}>{contactedPersonID + ': '}</Typography>
            <CircleTextField  id='contactedPersonID'
                                className={classes.newContactField}
                                value={id}
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
                value={moreDetails}
                onChange={onMoreDetailsChange}
            />
        </div>
    );
};

export default ContactForm;

interface Props {
    updatedContactIndex: number;
}