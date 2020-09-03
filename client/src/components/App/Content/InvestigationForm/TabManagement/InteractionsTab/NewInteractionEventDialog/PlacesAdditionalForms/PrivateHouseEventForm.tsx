import React from 'react';

import Address from 'models/Address';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'commons/AddressForm/AddressForm';

import useStyles from '../NewInteractionEventDialogStyles';
import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

const PrivateHouseEventForm : React.FC = () : JSX.Element => {

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [isTheInvestigatedHouse, setIsTheInvestigatedHouse] = React.useState<boolean>(false);

    const onIsTheInvestigatedHouseChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean, ctxt: InteractionEventVariables) => {
        if (val) {
            // set location name and address
            ctxt.setLocationName && ctxt.setLocationName('בית פרטי של המתוחקר');
        }
        ctxt.setLocationName && ctxt.setLocationName('בית פרטי אחר');
        setIsTheInvestigatedHouse(val);
    }

    const onAddressChange = (ctxt: InteractionEventVariables, address: Address) => 
        ctxt.setLocationAddress && ctxt.setLocationAddress(address);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='בית המתוחקר'>
                            <Toggle 
                                className={classes.toggle}
                                value={isTheInvestigatedHouse} 
                                onChange={(event, val) => onIsTheInvestigatedHouseChange(event, val, ctxt)}/>
                        </FormInput>
                    </div>
                    <AddressForm updateAddress={(address: Address) => onAddressChange(ctxt, address)} />
                </>
            }
        </InteractionEventVariablesConsumer>
    );
};

export default PrivateHouseEventForm;