import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Divider, Typography, Grid } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { Exposure, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';

import useStyles from '../ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';

const addConfirmedExposureButton: string = 'היתה חשיפה נוספת';

const PossibleExposure = (props: Props) => {

    const {
        wereConfirmedExposures, onExposuresStatusChange,
        exposures, handleChangeExposureDataAndFlightsField,
        onExposureAdded, disableConfirmedExposureAddition,
        onExposureDeleted, isExposureAdded, setIsExposureAdded, isViewMode
    } = props;

    const classes = useStyles();
    const { control, watch } = useFormContext();
    const watchWasConfirmedExposure = watch(fieldsNames.wereConfirmedExposures, wereConfirmedExposures);

    useEffect(() => {
        if (Boolean(isExposureAdded)) {
            onExposureAdded(true, false);
            setIsExposureAdded(false);
        }
    }, [isExposureAdded]);

    return (
        <div className={classes.subForm}>
            <FormTitle title='חשיפה אפשרית' />
            <Grid container justify='flex-start' item alignItems='center' xs={12}>
                <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
                    <>
                        <Grid item xs={2}>
                            <Controller
                                control={control}
                                name={fieldsNames.wereConfirmedExposures}
                                defaultValue={wereConfirmedExposures}
                                render={(props) => {
                                    return (
                                        <Toggle
                                            {...props}
                                            className={classes.wereConfirmedExposures}
                                            onChange={(e, value) => {
                                                if (value !== null) {
                                                    props.onChange(value);
                                                    onExposuresStatusChange(fieldsNames.wereConfirmedExposures, value);
                                                }
                                            }}
                                            disabled={isViewMode}
                                        />
                                    );
                                }}
                            />
                        </Grid>
                        <Controller
                            control={control}
                            name={fieldsNames.wereConfirmedExposuresDesc}
                            render={(props) => {
                                return (
                                    <AlphanumericTextField
                                        {...props}
                                        label='פירוט'
                                        disabled={isViewMode}
                                    />
                                );
                            }}
                        />
                    </>
                </FormRowWithInput>
            </Grid>
            <Collapse in={watchWasConfirmedExposure} className={classes.additionalInformationForm}>
                <div className={classes.patientDetailSpace}>
                    {exposures.map(
                        (exposure, index) =>
                            exposure.wasConfirmedExposure && (
                                <>
                                    <ExposureForm
                                        key={(exposure.id || '') + index.toString()}
                                        fieldsNames={fieldsNames}
                                        exposureAndFlightsData={exposure}
                                        index={index}
                                        handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
                                        onExposureDeleted={() => onExposureDeleted(index)}
                                        isViewMode={isViewMode}
                                        exposures={exposures}
                                    />
                                    <Divider />
                                </>
                            )
                    )}
                    <Grid className={classes.anotherExposureContainer} direction='row'>
                        <Typography variant='caption' className={classes.anotherExposureTitle}>{addConfirmedExposureButton}</Typography>
                        <Toggle
                            className={classes.anotherExposureToggle}
                            value={isExposureAdded}
                            disabled={disableConfirmedExposureAddition || isViewMode}
                            onChange={(e, value) => {
                                if (value !== null) {
                                    setIsExposureAdded(value)
                                }
                            }}
                        />
                    </Grid>
                </div>
            </Collapse>
        </div>
    );
};

interface Props {
    wereConfirmedExposures: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
    exposures: Exposure[];
    handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
    disableConfirmedExposureAddition: boolean;
    onExposureAdded: (wasConfirmedExposure: boolean, wasAbroad: boolean) => void;
    onExposureDeleted: (index: number) => void;
    isExposureAdded: boolean;
    setIsExposureAdded: React.Dispatch<React.SetStateAction<boolean>>;
    isViewMode?: boolean;
};

export default PossibleExposure;