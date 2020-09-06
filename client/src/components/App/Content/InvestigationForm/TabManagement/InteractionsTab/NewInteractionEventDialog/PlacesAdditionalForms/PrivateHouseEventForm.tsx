import React, {useContext} from 'react';

import Address from 'models/Address';
import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'commons/AddressForm/AddressForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from '../NewInteractionEventDialogStyles';
import InteractionEventDialogFields from '../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../InteractionsEventDialogContext/InteractionsEventDialogContext'

const PrivateHouseEventForm : React.FC = () : JSX.Element => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const [isTheInvestigatedHouse, setIsTheInvestigatedHouse] = React.useState<boolean>(false);

    const onIsTheInvestigatedHouseChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean, fieldToUpdate: InteractionEventDialogFields) => {
        const chosenHouse = val ? 'בית פרטי של המתוחקר' : 'בית פרטי אחר';
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [fieldToUpdate] : chosenHouse});
        setIsTheInvestigatedHouse(val);
    }

    const onAddressChange = (address: Address, fieldTpUpdate: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [fieldTpUpdate]: address});

    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='בית המתוחקר'>
                    <Toggle
                        className={classes.toggle}
                        value={isTheInvestigatedHouse}
                        onChange={(event, val) => onIsTheInvestigatedHouseChange(event, val, InteractionEventDialogFields.LOCATION_NAME)}/>
                </FormInput>
            </div>
            <AddressForm updateAddress={(address: Address) => onAddressChange(address, InteractionEventDialogFields.LOCATION_ADDRESS)} />
        </>
    );
};

export default PrivateHouseEventForm;