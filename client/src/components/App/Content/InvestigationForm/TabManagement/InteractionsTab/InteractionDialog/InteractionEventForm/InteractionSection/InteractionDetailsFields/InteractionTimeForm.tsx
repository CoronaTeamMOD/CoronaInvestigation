import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {isValid} from 'date-fns';
import {Checkbox, FormControlLabel, Grid} from '@material-ui/core';

import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import FormInput from 'commons/FormInput/FormInput';
import TimePick from 'commons/DatePick/TimePick';
import useFormStyles from 'styles/formStyles';
import repetitiveFieldTools from '../RepetitiveEventForm/hooks/repetitiveFieldTools';

const TimeForm = ({occurrenceIndex, interactionDate}: { occurrenceIndex?: number; interactionDate: Date; }) => {
    const formClasses = useFormStyles();
    const {control, watch, errors, setValue, clearErrors, setError, getValues} = useFormContext();

    const {generateFieldName} = repetitiveFieldTools(occurrenceIndex);

    const startTime = watch(generateFieldName(InteractionEventDialogFields.START_TIME));
    const isUnknownTime = watch(generateFieldName(InteractionEventDialogFields.UNKNOWN_TIME));

    React.useEffect(()=> {
        !startTime && setValue(generateFieldName( InteractionEventDialogFields.START_TIME),interactionDate);
        const endTime = getValues()[generateFieldName( InteractionEventDialogFields.END_TIME)];
        !endTime && setValue(generateFieldName( InteractionEventDialogFields.END_TIME),interactionDate);
    }, [interactionDate]);

    const isEndTimeValid = (fieldName: string, currentTime: Date) => {
        if (fieldName === InteractionEventDialogFields.END_TIME) {
            return startTime && currentTime.getTime() > startTime.getTime()
        }
        return true;
    };

    const handleTimeChange = (currentTime: Date, fieldName: string) => {
        const formFieldName = generateFieldName(fieldName);
        if (isValid(currentTime)) {
            let newDate = new Date(interactionDate);
            newDate.setHours(currentTime.getHours());
            newDate.setMinutes(currentTime.getMinutes());

            if (isEndTimeValid(fieldName, newDate)) {
                if (newDate.getTime()) {
                    clearErrors(formFieldName);
                    setValue(formFieldName, newDate);
                }
            } else {
                setError(formFieldName, {type: 'manual', message: 'שעת סיום לא תקינה'});
            }
        } else {
            setError(formFieldName, {type: 'manual', message: 'שעה לא תקינה'});
        }
    };

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

export default TimeForm;