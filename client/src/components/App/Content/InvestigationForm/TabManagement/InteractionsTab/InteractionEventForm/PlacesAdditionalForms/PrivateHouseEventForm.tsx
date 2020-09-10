import React, { useContext } from 'react';

import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';

const investigatedPersonHouseType = 'בית המתוחקר';

const PrivateHouseEventForm : React.FC = () : JSX.Element => {

    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const investigatedPersonAddress = React.useContext(personalInfoContext).personalInfoData.address;

    const { placeSubType } = interactionEventDialogData;

    React.useEffect(() => {
        if (placeSubType === investigatedPersonHouseType) {
            setInteractionEventDialogData({...interactionEventDialogData, locationAddress: investigatedPersonAddress});
        }
    }, [placeSubType])

    return (
        <>
            <AddressForm/>
        </>
    );
};

export default PrivateHouseEventForm;