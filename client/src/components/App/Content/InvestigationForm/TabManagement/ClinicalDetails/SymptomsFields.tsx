import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

export const otherSymptomFieldName = 'אחר';

const SymptomsFields: React.FC<Props> = (props: Props): JSX.Element => {
    const {
        classes, watchDoesHaveSymptoms, watchSymptoms, watchIsSymptomsDateUnknown, handleSymptomCheck,
        symptoms,
    } = props;
    const { control, errors } = useFormContext();

    return (
        <>
            <FormRowWithInput fieldName='האם יש תסמינים:'>
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
            </FormRowWithInput>

            <FormRowWithInput fieldName=''>
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
                                            labelText: 'תאריך התחלת תסמינים לא ידוע',
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
                                                labelText={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE]?.message || '* תאריך התחלת תסמינים'}
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
                            <Typography color={errors[ClinicalDetailsFields.SYMPTOMS] ? 'error' : 'initial'}>תסמינים:
                                (יש
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
                                                onChange={(newValue: string) => props.onChange(newValue)}
                                                onBlur={props.onBlur}
                                                placeholder='הזן סימפטום...'
                                                label='* סימפטום'
                                                className={classes.otherTextField}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Collapse>
                        </Grid>
                    </Grid>
                </Collapse>
            </FormRowWithInput>
        </>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    watchDoesHaveSymptoms: boolean;
    watchSymptoms: string[];
    watchIsSymptomsDateUnknown: boolean;
    handleSymptomCheck: (
        checkedSymptom: string,
        onChange: (newSymptoms: string[]) => void,
        selectedSymptoms: string[]
    ) => void;
    symptoms: string[];
};

export default SymptomsFields;
