import React from 'react';
import { Grid, Select, MenuItem } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import useStyles from '../NewInteractionEventDialogStyles';
import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

const hospitals = [
    'איכילוב',
    'תל השומר',
    'הדסה'
]

const HospitalEventForm : React.FC = () : JSX.Element => {

    const classes = useStyles();
    const formClasses = useFormStyles();

    const onNameChange = (event: React.ChangeEvent<any>, ctxt: InteractionEventVariables) => 
        ctxt.setLocationName && ctxt.setLocationName(event.target.value);

    const onHospitalDepartmentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setHospitalDepartment && ctxt.setHospitalDepartment(event.target.value);

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
                        <Grid item xs={5}>
                            <FormInput fieldName='שם בית חולים'>
                                <Select
                                    value={ctxt.locationName}
                                    onChange={event => onNameChange(event, ctxt)}
                                    className={classes.formSelect}>
                                {
                                    hospitals.map((hospitalName: string) => (
                                        <MenuItem key={hospitalName} value={hospitalName}>{hospitalName}</MenuItem>
                                    ))
                                }
                                </Select>
                            </FormInput>
                        </Grid>
                        <Grid item xs={3}>
                            <FormInput fieldName='מחלקה'>
                                <CircleTextField 
                                    value={ctxt.hospitalDepartment} 
                                    onChange={(event) => onHospitalDepartmentChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='כתובת'>
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

export default HospitalEventForm;