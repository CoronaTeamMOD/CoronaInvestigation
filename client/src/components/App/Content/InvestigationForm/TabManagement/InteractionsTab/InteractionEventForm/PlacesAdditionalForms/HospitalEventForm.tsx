import React, {useContext} from 'react';
import { Grid } from '@material-ui/core';
import { useForm } from "react-hook-form";

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';

import AddressForm from '../AddressForm/AddressForm';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const HospitalEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onChange = (newValue: string, updatedField: InteractionEventDialogFields) =>
    ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: newValue});

    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם בית חולים'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.PLACE_NAME}
                            value={ctxt.interactionEventDialogData.placeName}
                            onChange={(newValue) => onChange(newValue, InteractionEventDialogFields.PLACE_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='מחלקה'>
                        <AlphanumericTextField
                            errors={errors}
                            setError={setError}
                            clearErrors={clearErrors}
                            name={InteractionEventDialogFields.HOSPITAL_DEPARTMENT}
                            value={ctxt.interactionEventDialogData.hospitalDepartment}
                            onChange={(newValue) => onChange(newValue, InteractionEventDialogFields.HOSPITAL_DEPARTMENT)}/>
                    </FormInput>
                </Grid>
            </div>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default HospitalEventForm;