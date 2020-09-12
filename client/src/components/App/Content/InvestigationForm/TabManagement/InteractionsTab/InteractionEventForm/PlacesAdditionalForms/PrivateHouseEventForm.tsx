import React, { useContext } from 'react';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';

import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import { InteractionEventDialogContext } from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const PrivateHouseEventForm : React.FC = () : JSX.Element => {

    return (
        <>
            <AddressForm/>
        </>
    );
};

export default PrivateHouseEventForm;