import React from 'react';
import { Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

import { InteractionEventVariablesConsumer, InteractionEventVariables } from '../../../InteractionEventVariables';

const TrainEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

    const onTrainLineChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setTrainLine && ctxt.setTrainLine(event.target.value);
    
    const onBoardingCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBoardingCity && ctxt.setBoardingCity(event.target.value);
    
    const onBoardingStationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setBoardingStation && ctxt.setBoardingStation(event.target.value);

    const onEndCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setEndCity && ctxt.setEndCity(event.target.value);
    
    const onEndStationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ctxt: InteractionEventVariables) => 
        ctxt.setEndStation && ctxt.setEndStation(event.target.value);

    return (
        <InteractionEventVariablesConsumer>
            {
                ctxt =>
                <>
                    <div className={formClasses.formRow}>
                        <FormInput fieldName='קו'>
                            <CircleTextField 
                                value={ctxt.trainLine} 
                                onChange={event => onTrainLineChange(event, ctxt)}/>
                        </FormInput>
                    </div>
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='עיר מוצא'>
                                <CircleTextField 
                                    value={ctxt.boardingCity} 
                                    onChange={event => onBoardingCityChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='תחנת עליה'>
                                <CircleTextField 
                                    value={ctxt.boardingStation} 
                                    onChange={event => onBoardingStationChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>     
                    <div className={formClasses.formRow}>
                        <Grid item xs={5}>
                            <FormInput fieldName='עיר יעד'>
                                <CircleTextField 
                                    value={ctxt.endCity} 
                                    onChange={event => onEndCityChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                        <Grid item xs={5}>
                            <FormInput fieldName='תחנת ירידה'>
                                <CircleTextField 
                                    value={ctxt.endStation} 
                                    onChange={event => onEndStationChange(event, ctxt)}/>
                            </FormInput>
                        </Grid>
                    </div>
                </>
            }
        </InteractionEventVariablesConsumer>
    );
};

export default TrainEventForm;