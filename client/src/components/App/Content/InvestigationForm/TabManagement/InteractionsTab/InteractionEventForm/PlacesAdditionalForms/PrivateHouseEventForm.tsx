import React, {useContext} from 'react';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import { initAddress } from 'models/Address';

const investigatedHouseLocationName : string = 'בית המתוחקר';
const notInvestigatedHouseLocationName : string = 'בית פרטי אחר';

const PrivateHouseEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);
    const { locationName } = ctxt.interactionEventDialogData;

    const [isTheInvestigatedHouse, setIsTheInvestigatedHouse] = React.useState<boolean>(false);

    const onIsTheInvestigatedHouseChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean, fieldToUpdate: InteractionEventDialogFields) => {
        const chosenHouse = val ? investigatedHouseLocationName : notInvestigatedHouseLocationName;
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [fieldToUpdate] : chosenHouse});
    }

    React.useEffect(() => {
        setIsTheInvestigatedHouse(locationName === investigatedHouseLocationName);
    }, [locationName])

    return (
        <>
            <div className={formClasses.formRow}>
                <FormInput fieldName='בית המתוחקר'>
                    <Toggle
                        className={formClasses.formToggle}
                        value={isTheInvestigatedHouse}
                        onChange={(event, val) => onIsTheInvestigatedHouseChange(event, val, InteractionEventDialogFields.LOCATION_NAME)}/>
                </FormInput>
            </div>
            <AddressForm/>
        </>
    );
};

export default PrivateHouseEventForm;