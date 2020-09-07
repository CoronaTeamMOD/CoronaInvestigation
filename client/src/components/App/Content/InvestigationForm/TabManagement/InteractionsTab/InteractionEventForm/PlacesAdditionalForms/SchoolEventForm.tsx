import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';

import Address from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'commons/AddressForm/AddressForm';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from '../../NewInteractionEventDialog/NewInteractionEventDialogStyles';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

export const grades = [
    'א',
    'ב',
    'ג',
    'ד',
    'ה',
    'ו',
    'ז',
    'ח',
    'ט',
    'י',
    'יא',
    'יב',
]

const SchoolEventForm : React.FC = () : JSX.Element => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    const onGradeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    const onAddressChange = (address: Address, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: address});

    const onContactNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    const onContactNumChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='כיתה'>
                        <CircleSelect
                            value={ctxt.interactionEventDialogData?.grade}
                            onChange={(event: React.ChangeEvent<any>) => onGradeChange(event, InteractionEventDialogFields.GRADE)}
                            className={classes.formSelect}
                            options={grades}
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='שם המוסד'>
                        <CircleTextField
                            onBlur={event => onNameChange(event, InteractionEventDialogFields.LOCATION_NAME)}/>
                    </FormInput>
                </Grid>
            </div>
            <AddressForm removeFloor updateAddress={(address: Address) => onAddressChange(address, InteractionEventDialogFields.LOCATION_ADDRESS)} />
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם איש קשר'>
                        <CircleTextField
                            onBlur={event => onContactNameChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='טלפון איש קשר'>
                        <CircleTextField
                            onBlur={event => onContactNumChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NAME)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default SchoolEventForm;