import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { setClinicalDetails } from 'redux/ClinicalDetails/ClinicalDetailsActionCreators';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

export const otherSymptomFieldName = 'אחר';

const SymptomsFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, symptoms, handleSymptomCheck, didSymptomsDateChangeOccur, setDidSymptomsDateChangeOccur,
        isViewMode, clinicalDetails } = props;
    const dispatch = useDispatch();
    const { control, errors, getValues, setValue, clearErrors } = useFormContext();
    const { wasInvestigationReopend } = useStatusUtils();

    const roundDate = (date: Date) => {
        let dayByMilisec = 1000 * 60 * 60 * 24;
        return new Date(Math.round(date.getTime() / dayByMilisec) * dayByMilisec)
    }

    const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

    const handleDidSymptomsDateChangeOccur = () => {
        !didSymptomsDateChangeOccur &&
            setDidSymptomsDateChangeOccur(true);
    }

    const setFormValue = (key: keyof ClinicalDetailsData, value: any) => {
        setValue(key, value);
        clearErrors(key);
        dispatch(setClinicalDetails(key, value));
    }

    React.useEffect(() => {
        if (clinicalDetails?.doesHaveSymptoms === false) {
            let resetSymptomsData = {
                symptoms: [],
                symptomsStartDate: null,
                otherSymptomFieldName: ''
            };

            for (const [key, value] of Object.entries(resetSymptomsData)) {
                setFormValue(key as keyof ClinicalDetailsData, value);
            }
        }
    }, [clinicalDetails?.doesHaveSymptoms]);

    React.useEffect(() => {
        if (!clinicalDetails?.symptoms.includes(otherSymptomFieldName)) {
            setFormValue(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO, '');
        }
    }, [clinicalDetails?.symptoms]);

    React.useEffect(() => {
        if (clinicalDetails?.isSymptomsStartDateUnknown) {
            setFormValue(ClinicalDetailsFields.SYMPTOMS_START_DATE, null);
        }
    }, [clinicalDetails?.isSymptomsStartDateUnknown])

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
                                        dispatch(setClinicalDetails(ClinicalDetailsFields.DOES_HAVE_SYMPTOMS, value));
                                    }
                                }}
                                disabled={isViewMode}
                            />
                        )}
                    />
                    <InlineErrorText
                        error={errors[ClinicalDetailsFields.DOES_HAVE_SYMPTOMS]}
                    />
                </Grid>
            </FormRowWithInput>

            <Collapse in={clinicalDetails?.doesHaveSymptoms}>
                <FormRowWithInput fieldName='' labelLength={2}>
                    <Grid item xs={7}>
                        <Collapse in={!clinicalDetails?.isSymptomsStartDateUnknown}>
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
                                                        dispatch(setClinicalDetails(ClinicalDetailsFields.SYMPTOMS_START_DATE, date));

                                                    }
                                                }}
                                                disabled={isViewMode}
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
                                                    dispatch(setClinicalDetails(ClinicalDetailsFields.IS_SYMPTOMS_DATE_UNKNOWN, value));
                                                }
                                            }
                                        }]}
                                        isViewMode={isViewMode}
                                    />
                                )}
                            />
                        </div>
                        {
                            clinicalDetails?.doesHaveSymptoms &&
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
                                                        isViewMode={isViewMode}
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
                                                isViewMode={isViewMode}
                                            />
                                        </Grid>
                                    </>
                                )}
                            />
                            <Collapse in={clinicalDetails?.symptoms.includes(otherSymptomFieldName)}>
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
                                                onBlur={() => {
                                                    props.onBlur();
                                                    dispatch(setClinicalDetails(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO, getValues(ClinicalDetailsFields.OTHER_SYMPTOMS_MORE_INFO)));
                                                }}
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
    handleSymptomCheck: (
        checkedSymptom: string,
        onChange: (newSymptoms: string[]) => void,
        selectedSymptoms: string[]
    ) => void;
    symptoms: string[];
    didSymptomsDateChangeOccur: boolean;
    setDidSymptomsDateChangeOccur: React.Dispatch<React.SetStateAction<boolean>>;
    isViewMode?: boolean;
    clinicalDetails: ClinicalDetailsData | null;
};

export default SymptomsFields;
