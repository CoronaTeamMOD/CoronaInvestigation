import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { InteractionEventDialogContext } from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import InteractionEventAddressFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventAddressFields';

const AddressForm : React.FC<Props> = (props: Props) : JSX.Element => {

    const { removeFloor } = props;
        
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);
    const { interactionEventDialogData, setInteractionEventDialogData } = ctxt;
    const { city, houseNumber, street, entrance, floor, neighborhood } = interactionEventDialogData.locationAddress;

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventAddressFields) =>
        setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, 
            locationAddress: {...interactionEventDialogData.locationAddress, [updatedField]: event.target.value}});

    return (
        <>
            <Grid container className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר'>
                        <CircleTextField 
                            value={city}
                            onChange={(event) => onChange(event, InteractionEventAddressFields.CITY)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='שכונה'>
                        <CircleTextField
                            value={neighborhood}
                            onChange={(event) => onChange(event, InteractionEventAddressFields.NEIGHBORHOOD)}/>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='רחוב'>
                        <CircleTextField
                            value={street}
                            onChange={(event) => onChange(event, InteractionEventAddressFields.STREET)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר בית'>
                        <CircleTextField
                            value={houseNumber}
                            onChange={(event) => onChange(event, InteractionEventAddressFields.HOUSE_NUMBER)}/>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='כניסה'>
                        <CircleTextField
                            value={entrance}
                            onChange={(event) => onChange(event, InteractionEventAddressFields.ENTRANCE)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    { !removeFloor && <FormInput fieldName='קומה'>
                        <CircleTextField
                            value={floor}
                            onChange={(event) => onChange(event, InteractionEventAddressFields.FLOOR)}/>
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