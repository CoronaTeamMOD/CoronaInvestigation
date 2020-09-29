import React, {useContext} from 'react';
import { Grid } from '@material-ui/core';
import { useForm } from "react-hook-form";

import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'

import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const { publicPark, zoo, stadium, amphitheater, beach, mall } = placeTypesCodesHierarchy.otherPublicPlaces.subTypesCodes;

const wideAreas = [
    publicPark,
    zoo,
    stadium,
    amphitheater,
    beach,
    mall
]

const OtherPublicLocationForm : React.FC = () : JSX.Element => {
    const ctxt = useContext(InteractionEventDialogContext);

    const isWideArea : boolean = wideAreas.includes(ctxt.interactionEventDialogData.placeSubType);

    const onChange = (newValue: string, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: newValue});
        
    const { errors, setError, clearErrors } = useForm();

    return (
        <>
            <Grid item xs={6}>
                <FormInput fieldName='שם המוסד'>
                    <AlphanumericTextField
                        errors={errors}
                        setError={setError}
                        clearErrors={clearErrors}
                        name={InteractionEventDialogFields.PLACE_NAME}
                        value={ctxt.interactionEventDialogData.placeName}
                        onChange={newValue => onChange(newValue, InteractionEventDialogFields.PLACE_NAME)}/>
                </FormInput>
            </Grid>
            <AddressForm/>
            {
                !isWideArea && <BusinessContactForm/>
            }
        </>
    );
};

export default OtherPublicLocationForm;