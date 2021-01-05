import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { getMinimalSymptomsStartDate } from 'Utils/ClinicalDetails/useSymptomsUtils';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from '../ClinicalDetailsStyles';

export const otherSymptomFieldName = 'אחר';

const SymptomsFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchDoesHaveSymptoms, watchSymptoms, watchIsSymptomsDateUnknown, handleSymptomCheck, symptoms, didSymptomsDateChangeOccur, setDidSymptomsDateChangeOccur } = props;
    const { control, errors } = useFormContext();
    const { wasInvestigationReopend } = useStatusUtils();

    const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

    const handleDidSymptomsDateChangeOccur = () => {
        !didSymptomsDateChangeOccur &&
            setDidSymptomsDateChangeOccur(true);
    }

    return (
        <>
            <FormRowWithInput fieldName='האם יש תסמינים:'>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.DOES_HAVE_SYMPTOMS}
                        control={control}
                        render={(props) => (
                            <Toggle
                                disabled={wasInvestigationReopend}
                                test-id='areThereSymptoms'
                                value={props.value}
                                onChange={(e, value) => {
                                    if (value !== null) {
                                        handleDidSymptomsDateChangeOccur();
                                        props.onChange(value);
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
                                            disabled:wasInvestigationReopend,
                                            value: props.value,
                                            labelText: 'תאריך התחלת תסמינים לא ידוע',
                                            checked: props.value,
                                            onChange: (e, value) => {
                                                if (value !== null) {
                                                    handleDidSymptomsDateChangeOccur();
                                                    props.onChange(value);
                                                }
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
                                                disabled={wasInvestigationReopend}
                                                onBlur={props.onBlur}
                                                maxDate={new Date()}
                                                minDate={getMinimalSymptomsStartDate(validationDate)}
                                                maxDateMessage={''}
                                                minDateMessage={''}
                                                testId='symptomsStartDate'
                                                value={props.value}
                                                labelText={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE]?.message || '* תאריך התחלת תסמינים'}
                                                onChange={(newDate: Date) => {
                                                    if (newDate !== null) {
                                                        handleDidSymptomsDateChangeOccur();
                                                        props.onChange(newDate)
                                                    }
                                                }}
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
                                לבחור לפחות תסמין אחד)</Typography>
                        }
                        <Grid item container className={classes.smallGrid}>
                            <Controller
                                name={ClinicalDetailsFields.SYMPTOMS}
                                control={control}
                                render={(props) => (
                                    <>
                                        {
                                            symptoms.map((symptom: string) => (
                                                symptom !== otherSymptomFieldName &&
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
                                        <Grid item xs={6} key={otherSymptomFieldName}>
                                            <CustomCheckbox
                                                key={otherSymptomFieldName}
                                                checkboxElements={[{
                                                    key: otherSymptomFieldName,
                                                    value: otherSymptomFieldName,
                                                    labelText: otherSymptomFieldName,
                                                    checked: props.value.includes(otherSymptomFieldName),
                                                    onChange: () => handleSymptomCheck(otherSymptomFieldName, props.onChange, props.value)
                                                }]}
                                            />
                                        </Grid>
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
                                                placeholder='הזן תסמין...'
                                                label='* תסמין'
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
    didSymptomsDateChangeOccur: boolean;
    setDidSymptomsDateChangeOccur: React.Dispatch<React.SetStateAction<boolean>>;
};

export default SymptomsFields;
