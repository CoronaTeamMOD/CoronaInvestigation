import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';

const OrganizedTransportEventForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onContactNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    const onContactNumChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <div className={formClasses.formRow}>
            <Grid item xs={6}>
                <FormInput fieldName='שם איש קשר'>
                    <CircleTextField
                        onBlur={event => onContactNameChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NAME)}/>
                </FormInput>
            </Grid>
            <Grid item xs={6}>
                <FormInput fieldName='טלפון איש קשר'>
                    <CircleTextField
                        onBlur={event => onContactNumChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NUMBER)}/>
                </FormInput>
            </Grid>
        </div>
    );
};

export default OrganizedTransportEventForm;