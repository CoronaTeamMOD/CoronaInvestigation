import React, {useContext} from 'react';
import {Grid, TextField} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressForm from '../AddressForm/AddressForm';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const HospitalEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onChange = (event: React.ChangeEvent<{ value: unknown }>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם בית חולים'>
                        <TextField
                            value={ctxt.interactionEventDialogData.placeName}
                            onChange={(event) => onChange(event, InteractionEventDialogFields.PLACE_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='מחלקה'>
                        <TextField
                            value={ctxt.interactionEventDialogData.hospitalDepartment}
                            onChange={(event) => onChange(event, InteractionEventDialogFields.HOSPITAL_DEPARTMENT)}/>
                    </FormInput>
                </Grid>
            </div>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default HospitalEventForm;