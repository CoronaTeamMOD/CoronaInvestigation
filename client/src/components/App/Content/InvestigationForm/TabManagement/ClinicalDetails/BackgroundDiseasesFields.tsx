import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

export const otherBackgroundDiseaseFieldName = 'אחר';

const BackgroundDiseasesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const {classes, watchBackgroundDiseases, watchDoesHaveBackgroundDiseases, backgroundDiseases, handleBackgroundIllnessCheck} = props;
    const { control, setValue, errors } = useFormContext();

    React.useEffect(() => {
        if(!watchBackgroundDiseases.includes(otherBackgroundDiseaseFieldName)) {
            setValue(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, "");
        }
    }, [watchBackgroundDiseases])

    return (
        <>
            <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם יש לך מחלות רקע:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
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
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Collapse in={watchDoesHaveBackgroundDiseases}>
                <Typography color={errors[ClinicalDetailsFields.BACKGROUND_DESEASSES] ? 'error' : 'initial'} className={classes.backgroundDiseasesLabel}>מחלות רקע: (יש לבחור לפחות מחלת רקע
                    אחת)</Typography>
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
                                    />
                                )}
                            />
                        </Grid>
                    </Collapse>
                </Grid>
            </Collapse>
        </>
    );
};

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
};

export default BackgroundDiseasesFields;
