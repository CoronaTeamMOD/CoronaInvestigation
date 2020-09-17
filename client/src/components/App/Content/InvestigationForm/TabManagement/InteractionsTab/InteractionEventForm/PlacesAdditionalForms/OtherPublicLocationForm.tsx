import React, {useContext} from 'react';
import {Grid, TextField} from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';

import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const { publicPark, zoo, stadium, amphitheater, beach } = placeTypesCodesHierarchy.otherPublicPlaces.subTypesCodes;

const wideAreas = [
    publicPark,
    zoo,
    stadium,
    amphitheater,
    beach
]

const OtherPublicLocationForm : React.FC = () : JSX.Element => {
    const ctxt = useContext(InteractionEventDialogContext);

    const isWideArea : boolean = wideAreas.includes(ctxt.interactionEventDialogData.placeSubType);

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <Grid item xs={6}>
                <FormInput fieldName='שם המוסד'>
                    <TextField
                        value={ctxt.interactionEventDialogData.placeName}
                        onChange={event => onChange(event, InteractionEventDialogFields.PLACE_NAME)}/>
                </FormInput>
            </Grid>
            <AddressForm removeEntrance removeFloor />
            {
                !isWideArea && <BusinessContactForm/>
            }
        </>
    );
};

export default OtherPublicLocationForm;