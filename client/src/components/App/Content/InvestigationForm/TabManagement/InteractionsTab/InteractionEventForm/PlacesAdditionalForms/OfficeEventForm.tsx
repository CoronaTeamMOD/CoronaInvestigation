import React, {useContext} from 'react';

import Address from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'commons/AddressForm/AddressForm';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../InteractionsEventDialogContext/InteractionsEventDialogContext'
import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';

const OfficeEventForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onAddressChange = (address: Address, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: address});
        
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value as string});

            return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='שם המשרד'>
                    <CircleTextField
                        onBlur={(event) => onNameChange(event, InteractionEventDialogFields.LOCATION_NAME)}/>
                </FormInput>
            </div>
            <AddressForm updateAddress={(address: Address) => onAddressChange(address, InteractionEventDialogFields.LOCATION_ADDRESS)} />
        </>
    );
};

export default OfficeEventForm;