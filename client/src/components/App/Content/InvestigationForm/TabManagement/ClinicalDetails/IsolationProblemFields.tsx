import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

const IsolationProblemFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchIsIsolationProblem } = props;
    const { control, errors } = useFormContext();

    return (
        <FormRowWithInput fieldName='האם בעייתי לקיים בידוד:'>
            <>
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
                    <InlineErrorText 
                        error={errors[ClinicalDetailsFields.IS_ISOLATION_PROBLEM]}
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
            </>
        </FormRowWithInput>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    watchIsIsolationProblem: boolean;
};

export default IsolationProblemFields;
