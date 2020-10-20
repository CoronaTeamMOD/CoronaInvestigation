import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Grid, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import { ClinicalDetailsClasses } from './ClinicalDetailsStyles';

export const otherBackgroundDiseaseFieldName = 'אחר';

const HospitalFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { classes, watchWasHospitalized, watchHospitalizedStartDate, watchHospitalizedEndDate } = props;
    const { control, errors, trigger } = useFormContext();

    React.useEffect(() => {
        trigger(ClinicalDetailsFields.HOSPITALIZATION_START_DATE);
        trigger(ClinicalDetailsFields.HOSPITALIZATION_END_DATE);
    }, [watchHospitalizedStartDate, watchHospitalizedEndDate])

    return (
        <>
            <Grid id='1' spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם אושפז:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Controller
                        name={ClinicalDetailsFields.WAS_HOPITALIZED}
                        control={control}
                        render={(props) => (
                            <Toggle
                                test-id='wasHospitalized'
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
            <Collapse in={watchWasHospitalized}>
                <Grid container className={classes.smallGrid}>
                    <Grid item xs={12}>
                        <Grid spacing={3} container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                            <Grid item xs={2} className={classes.fieldLabel}>
                                <Typography>
                                    <b>
                                        בית חולים:
                                </b>
                                </Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Controller
                                    name={ClinicalDetailsFields.HOSPITAL}
                                    control={control}
                                    render={(props) => (
                                        <AlphanumericTextField
                                            testId='hospitalInput'
                                            name={ClinicalDetailsFields.HOSPITAL}
                                            value={props.value}
                                            onChange={(newValue: string) => props.onChange(newValue)}
                                            onBlur={props.onBlur}
                                            label='בית חולים'
                                            placeholder='הזן בית חולים...'
                                            className={classes.hospitalInput}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name={ClinicalDetailsFields.HOSPITALIZATION_START_DATE}
                            control={control}
                            render={(props) => (
                                <DatePick
                                    maxDate={new Date()}
                                    labelText={errors[ClinicalDetailsFields.HOSPITALIZATION_START_DATE] ? errors[ClinicalDetailsFields.HOSPITALIZATION_START_DATE].message : '* מתאריך'}
                                    testId='wasHospitalizedFromDate'
                                    value={props.value}
                                    onBlur={props.onBlur}
                                    onChange={(newDate: Date) =>
                                        props.onChange(newDate)
                                    }
                                    error={errors[ClinicalDetailsFields.HOSPITALIZATION_START_DATE] ? true : false}
                                />
                            )}
                        />
                        <Controller
                            name={ClinicalDetailsFields.HOSPITALIZATION_END_DATE}
                            control={control}
                            render={(props) => (
                                <DatePick
                                    testId='wasHospitalizedUntilDate'
                                    labelText={errors[ClinicalDetailsFields.HOSPITALIZATION_END_DATE] ? errors[ClinicalDetailsFields.HOSPITALIZATION_END_DATE].message : '* עד'}
                                    value={props.value}
                                    onBlur={props.onBlur}
                                    onChange={(newDate: Date) =>
                                        props.onChange(newDate)
                                    }
                                    error={errors[ClinicalDetailsFields.HOSPITALIZATION_END_DATE] ? true : false}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Collapse>

        </>
    );
};

interface Props {
    classes: ClinicalDetailsClasses;
    watchWasHospitalized: boolean;
    watchHospitalizedStartDate: Date;
    watchHospitalizedEndDate: Date;
};

export default HospitalFields;
