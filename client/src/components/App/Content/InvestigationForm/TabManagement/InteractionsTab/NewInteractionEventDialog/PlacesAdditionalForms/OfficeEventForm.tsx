import React from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

const OfficeEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

    const onAddressChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        (ctxt.setLocationAddress && ctxt.locationAddress) &&
            ctxt.setLocationAddress({...ctxt.locationAddress, city: event.target.value});

    const onFloorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        (ctxt.setLocationAddress && ctxt.locationAddress) &&
            ctxt.setLocationAddress({...ctxt.locationAddress, floor: +event.target.value});

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setLocationName && ctxt.setLocationName(event.target.value);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <div className={formClasses.formRow}>
                    <Grid item xs={5}>
                        <FormInput fieldName='שם המשרד'>
                            <CircleTextField 
                                value={ctxt.locationName} 
                                onChange={(event) => onNameChange(event, ctxt)}/>
                        </FormInput>
                    </Grid>
                    <Grid item xs={5}>
                        <FormInput fieldName='כתובת'>
                            <CircleTextField 
                                value={ctxt.locationAddress?.city} 
                                onChange={(event) => onAddressChange(event, ctxt)}/>
                        </FormInput>
                    </Grid>
                    <Grid item xs={2}>
                        <FormInput fieldName='קומה'>
                            <CircleTextField 
                                value={ctxt.locationAddress?.floor} 
                                onChange={(event) => onFloorChange(event, ctxt)}/>
                        </FormInput>
                    </Grid>
                </div>
            }
        </InteractionEventVariablesConsumer>
    );
};

export default OfficeEventForm;