import React, {useContext} from 'react';
import { Grid } from '@material-ui/core';
import { useForm } from "react-hook-form";

import FormInput from 'commons/FormInput/FormInput';
import AddressForm from '../AddressForm/AddressForm';
import BusinessContactForm from '../BusinessContactForm/BusinessContactForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'

const DefaultPlaceEventForm : React.FC = () : JSX.Element => {
    const ctxt = useContext(InteractionEventDialogContext);

    const onChange = (newValue: string, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: newValue});

    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <Grid item xs={2}>
                <FormInput fieldName='שם המוסד'>
                    <AlphanumericTextField
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventDialogFields.PLACE_NAME}
                        value={ctxt.interactionEventDialogData.placeName}
                        onChange={newValue => onChange(newValue, InteractionEventDialogFields.PLACE_NAME)}/>
                </FormInput>
            </Grid>
            <AddressForm />
            <BusinessContactForm/>
        </>
    );
};

export default DefaultPlaceEventForm;