import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from '../../NewInteractionEventDialog/NewInteractionEventDialogStyles';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext';
import InteractionEventDialogFields from '../../InteractionsEventDialogContext/InteractionEventDialogFields';

export const hospitals = [
    'איכילוב',
    'תל השומר',
    'הדסה'
]

const HospitalEventForm : React.FC = () : JSX.Element => {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const ctxt = useContext(InteractionEventDialogContext);

    const onFieldChange = (event: React.ChangeEvent<{ value: unknown }>, updatedField: InteractionEventDialogFields) =>
        ctxt.setInteractionEventDialogData({...ctxt.interactionEventDialogData as InteractionEventDialogData, [updatedField]: event.target.value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם בית חולים'>
                        <CircleSelect
                            value={ctxt.interactionEventDialogData?.locationName || ''}
                            onChange={event => onFieldChange(event, InteractionEventDialogFields.LOCATION_NAME)}
                            className={classes.formSelect}
                            options={hospitals}/>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='מחלקה'>
                        <CircleTextField
                            onBlur={(event) => onFieldChange(event, InteractionEventDialogFields.HOSPITAL_DEPARTMENT)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם איש קשר'>
                        <CircleTextField
                            onBlur={event => onFieldChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NAME)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='טלפון איש קשר'>
                        <CircleTextField
                            onBlur={event => onFieldChange(event, InteractionEventDialogFields.BUSINESS_CONTACT_NUMBER)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default HospitalEventForm;