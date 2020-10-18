import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Collapse, Grid} from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

const IsolationDatesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, control, watchIsInIsolation, errors, trigger, watchIsolationStartDate, watchIsolationEndDate } = props;
    React.useEffect(() => {
        trigger(ClinicalDetailsFields.ISOLATION_START_DATE);
        trigger(ClinicalDetailsFields.ISOLATION_END_DATE);
    }, [watchIsolationStartDate, watchIsolationEndDate]);
    
    return (
        <>
            <FormRowWithInput fieldName='האם שהה בבידוד לפני ביצוע הבדיקה:'>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.IS_IN_ISOLATION}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='isInQuarantine'
                                value={props.value}
                                onChange={(e, value) => {
                                    if (value !== null) {
                                        props.onChange(value)
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>
            </FormRowWithInput>
            <Collapse in={watchIsInIsolation}>
                <Grid item xs={2} className={classes.dates}>
                    <Controller
                        name={ClinicalDetailsFields.ISOLATION_START_DATE}
                        control={control}
                        render={(props) => (
                            <div className={classes.spacedDates}>
                                <DatePick
                                    maxDate={new Date()}
                                    onBlur={props.onBlur}
                                    testId='quarantinedFromDate'
                                    labelText={errors[ClinicalDetailsFields.ISOLATION_START_DATE] ? errors[ClinicalDetailsFields.ISOLATION_START_DATE].message : '* מתאריך'}
                                    value={props.value}
                                    onChange={(newDate: Date) => {
                                        props.onChange(newDate);
                                    }}
                                    error={errors[ClinicalDetailsFields.ISOLATION_START_DATE] ? true : false}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name={ClinicalDetailsFields.ISOLATION_END_DATE}
                        control={control}
                        render={(props) => (
                            <DatePick
                                onBlur={props.onBlur}
                                testId='quarantinedUntilDate'
                                labelText={errors[ClinicalDetailsFields.ISOLATION_END_DATE] ? errors[ClinicalDetailsFields.ISOLATION_END_DATE].message : '* עד'}
                                value={props.value}
                                onChange={(newDate: Date) => {
                                    props.onChange(newDate);
                                }}
                                error={errors[ClinicalDetailsFields.ISOLATION_END_DATE] ? true : false}
                            />
                        )}
                    />
                </Grid>
            </Collapse>
        </>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    watchIsInIsolation: boolean;
    control: Control;
    errors: Record<string, any>;
    trigger: (payload?: string | string[]) => Promise<boolean>;
    watchIsolationStartDate: Date;
    watchIsolationEndDate: Date;
};

export default IsolationDatesFields;
