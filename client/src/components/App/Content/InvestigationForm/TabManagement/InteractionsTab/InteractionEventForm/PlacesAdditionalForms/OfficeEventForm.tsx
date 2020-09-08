import React, {useContext} from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'commons/AddressForm/AddressForm';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const OfficeEventForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value as string});

    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='שם המשרד'>
                    <CircleTextField
                        value={ctxt.interactionEventDialogData.locationName}
                        onChange={(event) => onChange(event, InteractionEventDialogFields.LOCATION_NAME)}/>
                </FormInput>
            </div>
            <AddressForm/>
        </>
    );
};

export default OfficeEventForm;