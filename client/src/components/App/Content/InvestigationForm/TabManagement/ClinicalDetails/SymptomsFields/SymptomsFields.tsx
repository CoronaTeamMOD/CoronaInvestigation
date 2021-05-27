import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { getMinimalSymptomsStartDate } from 'Utils/ClinicalDetails/symptomsUtils';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from '../ClinicalDetailsStyles';

export const otherSymptomFieldName = 'אחר';

const SymptomsFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchDoesHaveSymptoms, watchSymptoms, watchIsSymptomsDateUnknown, handleSymptomCheck, symptoms, didSymptomsDateChangeOccur, setDidSymptomsDateChangeOccur } = props;
    const { control, errors } = useFormContext();
    const { wasInvestigationReopend } = useStatusUtils();

    const roundDate = (date: Date) => {
        let coeff = 1000 * 60 * 60 * 24;
        return new Date(Math.round(date.getTime() / coeff) * coeff)
    }

    const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

    const handleDidSymptomsDateChangeOccur = () => {
        !didSymptomsDateChangeOccur &&
            setDidSymptomsDateChangeOccur(true);
    }

    return (
        <>
            <FormRowWithInput fieldName='יש תסמינים:' labelLength={2}>
                <Grid item xs={3}>
                    <Controller
                        name={ClinicalDetailsFields.DOES_HAVE_SYMPTOMS}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='areThereSymptoms'
                                value={props.value}
                                onChange={(e, value) => {
                                    if (value !== null) {
                                        props.onChange(value);
                                    }
                                }}
                            />
                        )}
                    />
                <InlineErrorText 
                    error={errors[ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]}
                />
                </Grid>
            </FormRowWithInput>

            <Collapse in={watchDoesHaveSymptoms}>
                <FormRowWithInput fieldName='' labelLength={2}>
                    <Grid item xs={7}>
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
                                                minDate={getMinimalSymptomsStartDate(validationDate)}
                                                maxDateMessage=''
                                                minDateMessage=''
                                                testId='symptomsStartDate'
                                                value={props.value}
                                                labelText={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE]?.message || '* תאריך התחלת תסמינים'}
                                                onChange={(newDate: Date) => {
                                                    if (newDate !== null) {
                                                        handleDidSymptomsDateChangeOccur();
                                                        let date = new Date(newDate.toDateString())
                                                        date = roundDate(date)
                                                        props.onChange(date);

                                                    }
                                                }}
                                                error={errors[ClinicalDetailsFields.SYMPTOMS_START_DATE] ? true : false}
                                            />
                                        )}
                                    />
                                }
                            </div>
                        </Collapse>
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
                </FormRowWithInput>
            </Collapse>
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
