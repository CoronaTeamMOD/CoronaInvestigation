import React from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../../../InteractionEventVariables';

const FlightEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

    const onFlightNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setFlightNumber && ctxt.setFlightNumber(event.target.value);

    const onAirlineChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setAirline && ctxt.setAirline(event.target.value);
    
    const onBoardingCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBoardingCity && ctxt.setBoardingCity(event.target.value);
    
    const onBoardingCountryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBoardingCountry && ctxt.setBoardingCountry(event.target.value);

    const onEndCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setEndCity && ctxt.setEndCity(event.target.value);
    
    const onEndCountryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setEndCountry && ctxt.setEndCountry(event.target.value);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <>
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='מספר טיסה'>
                                <CircleTextField 
                                    value={ctxt.flightNumber} 
                                    onChange={event => onFlightNumberChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='חברת תעופה'>
                                <CircleTextField 
                                    value={ctxt.busCompany} 
                                    onChange={event => onAirlineChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='ארץ מוצא'>
                                <CircleTextField 
                                    value={ctxt.boardingCountry} 
                                    onChange={event => onBoardingCountryChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='עיר מוצא'>
                                <CircleTextField 
                                    value={ctxt.boardingCity} 
                                    onChange={event => onBoardingCityChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>     
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='ארץ יעד'>
                                <CircleTextField 
                                    value={ctxt.endCountry} 
                                    onChange={event => onEndCountryChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='עיר יעד'>
                                <CircleTextField 
                                    value={ctxt.endCity} 
                                    onChange={event => onEndCityChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>
                </>
            }
        </InteractionEventVariablesConsumer>
    );
};

export default FlightEventForm;