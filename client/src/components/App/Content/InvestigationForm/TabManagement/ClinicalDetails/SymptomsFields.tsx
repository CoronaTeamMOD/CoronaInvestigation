import { Collapse, Grid, Typography } from '@material-ui/core';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import DatePick from 'commons/DatePick/DatePick';
import Toggle from 'commons/Toggle/Toggle';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import React from 'react';
import { Controller } from 'react-hook-form';

export const otherSymptomFieldName = 'אחר';

const SymptomsFields: React.FC<Props> = (props: Props): JSX.Element => {
    const {
        classes,
        control,
        watchDoesHaveSymptoms,
        watchSymptoms,
        isUnkonwnDateChecked,
        handleUnkonwnDateCheck,
        handleSymptomCheck,
        symptoms,
        setError,
        clearErrors,
        errors,
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
                    <div className={classes.dates}>
                        {
                            !isUnkonwnDateChecked &&
                            <Controller
                                name={ClinicalDetailsFields.SYMPTOMS_START_DATE}
                                control={control}
                                render={(props) => (
                                    <DatePick
                                        onBlur={props.onBlur}
                                        label='תאריך התחלת סימפטומים'
                                        test-id='symptomsStartDate'
                                        value={props.value}
                                        labelText='תאריך התחלת סימפטומים'
                                        onChange={(newDate: Date) =>
                                            props.onChange(newDate)
                                        }
                                        error={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE]? true : false}
                                        errorText={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE]? errors[ClinicalDetailsFields.SYMPTOMS_START_DATE].message : null}
                                    />
                                )}
                            />
                        }
                        <div className={classes.symptomsDateCheckBox}>
                            <CustomCheckbox
                                testId='unkownSymptomsDate'
                                checkboxElements={[{
                                    value: isUnkonwnDateChecked,
                                    labelText: 'תאריך התחלת סימפטומים לא ידוע',
                                    checked: isUnkonwnDateChecked,
                                    onChange: () => (handleUnkonwnDateCheck())
                                }]}
                            />
                        </div>
                    </div>
                    {
                        watchDoesHaveSymptoms &&
                        <Typography>סימפטומים: (יש לבחור לפחות סימפטום אחד)</Typography>
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
                                            test-id='symptomInput'
                                            name={ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO}
                                            value={props.value}
                                            onChange={(newValue: string) =>
                                                props.onChange(newValue)
                                            }
                                            required
                                            label='סימפטום'
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
    classes: any;
    control: any;
    watchDoesHaveSymptoms: any;
    watchSymptoms: any;
    isUnkonwnDateChecked: any;
    handleUnkonwnDateCheck: any;
    handleSymptomCheck: any;
    symptoms: any;
    setError: any;
    clearErrors: any;
    errors: any;
};

export default SymptomsFields;

