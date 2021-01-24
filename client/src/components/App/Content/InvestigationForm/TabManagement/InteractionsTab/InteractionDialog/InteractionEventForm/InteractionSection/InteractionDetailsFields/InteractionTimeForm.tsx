import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {isValid} from 'date-fns';
import {Checkbox, FormControlLabel, Grid} from '@material-ui/core';
import FormInput from 'commons/FormInput/FormInput';
import TimePick from 'commons/DatePick/TimePick';
import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import useFormStyles from 'styles/formStyles';

const TimeForm = () => {
    const formClasses = useFormStyles();
    const { control, watch, errors, setValue, clearErrors, setError } = useFormContext();
    const startTime = watch(InteractionEventDialogFields.START_TIME) || null;
    const endTime = watch(InteractionEventDialogFields.END_TIME) || null;
    const isUnknownTime = watch(InteractionEventDialogFields.UNKNOWN_TIME);

    const isEndTimeValid = (fieldName : string, currentTime : Date ) => {
        if(fieldName === InteractionEventDialogFields.END_TIME) {
            return startTime && currentTime.getTime() > startTime.getTime()
        }
        return true;
    };

    const handleTimeChange = (currentTime: Date, interactionDate: Date, fieldName: string) => {
        if (isValid(currentTime)) {
            if(isEndTimeValid(fieldName , currentTime)) {
                let newDate = new Date(interactionDate.getTime());

                newDate.setHours(currentTime.getHours());
                newDate.setMinutes(currentTime.getMinutes());

                if (newDate.getTime()) {
                    clearErrors(fieldName);
                    setValue(fieldName, newDate);
                }
            } else {
                setError(fieldName, {type: 'manual', message: 'שעת סיום לא תקינה'});
            }
        } else {
            setError(fieldName, {type: 'manual', message: 'שעה לא תקינה'});
        }
    };

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <FormInput xs={5} fieldName='משעה'>
                <Controller
                    name={InteractionEventDialogFields.START_TIME}
                    control={control}
                    render={(props) => (
                        <TimePick
                            disabled={isUnknownTime as boolean}
                            testId='contactLocationStartTime'
                            value={startTime}
                            onChange={(newTime: Date) => {
                                handleTimeChange(newTime, startTime, InteractionEventDialogFields.START_TIME)
                            }}
                            labelText={get(errors, props.name) ? get(errors, props.name).message : 'משעה*'}
                            error={get(errors, props.name)}
                        />
                    )}
                />
            </FormInput>
            <FormInput xs={4} fieldName='עד שעה'>
                <Controller
                    name={InteractionEventDialogFields.END_TIME}
                    control={control}
                    render={(props) => (
                        <TimePick
                            disabled={isUnknownTime as boolean}
                            testId='contactLocationEndTime'
                            value={endTime}
                            onChange={(newTime: Date) => {
                                handleTimeChange(newTime, endTime, InteractionEventDialogFields.END_TIME)
                            }}
                            labelText={get(errors, props.name) ? get(errors, props.name).message : 'עד שעה*'}
                            error={get(errors, props.name)}
                        />
                    )}
                />
            </FormInput>
            <FormInput xs={3}>
                <Controller
                    name={InteractionEventDialogFields.UNKNOWN_TIME}
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