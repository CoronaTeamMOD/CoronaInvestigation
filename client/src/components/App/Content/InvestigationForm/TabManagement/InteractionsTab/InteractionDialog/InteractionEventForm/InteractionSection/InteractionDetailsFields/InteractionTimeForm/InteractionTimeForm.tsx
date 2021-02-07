import React, {useEffect} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {Checkbox, FormControlLabel, Grid} from '@material-ui/core';

import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import FormInput from 'commons/FormInput/FormInput';
import TimePick from 'commons/DatePick/TimePick';
import useFormStyles from 'styles/formStyles';
import repetitiveFieldTools from '../../RepetitiveEventForm/hooks/repetitiveFieldTools';
import useInteractionTimeForm from './useInteractionTimeForm';

const TimeForm = ({occurrenceIndex, interactionDate}: InteractionTimeFormProps) => {
    const formClasses = useFormStyles();
    const {control, watch, errors, setValue, getValues} = useFormContext();

    const {generateFieldName} = repetitiveFieldTools(occurrenceIndex);
    const {handleTimeChange} = useInteractionTimeForm(occurrenceIndex, interactionDate);

    const startTime = watch(generateFieldName(InteractionEventDialogFields.START_TIME));
    const isUnknownTime = watch(generateFieldName(InteractionEventDialogFields.UNKNOWN_TIME));

    useEffect(()=> {
        !startTime && setValue(generateFieldName( InteractionEventDialogFields.START_TIME),interactionDate);
        const endTime = getValues()[generateFieldName( InteractionEventDialogFields.END_TIME)];
        !endTime && setValue(generateFieldName( InteractionEventDialogFields.END_TIME),interactionDate);
    }, [interactionDate]);

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <FormInput xs={5} labelLength={4} fieldName='משעה'>
                <Controller
                    name={generateFieldName(InteractionEventDialogFields.START_TIME)}
                    control={control}
                    render={(props) => (
                        <TimePick
                            disabled={isUnknownTime as boolean}
                            testId='contactLocationStartTime'
                            value={props.value ?? interactionDate}
                            onChange={(newTime: Date) => {
                                handleTimeChange(newTime, InteractionEventDialogFields.START_TIME)
                            }}
                            labelText={get(errors, props.name) ? get(errors, props.name).message : 'משעה*'}
                            error={get(errors, props.name)}
                        />
                    )}
                />
            </FormInput>
            <FormInput xs={4} fieldName='עד שעה'>
                <Controller
                    name={generateFieldName(InteractionEventDialogFields.END_TIME)}
                    control={control}
                    render={(props) => (
                        <TimePick
                            disabled={isUnknownTime as boolean}
                            testId='contactLocationEndTime'
                            value={props.value ?? interactionDate}
                            onChange={(newTime: Date) => {
                                handleTimeChange(newTime, InteractionEventDialogFields.END_TIME)
                            }}
                            labelText={get(errors, props.name) ? get(errors, props.name).message : 'עד שעה*'}
                            error={get(errors, props.name)}
                        />
                    )}
                />
            </FormInput>
            <FormInput xs={3}>
                <Controller
                    name={generateFieldName(InteractionEventDialogFields.UNKNOWN_TIME)}
                    control={control}
                    render={(props) =>
                        <FormControlLabel
                            label='זמן לא ידוע'
                            control={
                                <Checkbox
                                    color='primary'
                                    checked={props.value}
                                    onChange={(event) => props.onChange(event.target.checked)}
                                />
                            }
                        />
                    }
                />
            </FormInput>
        </Grid>
    );
};

export interface InteractionTimeFormProps {
    occurrenceIndex?: number;
    interactionDate: Date;
}

export default TimeForm;