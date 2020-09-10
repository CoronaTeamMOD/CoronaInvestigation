import React, { useContext } from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventAddressFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventAddressFields';
import LocationInput, {GoogleApiPlace} from "commons/LocationInputField/LocationInput";
import useStyles from './AddressFormStyles';
import { Grid } from '@material-ui/core';

const AddressForm : React.FC<Props> = (props: Props) : JSX.Element => {
    const { removeFloor } = props;
        
    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { address, entrance, floor } = interactionEventDialogData.locationAddress;

    const onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventAddressFields) =>
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, 
            locationAddress: {...interactionEventDialogData.locationAddress, [updatedField]: event.target.value}});

    const onGoogleApiLocationTextFieldChange = (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData,
            locationAddress: {...interactionEventDialogData.locationAddress, [ InteractionEventAddressFields.ADDRESS]:newValue}});
    };

    return (
        <>
            <Grid container justify='flex-start' className={[formClasses.formRow, additionalClasses.addressRow].join(' ')}>
                <Grid item xs={6}>
                    <FormInput fieldName='כתובת'>
                        <LocationInput selectedAddress={address}
                                        setSelectedAddress={onGoogleApiLocationTextFieldChange}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}/>
            </Grid>
            <Grid className={formClasses.formRow} container justify='flex-start'>
                <Grid item xs={6}>
                    <FormInput fieldName='כניסה'>
                        <CircleTextField
                            value={entrance}
                            onChange={(event) => onTextFieldChange(event, InteractionEventAddressFields.ENTRANCE)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    { !removeFloor && <FormInput fieldName='קומה'>
                        <CircleTextField
                            value={floor}
                            onChange={(event) => onTextFieldChange(event, InteractionEventAddressFields.FLOOR)}/>
                    </FormInput> }
                </Grid>
            </Grid>
        </>
    );
};

export default AddressForm;

interface Props {
    removeFloor?: boolean
}