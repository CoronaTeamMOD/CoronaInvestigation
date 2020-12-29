import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AddCircle } from '@material-ui/icons';
import { Collapse, Divider, Typography, IconButton } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import { Exposure, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from '../ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';

interface Props {
    wereConfirmedExposures: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
    exposures: Exposure[];
    handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
    disableConfirmedExposureAddition: boolean;
    onExposureAdded: (wasConfirmedExposure: boolean, wasAbroad: boolean) => void;
}

const addConfirmedExposureButton: string = 'הוסף חשיפה';

const PossibleExposure = (props: Props) => {
    const {
        wereConfirmedExposures,
        onExposuresStatusChange,
        exposures,
        handleChangeExposureDataAndFlightsField,
        onExposureAdded,
        disableConfirmedExposureAddition,
    } = props;
    const classes = useStyles();

    const { control, watch } = useFormContext();

    const watchWasConfirmedExposure = watch(fieldsNames.wereConfirmedExposures, wereConfirmedExposures);

    return (
        <div className={classes.subForm}>
            <FormTitle title='חשיפה אפשרית' />
            <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
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
                                    />
                                    <Divider />
                                </>
                            )
                    )}
                    <IconButton
                        test-id='addConfirmedExposure'
                        onClick={() => onExposureAdded(true, false)}
                        disabled={disableConfirmedExposureAddition}
                    >
                        <AddCircle color={disableConfirmedExposureAddition ? 'disabled' : 'primary'} />
                    </IconButton>
                    <Typography variant='caption'>{addConfirmedExposureButton}</Typography>
                </div>
            </Collapse>
        </div>
    );
};

export default PossibleExposure;
