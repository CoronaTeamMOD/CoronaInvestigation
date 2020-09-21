import React, {useContext} from 'react';
import {Grid, TextField, Typography} from "@material-ui/core";
import FormInput from "commons/FormInput/FormInput";
import InteractionEventDialogFields from "../../InteractionsEventDialogContext/InteractionEventDialogFields";
import {InteractionEventDialogContext} from "../../InteractionsEventDialogContext/InteractionsEventDialogContext";
import InteractionEventDialogData from "/models/Contexts/InteractionEventDialogData";

const PlaceNameForm = ({nameFieldLabel='שם המוסד'}:Props) => {
    const ctxt = useContext(InteractionEventDialogContext);
    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <Grid item xs={6}>
            <FormInput fieldName={nameFieldLabel}>
                <TextField
                    value={ctxt.interactionEventDialogData.placeName}
                    onChange={event => onChange(event, InteractionEventDialogFields.PLACE_NAME)}/>
            </FormInput>
        </Grid>
    );
};

export default PlaceNameForm;

interface Props {
    nameFieldLabel? :string
}