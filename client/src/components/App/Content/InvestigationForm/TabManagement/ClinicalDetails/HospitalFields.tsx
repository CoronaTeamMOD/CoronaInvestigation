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
        updateClinicalDetails,
        setError,
        clearErrors,
        errors,
        context
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
                    <Toggle
                        test-id='wasHospitalized'
                        value={context.clinicalDetailsData.wasHospitalized}
                        onChange={() => updateClinicalDetails(ClinicalDetailsFields.WAS_HOPITALIZED, !context.clinicalDetailsData.wasHospitalized)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Collapse in={context.clinicalDetailsData.wasHospitalized}>
                        <div className={classes.dates}>
                            <Typography>
                                <b>
                                    בית חולים:
                                </b>
                            </Typography>
                            <TextField
                                className={classes.hospitalInput}
                                required
                                label='בית חולים'
                                test-id='hospitalInput'
                                value={context.clinicalDetailsData.hospital}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => (
                                    updateClinicalDetails(ClinicalDetailsFields.HOSPITAL, event.target.value)
                                )}
                            />
                        </div>
                        <div className={classes.hospitalizationDates}>
                            <div className={classes.spacedDates}>
                                <DatePick
                                    required
                                    label='מתאריך'
                                    test-id='wasHospitalizedFromDate'
                                    labelText='מתאריך'
                                    value={context.clinicalDetailsData.hospitalizationStartDate}
                                    onChange={(newDate: Date) =>
                                        updateClinicalDetails(
                                            ClinicalDetailsFields.HOSPITALIZATION_START_DATE,
                                            newDate
                                        )
                                    }
                                />
                            </div>
                            <DatePick
                                required
                                label='עד'
                                test-id='wasHospitalizedUntilDate'
                                labelText='עד'
                                value={context.clinicalDetailsData.hospitalizationEndDate}
                                onChange={(newDate: Date) =>
                                    updateClinicalDetails(
                                        ClinicalDetailsFields.HOSPITALIZATION_END_DATE,
                                        newDate
                                    )
                                }
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
    updateClinicalDetails: any;
    setError: any;
    clearErrors: any;
    errors: any;
    context: any;
};

export default HospitalFields;

