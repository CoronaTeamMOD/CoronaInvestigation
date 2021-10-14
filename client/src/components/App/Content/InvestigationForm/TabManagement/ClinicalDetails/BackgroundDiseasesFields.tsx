import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';
import { useDispatch } from 'react-redux';
import { setClinicalDetails } from 'redux/ClinicalDetails/ClinicalDetailsActionCreators';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

export const otherBackgroundDiseaseFieldName = 'אחר';

const BackgroundDiseasesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, backgroundDiseases, handleBackgroundIllnessCheck, clinicalDetails, isViewMode } = props;
    const { control, setValue, errors, getValues, clearErrors } = useFormContext();
    const dispatch = useDispatch();

    const setFormValue = (key: keyof ClinicalDetailsData, value: any) => {
        setValue(key, value);
        clearErrors(key);
        dispatch(setClinicalDetails(key, value));
    }

    React.useEffect(() => {
        if (clinicalDetails?.doesHaveBackgroundDiseases === false) {
            setFormValue(ClinicalDetailsFields.BACKGROUND_DESEASSES, []);
            setFormValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, '');
        }
    }, [clinicalDetails?.doesHaveBackgroundDiseases]);

    React.useEffect(() => {
        if (!clinicalDetails?.backgroundDeseases.includes(otherBackgroundDiseaseFieldName)) {
            setFormValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, '');
        }
    }, [clinicalDetails?.backgroundDeseases]);


    return (
        <>
            <FormRowWithInput fieldName='מחלות רקע:' labelLength={2}>
                <Grid item xs={3}>
                    <Controller
                        name={ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='areThereBackgroundDiseases'
                                value={props.value}
                                onChange={(e, value) => {
                                    if (value !== null) {
                                        props.onChange(value)
                                        dispatch(setClinicalDetails(ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES, getValues(ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES)))
                                    }
                                }}
                                disabled={isViewMode}
                            />
                        )}
                    />
                    <InlineErrorText
                        error={errors[ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DISEASES]}
                    />
                </Grid>
            </FormRowWithInput>
            <Collapse in={clinicalDetails?.doesHaveBackgroundDiseases === true}>
                <FormRowWithInput fieldName='' labelLength={2}>
                    <Grid item xs={7}>
                        <Typography color={errors[ClinicalDetailsFields.BACKGROUND_DESEASSES] ? 'error' : 'initial'} >
                            מחלות רקע: (יש לבחור לפחות מחלת רקע אחת)
                        </Typography>
                        <Grid container className={classes.smallGrid}>
                            <Controller
                                name={ClinicalDetailsFields.BACKGROUND_DESEASSES}
                                control={control}
                                render={(props) => (
                                    <>
                                        {
                                            backgroundDiseases.map((backgroundIllness: string) => (
                                                <Grid item xs={6} key={backgroundIllness}>
                                                    <CustomCheckbox
                                                        key={backgroundIllness}
                                                        checkboxElements={[{
                                                            key: backgroundIllness,
                                                            value: backgroundIllness,
                                                            labelText: backgroundIllness,
                                                            checked: props.value.includes(backgroundIllness),
                                                            onChange: () => handleBackgroundIllnessCheck(backgroundIllness, props.onChange, props.value)
                                                        }]}
                                                        isViewMode={isViewMode}
                                                    />
                                                </Grid>
                                            ))
                                        }
                                    </>
                                )}
                            />
                            <Collapse
                                in={clinicalDetails?.backgroundDeseases.includes(otherBackgroundDiseaseFieldName)}>
                                <Grid item xs={2}>
                                    <Controller
                                        name={ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO}
                                        control={control}
                                        render={(props) => (
                                            <AlphanumericTextField
                                                testId='otherBackgroundDisease'
                                                name={ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO}
                                                value={props.value}
                                                onChange={(newValue: string) => props.onChange(newValue)}
                                                onBlur={() => {
                                                    props.onBlur()
                                                    dispatch(setClinicalDetails(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, getValues(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO)));
                                                }}
                                                label='* מחלת רקע'
                                                placeholder='הזן מחלת רקע...'
                                                className={classes.otherTextField}
                                                disabled={isViewMode}
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

export default BackgroundDiseasesFields;

interface Props {
    classes: ClinicalDetailsClasses;
    backgroundDiseases: string[];
    handleBackgroundIllnessCheck: (
        checkedBackgroundIllness: string,
        onChange: (newBackgroundDiseases: string[]) => void,
        selectedBackgroundDiseases: string[]
    ) => void;
    clinicalDetails: ClinicalDetailsData | null;
    isViewMode?: boolean;
};
