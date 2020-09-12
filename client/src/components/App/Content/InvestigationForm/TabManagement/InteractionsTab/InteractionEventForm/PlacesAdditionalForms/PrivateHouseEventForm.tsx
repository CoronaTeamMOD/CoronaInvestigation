import React, { useContext } from 'react';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';

import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const PrivateHouseEventForm : React.FC = () : JSX.Element => {

    const { interactionEventDialogData, setInteractionEventDialogData } = useContext(InteractionEventDialogContext);
    const investigatedPersonAddress = React.useContext(personalInfoContext).personalInfoData.address;

    const { placeSubType } = interactionEventDialogData;

    React.useEffect(() => {
        if (placeSubType === placeTypesCodesHierarchy.privateHouse.subTypesCodes.investigatedPersonHouse) {
            setInteractionEventDialogData({...interactionEventDialogData, locationAddress: {
                ...interactionEventDialogData.locationAddress,
                floor: investigatedPersonAddress.floor,
                apartment: investigatedPersonAddress.houseNum
            }});
        }
    }, [placeSubType])

    return (
        <>
            <AddressForm/>
        </>
    );
};

export default PrivateHouseEventForm;