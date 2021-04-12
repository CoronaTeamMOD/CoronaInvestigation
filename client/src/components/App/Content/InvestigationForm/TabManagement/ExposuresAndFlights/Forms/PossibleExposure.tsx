import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Divider, Typography, Grid } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { Exposure, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import useStyles from '../ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';
import AlphanumericTextField from '../../../../../../../commons/AlphanumericTextField/AlphanumericTextField';

const addConfirmedExposureButton: string = 'היתה חשיפה נוספת';

const PossibleExposure = (props: Props) => {

    const {
        wereConfirmedExposures,
        onExposuresStatusChange,
        exposures,
        handleChangeExposureDataAndFlightsField,
        onExposureAdded,
        disableConfirmedExposureAddition,
        onExposureDeleted
    } = props;

    const classes = useStyles();
    const { control, watch } = useFormContext();
    const watchWasConfirmedExposure = watch(fieldsNames.wereConfirmedExposures, wereConfirmedExposures);
	const [isExposureAdded, setIsExposureAdded] = useState<boolean| undefined>(undefined);

    useEffect(() => {
		if (Boolean(isExposureAdded)) {
             onExposureAdded(true, false)
        }
	}, [isExposureAdded]);

    useEffect(() => {
		if (Boolean(onExposureDeleted)) {
            setIsExposureAdded(undefined)
        }
	}, [onExposureDeleted]);

    return (
        <div className={classes.subForm}>
            <FormTitle title='חשיפה אפשרית' />
            <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
                <>
                <Grid xs={1}>
                    <Controller
                        control={control}
                        name={fieldsNames.wereConfirmedExposures}
                        defaultValue={wereConfirmedExposures}
                        render={(props) => {
                            return (
                                <Toggle
                                {...props}
                                onChange={(e, value) => {
                                    if (value !== null) {
                                        props.onChange(value);
                                        onExposuresStatusChange(fieldsNames.wereConfirmedExposures, value);
                                    }
                                }}
                                />
                            );
                            }}
                        />
                </Grid>
                <Grid xs={3}>
                    <Controller
                        control={control}
                        name={fieldsNames.wereConfirmedExposuresDesc}
                        render={(props) => {
                            return (
                                <AlphanumericTextField 
                                    {...props}
                                    label='פירוט'
                                />
                            );
                        }}
                />
                </Grid>
                </>
            </FormRowWithInput>
            <Collapse in={watchWasConfirmedExposure} className={classes.additionalInformationForm}>
                <div>
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
                            disabled={disableConfirmedExposureAddition}
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
};

export default PossibleExposure;