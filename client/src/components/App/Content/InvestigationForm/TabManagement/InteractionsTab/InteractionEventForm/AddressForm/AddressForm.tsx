import { Grid } from '@material-ui/core';
import React, { useContext } from 'react';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import {GeocodeResponse} from "commons/LocationInputField/LocationInput";
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';
import Map from "commons/Map/Map";

import useStyles from './AddressFormStyles';

const AddressForm: React.FC = (): JSX.Element => {
    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const ctxt = useContext(InteractionEventDialogContext);
    const {interactionEventDialogData, setInteractionEventDialogData} = ctxt;
    const {locationAddress} = interactionEventDialogData;

    const onGoogleApiLocationTextFieldChange = (newValue: GeocodeResponse | null) => {
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
                        <Map selectedAddress={locationAddress} setSelectedAddress={onGoogleApiLocationTextFieldChange}/>
                    </div>
                </FormInput>
            </Grid>
        </Grid>
    )};

export default AddressForm;