import React from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../../../InteractionEventVariables';

const OrganizedTransportationEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

    const onContactNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBuisnessContactName && ctxt.setBuisnessContactName(event.target.value);

    const onContactNumChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBuisnessContactNumber && ctxt.setBuisnessContactNumber(event.target.value);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
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
            }
        </InteractionEventVariablesConsumer>
    );
};

export default OrganizedTransportationEventForm;