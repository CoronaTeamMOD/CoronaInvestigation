import { Collapse, Grid, TextField, Typography } from '@material-ui/core';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import DatePick from 'commons/DatePick/DatePick';
import Toggle from 'commons/Toggle/Toggle';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import React from 'react';
import { Controller } from 'react-hook-form';

export const otherBackgroundDiseaseFieldName = 'אחר';

const HospitalFields: React.FC<Props> = (props: Props): JSX.Element => {
    const { 
        classes,
        control,
        setError,
        clearErrors,
        errors,
        watchWasHospitalized,
     } = props;

    return (
        <>
            <Grid item xs={2} className={classes.fieldLabel}>
                    <Typography>
                        <b>
                            האם אושפז:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
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
                <Grid item xs={4}>
                    <Collapse in={watchWasHospitalized}>
                        <div className={classes.dates}>
                            <Typography>
                                <b>
                                    בית חולים:
                                </b>
                            </Typography>
                            <Controller
                                name={ClinicalDetailsFields.HOSPITAL}
                                control={control}
                                render={(props) => (
                                    <AlphanumericTextField
                                        className={classes.hospitalInput}
                                        test-id='hospitalInput'
                                        name={ClinicalDetailsFields.HOSPITAL}
                                        value={props.value}
                                        onChange={(newValue: string) =>
                                            props.onChange(newValue)
                                        }
                                        setError={setError}
                                        clearErrors={clearErrors}
                                        errors={errors}
                                        label='בית חולים'
                                        placeholder='הזן בית חולים...'
                                    />
                                )}
                            />
                        </div>
                        <div className={classes.hospitalizationDates}>
                            <div className={classes.spacedDates}>
                                <Controller
                                    name={ClinicalDetailsFields.HOSPITALIZATION_START_DATE}
                                    control={control}
                                    render={(props) => (
                                        <DatePick
                                            label={errors[ClinicalDetailsFields.HOSPITALIZATION_START_DATE]? errors[ClinicalDetailsFields.HOSPITALIZATION_START_DATE].message : 'מתאריך'}
                                            test-id='wasHospitalizedFromDate'
                                            labelText='מתאריך *'
                                            value={props.value}
                                            onBlur={props.onBlur}
                                            onChange={(newDate: Date) =>
                                                props.onChange(newDate)
                                            }
                                            error={errors[ClinicalDetailsFields.HOSPITALIZATION_START_DATE]? true : false}
                                        />
                                    )}
                                />
                            </div>
                            <Controller
                                name={ClinicalDetailsFields.HOSPITALIZATION_END_DATE}
                                control={control}
                                render={(props) => (
                                    <DatePick
                                        label='עד *'
                                        test-id='wasHospitalizedUntilDate'
                                        labelText={errors[ClinicalDetailsFields.HOSPITALIZATION_END_DATE]? errors[ClinicalDetailsFields.HOSPITALIZATION_END_DATE].message : 'עד'}
                                        value={props.value}
                                        onBlur={props.onBlur}
                                        onChange={(newDate: Date) =>
                                            props.onChange(newDate)
                                        }
                                        error={errors[ClinicalDetailsFields.HOSPITALIZATION_END_DATE]? true : false}
                                    />
                                )}
                            />
                        </div>
                    </Collapse>
                </Grid>
        </>
    );
};

interface Props {
    classes: any;
    control: any;
    setError: any;
    clearErrors: any;
    errors: any;
    watchWasHospitalized: boolean;
};

export default HospitalFields;

