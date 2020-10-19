import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

const IsolationProblemFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchIsIsolationProblem } = props;
    const { control } = useFormContext();

    return (
        <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם בעייתי לקיים בידוד:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='isQuarantineProblematic'
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
                <Grid item xs={2}>
                    <Collapse in={watchIsIsolationProblem}>
                        <Controller
                            name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    testId='problematicQuarantineReason'
                                    name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue)}
                                    onBlur={props.onBlur}
                                    placeholder='הכנס סיבה:'
                                    label='סיבה *'
                                    className={classes.isolationProblemTextField}
                                />
                            )}
                        />
                    </Collapse>
                </Grid>
            </Grid>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    watchIsIsolationProblem: boolean;
};

export default IsolationProblemFields;
