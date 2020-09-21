import { Grid, TextField } from '@material-ui/core';
import React, { useContext } from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import LocationInput, {GoogleApiPlace} from "commons/LocationInputField/LocationInput";
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';

import useStyles from './AddressFormStyles';

const AddressForm : React.FC = () : JSX.Element => {
    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const  address = interactionEventDialogData.locationAddress;

    const onGoogleApiLocationTextFieldChange = (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        setInteractionEventDialogData({
            ...ctxt.interactionEventDialogData as InteractionEventDialogData,
            locationAddress: newValue
        });
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
        </>
    );
};

export default AddressForm;