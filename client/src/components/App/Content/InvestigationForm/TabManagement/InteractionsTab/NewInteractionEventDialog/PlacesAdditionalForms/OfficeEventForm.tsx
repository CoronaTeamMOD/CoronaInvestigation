import React from 'react';

import Address from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import AddressForm from 'commons/AddressForm/AddressForm';

import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

const OfficeEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

    const onAddressChange = (ctxt: InteractionEventVariables, address: Address) => 
        ctxt.setLocationAddress && ctxt.setLocationAddress(address);
        
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setLocationName && ctxt.setLocationName(event.target.value);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='שם המשרד'>
                            <CircleTextField 
                                value={ctxt.locationName || ''} 
                                onChange={(event) => onNameChange(event, ctxt)}/>
                        </FormInput>
                    </div>
                    <AddressForm updateAddress={(address: Address) => onAddressChange(ctxt, address)} />
                </>
            }
        </InteractionEventVariablesConsumer>
    );
};

export default OfficeEventForm;