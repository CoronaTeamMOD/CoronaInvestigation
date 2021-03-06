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

export const otherBackgroundDiseaseFieldName = 'אחר';

const BackgroundDiseasesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchBackgroundDiseases, watchDoesHaveBackgroundDiseases, backgroundDiseases, handleBackgroundIllnessCheck, isViewMode } = props;
    const { control, setValue, errors } = useFormContext();

    React.useEffect(() => {
        if (!watchBackgroundDiseases.includes(otherBackgroundDiseaseFieldName)) {
            setValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, '');
        }
    }, [watchBackgroundDiseases])

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
            <Collapse in={watchDoesHaveBackgroundDiseases}>
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
                                in={watchBackgroundDiseases.includes(otherBackgroundDiseaseFieldName)}>
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
                                                onBlur={props.onBlur}
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
    watchBackgroundDiseases: string[];
    watchDoesHaveBackgroundDiseases: boolean;
    isViewMode?: boolean;
};
