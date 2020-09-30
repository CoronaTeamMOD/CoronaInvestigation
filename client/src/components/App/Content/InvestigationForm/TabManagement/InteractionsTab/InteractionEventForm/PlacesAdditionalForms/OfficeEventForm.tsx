import React, {useContext} from 'react';
import { useForm } from 'react-hook-form';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import AddressForm from '../AddressForm/AddressForm';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'

const OfficeEventForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onChange = (newValue: string, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: newValue as string});

    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='שם המשרד'>
                    <AlphanumericTextField
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventDialogFields.PLACE_NAME}
                        value={ctxt.interactionEventDialogData.placeName}
                        onChange={(newValue) => onChange(newValue, InteractionEventDialogFields.PLACE_NAME)}/>
                </FormInput>
            </div>
            <AddressForm/>
        </>
    );
};

export default OfficeEventForm;