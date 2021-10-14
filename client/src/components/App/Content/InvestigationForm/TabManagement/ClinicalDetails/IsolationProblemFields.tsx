import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

import { setClinicalDetails } from 'redux/ClinicalDetails/ClinicalDetailsActionCreators';
import { useDispatch } from 'react-redux';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

const IsolationProblemFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, isViewMode, clinicalDetails } = props;
    const { control, errors, getValues, setValue, clearErrors } = useFormContext();
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (clinicalDetails?.isIsolationProblem === false) {
            setValue(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, '');
            clearErrors(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO);
            dispatch(setClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, ''));
        }
    }, [clinicalDetails?.isIsolationProblem]);


    return (
        <>
            <FormRowWithInput fieldName='בעייתי לקיים בידוד:' labelLength={2}>
                <Grid item xs={3}>
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
                                        dispatch(setClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM, value))
                                    }
                                }}
                                disabled={isViewMode}
                            />
                        )}
                    />
                    <InlineErrorText
                        error={errors[ClinicalDetailsFields.IS_ISOLATION_PROBLEM]}
                    />
                </Grid>
            </FormRowWithInput>
            <Collapse in={clinicalDetails?.isIsolationProblem === true}>
                <Grid container spacing={3}>
                    <Grid item xs={2} className={classes.clinicalDetailsStub} />
                    <Grid item xs={3}>
                        <Controller
                            name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    fullWidth
                                    testId='problematicQuarantineReason'
                                    name={ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue)}
                                    onBlur={() => {
                                        props.onBlur();
                                        dispatch(setClinicalDetails(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO, getValues(ClinicalDetailsFields.IS_ISOLATION_PROBLEM_MORE_INFO)));
                                    }}
                                    placeholder='הכנס סיבה:'
                                    label='סיבה *'
                                    className={classes.reasonInputField}
                                    disabled={isViewMode}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Collapse>
        </>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    isViewMode?: boolean;
    clinicalDetails: ClinicalDetailsData | null;
};

export default IsolationProblemFields;
