import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/AddressForm/AddressForm';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import BusinessContactForm from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/BusinessContactForm/BusinessContactForm';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

const publicParkPlaceType = 'גן ציבורי';
const zooPlaceType = 'גן חיות';
const stadiumPlaceType = 'איצטדיון';
const amphitheaterPlaceType = 'אמפי תיאטרון';
const beachPlaceType = 'חוף ים';

const wideAreaPlaceTypes = [
    publicParkPlaceType,
    zooPlaceType,
    stadiumPlaceType,
    amphitheaterPlaceType,
    beachPlaceType
]

const OtherPublicLocationForm : React.FC = () : JSX.Element => {
    const ctxt = useContext(InteractionEventDialogContext);

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <Grid item xs={6}>
                <FormInput fieldName='שם המוסד'>
                    <CircleTextField
                        value={ctxt.interactionEventDialogData.placeName}
                        onChange={event => onChange(event, InteractionEventDialogFields.PLACE_NAME)}/>
                </FormInput>
            </Grid>
            <AddressForm/>
            {
                !wideAreaPlaceTypes.includes(ctxt.interactionEventDialogData.placeSubType) &&
                <BusinessContactForm/>
            }
        </>
    );
};

export default OtherPublicLocationForm;