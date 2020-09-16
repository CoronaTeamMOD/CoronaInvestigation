import React, { useContext } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';
import InteractionEventDialogFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventDialogFields';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';

const businessContactFirstNameField = 'שם פרטי';
const businessContactLastNameField = 'שם משפחה';
const businessContactNumField = 'טלפון';
 
const BusinessContactForm : React.FC = () : JSX.Element => {
        
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { contactPersonFirstName, contactPersonLastName, contactPersonPhoneNumber } = interactionEventDialogData;

    const onChange = (value: any, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: value});
    return (
        <div>
            <Typography variant='body1' className={formClasses.fieldName}>פרטי איש קשר:</Typography>
            <Grid container className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName={businessContactFirstNameField}>
                        <TextField
                            value={contactPersonFirstName}
                            onChange={event => onChange(event.target.value, InteractionEventDialogFields.CONTACT_PERSON_FIRST_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={businessContactLastNameField}>
                        <TextField
                            value={contactPersonLastName}
                            onChange={event => onChange(event.target.value, InteractionEventDialogFields.CONTACT_PERSON_LAST_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={businessContactNumField}>
                        <PhoneNumberTextField
                            id={'businessContactedPersonPhone'}
                            value={contactPersonPhoneNumber?.number}
                            isValid={ctxt.interactionEventDialogData.contactPersonPhoneNumber?.isValid as boolean}
                            setIsValid={isValid => onChange(
                                {
                                    ...ctxt.interactionEventDialogData.contactPersonPhoneNumber,
                                    isValid: isValid
                                }, 
                                InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER
                            )
                            }
                            onChange={event => onChange(
                                {
                                    ...ctxt.interactionEventDialogData.contactPersonPhoneNumber,
                                    number: event.target.value,
                                }, 
                                InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER
                            )} 
                        />
                    </FormInput>
                </Grid>
            </Grid>
        </div>
    );
};

export default BusinessContactForm;