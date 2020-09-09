import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventDialogFields';

const businessContactNameField = 'שם איש קשר';
const businessContactNumField = 'טלפון איש קשר';
 
const BusinessContactForm : React.FC = () : JSX.Element => {
        
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { buisnessContactName } = interactionEventDialogData;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value as string});
    return (
        <Grid container className={formClasses.formRow}>
            <Grid item xs={6}>
                <FormInput fieldName={businessContactNameField}>
                    <CircleTextField
                        value={buisnessContactName}
                        onChange={event => onChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NAME)}/>
                </FormInput>
            </Grid>
            <Grid item xs={6}>
                <FormInput fieldName='טלפון איש קשר'>
                    <CircleTextField
                        value={businessContactNumField}
                        onChange={event => onChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NUMBER)}/>
                </FormInput>
            </Grid>
        </Grid>
    );
};

export default BusinessContactForm;