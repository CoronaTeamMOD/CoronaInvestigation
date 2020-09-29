import { Grid } from '@material-ui/core';
import React, { useContext } from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import LocationInput, {GoogleApiPlace} from 'commons/LocationInputField/LocationInput';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';

import useStyles from './AddressFormStyles';

const AddressForm: React.FC = (): JSX.Element => {
    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const ctxt = useContext(InteractionEventDialogContext);
    const {interactionEventDialogData, setInteractionEventDialogData} = ctxt;
    const {locationAddress} = interactionEventDialogData;

    const onGoogleApiLocationTextFieldChange = (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        setInteractionEventDialogData({
            ...ctxt.interactionEventDialogData as InteractionEventDialogData,
            locationAddress: newValue
        });
    };

    return (
        <Grid container justify='flex-start' className={[formClasses.formRow, additionalClasses.addressRow].join(' ')}>
            <Grid item xs={4}>
                <FormInput fieldName='כתובת'>
                    <div className={additionalClasses.addressAutoCompleteField}>
                        <LocationInput selectedAddress={locationAddress} setSelectedAddress={onGoogleApiLocationTextFieldChange}/>
                    </div>
                </FormInput>
            </Grid>
        </Grid>
    )};

export default AddressForm;