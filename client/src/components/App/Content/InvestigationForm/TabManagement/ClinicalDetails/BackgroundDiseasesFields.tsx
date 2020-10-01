import { Collapse, Grid, Typography } from '@material-ui/core';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import Toggle from 'commons/Toggle/Toggle';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import React from 'react';
import { Controller } from 'react-hook-form';

export const otherBackgroundDiseaseFieldName = 'אחר';

const BackgroundDiseasesFields: React.FC<Props> = (props: Props): JSX.Element => {
    const {
        classes,
        control,
        watchBackgroundDiseases,
        watchDoesHaveBackgroundDiseases,
        backgroundDiseases,
        handleBackgroundIllnessCheck,
        setError,
        clearErrors,
        errors,
    } = props;

    return (
        <>
            <Grid spacing={5} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
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
                <Typography color={errors[ClinicalDetailsFields.BACKGROUND_DESEASSES]? 'error' : 'initial'} className={classes.backgroundDiseasesLabel}>מחלות רקע: (יש לבחור לפחות מחלת רקע
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
                                        test-id='otherBackgroundDisease'
                                        name={ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO}
                                        value={props.value}
                                        onChange={(newValue: string) =>
                                            props.onChange(newValue)
                                        }
                                        onBlur={props.onBlur}
                                        setError={setError}
                                        clearErrors={clearErrors}
                                        errors={errors}
                                        error={errors[ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]? true : false}
                                        label={errors[ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO]? errors[ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO].message : '* מחלת רקע'}
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
    classes: any;
    control?: any;
    setError: any;
    clearErrors: any;
    errors: any;
    backgroundDiseases: any;
    handleBackgroundIllnessCheck: any;
    watchBackgroundDiseases: any;
    watchDoesHaveBackgroundDiseases: any;
};

export default BackgroundDiseasesFields;

