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
        hasBackgroundDeseasesToggle,
        backgroundDiseases,
        handleBackgroundIllnessCheck,
        updateClinicalDetails,
        setError,
        clearErrors,
        errors,
        context
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
                    <Toggle
                        test-id='areThereBackgroundDiseases'
                        value={context.clinicalDetailsData.doesHaveBackgroundDiseases}
                        onChange={hasBackgroundDeseasesToggle}
                    />
                </Grid>
            </Grid>
            <Collapse in={context.clinicalDetailsData.doesHaveBackgroundDiseases}>
                <Typography className={classes.backgroundDiseasesLabel}>מחלות רקע: (יש לבחור לפחות מחלת רקע
                    אחת)</Typography>
                <Grid container className={classes.smallGrid}>
                    {
                        backgroundDiseases.map((backgroundIllness: string) => (
                            <Grid item xs={5} key={backgroundIllness} className={classes.symptomsAndDiseasesCheckbox}>
                                <CustomCheckbox
                                    key={backgroundIllness}
                                    checkboxElements={[{
                                        key: backgroundIllness,
                                        value: backgroundIllness,
                                        labelText: backgroundIllness,
                                        checked: context.clinicalDetailsData.backgroundDeseases.includes(backgroundIllness),
                                        onChange: () => handleBackgroundIllnessCheck(backgroundIllness)
                                    }]}
                                />
                            </Grid>
                        ))
                    }
                    <Collapse
                        in={context.clinicalDetailsData.backgroundDeseases.includes(otherBackgroundDiseaseFieldName)}>
                        <Grid item xs={2}>
                            <AlphanumericTextField
                                test-id='otherBackgroundDisease'
                                name={ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO}
                                value={context.clinicalDetailsData.otherBackgroundDiseasesMoreInfo}
                                onChange={(newValue: string) =>
                                    updateClinicalDetails(ClinicalDetailsFields.OTHER_BACKGROUND_DISEASES_MORE_INFO, newValue as string)
                                }
                                required
                                setError={setError}
                                clearErrors={clearErrors}
                                errors={errors}
                                label='מחלת רקע'
                                placeholder='הזן מחלת רקע...'
                                className={classes.otherTextField}
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
    updateClinicalDetails: any;
    setError: any;
    clearErrors: any;
    errors: any;
    context: any;
    hasBackgroundDeseasesToggle: any;
    backgroundDiseases: any;
    handleBackgroundIllnessCheck: any;
};

export default BackgroundDiseasesFields;

