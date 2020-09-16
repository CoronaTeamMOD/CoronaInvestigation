import { Grid, TextField } from '@material-ui/core';
import React, { useContext } from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import LocationInput, {GoogleApiPlace} from "commons/LocationInputField/LocationInput";
import InteractionEventAddressFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventAddressFields';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';

import useStyles from './AddressFormStyles';

const AddressForm : React.FC<Props> = (props: Props) : JSX.Element => {
    const { removeFloor, removeEntrance } = props;
        
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
                    { !removeEntrance && <FormInput fieldName='כניסה'>
                            <TextField
                                value={entrance}
                                onChange={(event) => onTextFieldChange(event, InteractionEventAddressFields.ENTRANCE)}/>
                        </FormInput>
                    }
                </Grid>
                <Grid item xs={6}>
                    { !removeFloor && <FormInput fieldName='קומה'>
                        <TextField
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
    removeEntrance?: boolean
}