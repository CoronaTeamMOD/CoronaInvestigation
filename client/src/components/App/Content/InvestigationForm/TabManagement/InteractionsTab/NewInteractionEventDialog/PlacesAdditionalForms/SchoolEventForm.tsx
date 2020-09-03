import React from 'react';
import { Grid } from '@material-ui/core';

import Address from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import AddressForm from 'commons/AddressForm/AddressForm';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import useStyles from '../NewInteractionEventDialogStyles';
import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

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

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setLocationName && ctxt.setLocationName(event.target.value);

    const onGradeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setGrade &&
            ctxt.setGrade(event.target.value);

    const onAddressChange = (ctxt: InteractionEventVariables, address: Address) => 
        ctxt.setLocationAddress && ctxt.setLocationAddress(address); 

    const onContactNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBuisnessContactName && ctxt.setBuisnessContactName(event.target.value);

    const onContactNumChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBuisnessContactNumber && ctxt.setBuisnessContactNumber(event.target.value);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <>
                    <div className={formClasses.formRow}>
                        <Grid item xs={3}>
                            <FormInput fieldName='כיתה'>
                                <CircleSelect
                                    value={ctxt.grade}
                                    onChange={(event: React.ChangeEvent<any>) => onGradeChange(event, ctxt)}
                                    className={classes.formSelect}
                                    options={grades}
                                />
                            </FormInput>
                        </Grid>
                    </div>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='שם המוסד'>
                            <CircleTextField 
                                value={ctxt.locationName || ''} 
                                onChange={event => onNameChange(event, ctxt)}/>
                        </FormInput>
                    </div>
                    <AddressForm removeFloor updateAddress={(address: Address) => onAddressChange(ctxt, address)} />
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='שם איש קשר'>
                                <CircleTextField 
                                    value={ctxt.buisnessContactName} 
                                    onChange={event => onContactNameChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='טלפון איש קשר'>
                                <CircleTextField 
                                    value={ctxt.buisnessContactNumber} 
                                    onChange={event => onContactNumChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>
                </>
            }
        </InteractionEventVariablesConsumer>
    );
};

export default SchoolEventForm;