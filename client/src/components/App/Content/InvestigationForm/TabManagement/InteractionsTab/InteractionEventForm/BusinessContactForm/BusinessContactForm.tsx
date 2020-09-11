import React, { useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventDialogFields';

const businessContactFirstNameField = 'שם פרטי';
const businessContactLastNameField = 'שם משפחה';
const businessContactNumField = 'טלפון';
 
const BusinessContactForm : React.FC = () : JSX.Element => {
        
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { contactPersonFirstName, contactPersonLastName, contactPersonPhoneNumber } = interactionEventDialogData;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value as string});
    return (
        <div>
            <Typography variant='body1' className={formClasses.fieldName}>פרטי איש קשר:</Typography>
            <Grid container className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName={businessContactFirstNameField}>
                        <CircleTextField
                            value={contactPersonFirstName}
                            onChange={event => onChange(event, InteractionEventDialogFields.CONTACT_PERSON_FIRST_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={businessContactLastNameField}>
                        <CircleTextField
                            value={contactPersonLastName}
                            onChange={event => onChange(event, InteractionEventDialogFields.CONTACT_PERSON_LAST_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName={businessContactNumField}>
                        <CircleTextField
                            value={contactPersonPhoneNumber}
                            onChange={event => onChange(event, InteractionEventDialogFields.CONTACT_PERSON_PHONE_NUMBER)}/>
                    </FormInput>
                </Grid>
            </Grid>
        </div>
    );
};

export default BusinessContactForm;