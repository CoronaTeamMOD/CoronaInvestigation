import React from 'react';
import {Control, Controller} from 'react-hook-form';
import {Collapse, Grid, Typography} from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

export const otherSymptomFieldName = 'אחר';

const SymptomsFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, control, watchDoesHaveSymptoms, watchSymptoms, watchIsSymptomsDateUnknown, handleSymptomCheck,
            symptoms, setError, clearErrors, errors,
    } = props;

    return (
        <>
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם יש סימפטומים:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.DOES_HAVE_SYMPTOMS}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='areThereSymptoms'
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
            <Collapse in={watchDoesHaveSymptoms}>
                <Grid item xs={7}>
                    <div className={classes.symptomsDateCheckBox}>
                        <Controller
                            name={ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN}
                            control={control}
                            render={(props) => (
                                <CustomCheckbox
                                    testId='unkownSymptomsDate'
                                    checkboxElements={[{
                                        value: props.value,
                                        labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                        checked: props.value,
                                        onChange: (e, value) => {
                                            props.onChange(value);
                                        }
                                    }]}
                                />
                            )}
                        />
                    </div>
                    <Collapse in={!watchIsSymptomsDateUnknown}>
                        <div className={classes.dates}>
                            {
                                <Controller
                                    name={ClinicalDetailsFields.SYMPTOMS_START_DATE}
                                    control={control}
                                    render={(props) => (
                                        <DatePick
                                            onBlur={props.onBlur}
                                            maxDate={new Date()}
                                            testId='symptomsStartDate'
                                            value={props.value}
                                            labelText={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE] ? errors[ClinicalDetailsFields.SYMPTOMS_START_DATE].message : '* תאריך התחלת סימפטומים'}
                                            onChange={(newDate: Date) =>
                                                props.onChange(newDate)
                                            }
                                            error={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE] ? true : false}
                                        />
                                    )}
                                />
                            }
                        </div>
                    </Collapse>
                    {
                        watchDoesHaveSymptoms &&
                        <Typography color={errors[ClinicalDetailsFields.SYMPTOMS] ? 'error' : 'initial'}>סימפטומים: (יש
                            לבחור לפחות סימפטום אחד)</Typography>
                    }
                    <Grid item container className={classes.smallGrid}>
                        <Controller
                            name={ClinicalDetailsFields.SYMPTOMS}
                            control={control}
                            render={(props) => (
                                <>
                                    {
                                        symptoms.map((symptom: string) => (
                                            <Grid item xs={6} key={symptom}>
                                                <CustomCheckbox
                                                    key={symptom}
                                                    checkboxElements={[{
                                                        key: symptom,
                                                        value: symptom,
                                                        labelText: symptom,
                                                        checked: props.value.includes(symptom),
                                                        onChange: () => handleSymptomCheck(symptom, props.onChange, props.value)
                                                    }]}
                                                />
                                            </Grid>
                                        ))
                                    }
                                </>
                            )}
                        />
                        <Collapse in={watchSymptoms.includes(otherSymptomFieldName)}>
                            <Grid item xs={2}>
                                <Controller
                                    name={ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO}
                                    control={control}
                                    render={(props) => (
                                        <AlphanumericTextField
                                            testId='symptomInput'
                                            name={ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO}
                                            value={props.value}
                                            onChange={(newValue: string) =>
                                                props.onChange(newValue)
                                            }
                                            onBlur={props.onBlur}
                                            label='* סימפטום'
                                            setError={setError}
                                            clearErrors={clearErrors}
                                            errors={errors}
                                            className={classes.otherTextField}
                                            placeholder='הזן סימפטום...'
                                        />
                                    )}
                                />
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            </Collapse>
        </>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    control: Control;
    watchDoesHaveSymptoms: boolean;
    watchSymptoms: string[];
    watchIsSymptomsDateUnknown: boolean;
    handleSymptomCheck: (
        checkedSymptom: string,
        onChange: (newSymptoms: string[]) => void,
        selectedSymptoms: string[]
    ) => void;
    symptoms: string[];
    setError: (name: string, error: { type?: string, types?: object, message?: string, shouldFocus?: boolean }) => void;
    clearErrors: (name?: string | string[]) => void;
    errors: Record<string, any>;
};

export default SymptomsFields;
