import React from 'react';
import { Grid, Select, MenuItem } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import useStyles from '../NewInteractionEventDialogStyles';
import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

const grades = [
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

    const onAddressChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        (ctxt.setLocationAddress && ctxt.locationAddress) &&
            ctxt.setLocationAddress({...ctxt.locationAddress, city: event.target.value});
    
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
                                <Select
                                    value={ctxt.grade}
                                    onChange={(event: React.ChangeEvent<any>) => onGradeChange(event, ctxt)}
                                    className={classes.formSelect}
                                >
                                {
                                    grades.map((grade: string) => (
                                        <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormInput>
                        </Grid>
                    </div>
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='שם המוסד'>
                                <CircleTextField 
                                    value={ctxt.locationName} 
                                    onChange={event => onNameChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='כתובת המוסד'>
                                <CircleTextField 
                                    value={ctxt.locationAddress?.city} 
                                    onChange={event => onAddressChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>
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