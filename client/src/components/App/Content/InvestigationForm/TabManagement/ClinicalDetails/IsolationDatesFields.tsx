import React from 'react';
import { Collapse, Grid, Typography } from '@material-ui/core';
import { Controller, Control } from 'react-hook-form';

import DatePick from 'commons/DatePick/DatePick';
import Toggle from 'commons/Toggle/Toggle';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

const IsolationDatesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, control, watchIsInIsolation, errors } = props;

    return (
        <>
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם שהית בבידוד:
                        </b>
                    </Typography>
                </Grid>
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
            </Grid>
            <Collapse in={watchIsInIsolation}>
                <Grid item xs={2} className={classes.dates}>
                    <Controller
                        name={ClinicalDetailsFields.ISOLATION_START_DATE}
                        control={control}
                        render={(props) => (
                            <div className={classes.spacedDates}>
                                <DatePick
                                    onBlur={props.onBlur}
                                    test-id='quarantinedFromDate'
                                    labelText={errors[ClinicalDetailsFields.ISOLATION_START_DATE]? errors[ClinicalDetailsFields.ISOLATION_START_DATE].message : '* מתאריך'}
                                    value={props.value}
                                    onChange={(newDate: Date) => {
                                        props.onChange(newDate);
                                    }}
                                    error={errors[ClinicalDetailsFields.ISOLATION_START_DATE]? true : false}
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
                                test-id='quarantinedUntilDate'
                                labelText={errors[ClinicalDetailsFields.ISOLATION_END_DATE]? errors[ClinicalDetailsFields.ISOLATION_END_DATE].message :'* עד'}
                                value={props.value}
                                onChange={(newDate: Date) => {
                                    props.onChange(newDate);
                                }}
                                error={errors[ClinicalDetailsFields.ISOLATION_END_DATE]? true : false}
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
};

export default IsolationDatesFields;

