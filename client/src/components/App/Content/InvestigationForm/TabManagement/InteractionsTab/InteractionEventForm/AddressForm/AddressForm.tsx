import React, { useContext } from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventAddressFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventAddressFields';
import LocationInput, {GoogleApiPlace} from "commons/LocationInputField/LocationInput";
import useStyles from './AddressFormStyles';

const AddressForm : React.FC<Props> = (props: Props) : JSX.Element => {
    const { removeFloor } = props;
        
    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { address, entrance, floor } = interactionEventDialogData.locationAddress;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventAddressFields) =>
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, 
            locationAddress: {...interactionEventDialogData.locationAddress, [updatedField]: event.target.value}});

    const onLocationChange = (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData,
            locationAddress: {...interactionEventDialogData.locationAddress, [ InteractionEventAddressFields.ADDRESS]:newValue}});
    };

    return (
                <div className={formClasses.formRow + ' ' + additionalClasses.addressRow}>
                    <div>
                        <FormInput fieldName='כתובת'>
                            <LocationInput selectedAddress={address}
                                           setSelectedAddress={onLocationChange}/>
                        </FormInput>
                    </div>

                    <div>
                        <FormInput fieldName='כניסה'>
                            <CircleTextField
                                value={entrance}
                                onChange={(event) => onChange(event, InteractionEventAddressFields.ENTRANCE)}/>
                        </FormInput>
                    </div>
                    <div>
                        { !removeFloor && <FormInput fieldName='קומה'>
                            <CircleTextField
                                value={floor}
                                onChange={(event) => onChange(event, InteractionEventAddressFields.FLOOR)}/>
                        </FormInput> }
                    </div>
                </div>
    );
};

export default AddressForm;

interface Props {
    removeFloor?: boolean
}