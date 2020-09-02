import React from 'react';
import { Grid } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import useStyles from '../NewInteractionEventDialogStyles';
import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../InteractionEventVariables';

export interface Props {
    setCanCreateEvent: React.Dispatch<React.SetStateAction<boolean>>
}

const PrivateHouseEventForm : React.FC = () : JSX.Element => {

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [isTheInvestigatedHouse, setIsTheInvestigatedHouse] = React.useState<boolean>(false);

    const onIsTheInvestigatedHouseChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean, ctxt: InteractionEventVariables) => {
        if (val) {
            // set location name and address
            ctxt.setLocationName && ctxt.setLocationName('בית פרטי של המתוחקר');
        }
        ctxt.setLocationName && ctxt.setLocationName('בית פרטי אחר');
        setIsTheInvestigatedHouse(val);
    }

    const onAddressChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        (ctxt.setLocationAddress && ctxt.locationAddress) &&
            ctxt.setLocationAddress({...ctxt.locationAddress, city: event.target.value});

    const onFloorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        (ctxt.setLocationAddress && ctxt.locationAddress) &&
            ctxt.setLocationAddress({...ctxt.locationAddress, floor: event.target.value});

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <div className={formClasses.formRow}>
                    <Grid item xs={5}>
                        <FormInput fieldName='בית המתוחקר'>
                            <Toggle 
                                className={classes.toggle}
                                value={isTheInvestigatedHouse} 
                                onChange={(event, val) => onIsTheInvestigatedHouseChange(event, val, ctxt)}/>
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

export default PrivateHouseEventForm;