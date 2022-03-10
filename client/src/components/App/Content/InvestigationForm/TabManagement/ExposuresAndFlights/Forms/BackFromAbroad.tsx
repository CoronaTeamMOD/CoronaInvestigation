import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { Exposure, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import useStyles from '../ExposuresAndFlightsStyles';

import BorderCheckpointData from 'models/BorderCheckpointData';
import BorderCheckpointForm from './BorderCheckpointForm/BorderCheckpointForm';
import { BorderCheckpointTypeCodes } from 'models/enums/BorderCheckpointCodes';


export const BackFromAbroad = (props: Props) => {

    const { control, getValues, setValue } = useFormContext();
    const { wereFlights, onExposuresStatusChange, exposures, handleChangeExposureDataAndFlightsField,
        onExposureAdded, disableFlightAddition, onExposureDeleted, isViewMode, borderCheckpointData
    } = props;
    const classes = useStyles();

    return (
        <div className={classes.subForm}>
            <FormTitle title='חזרה מחו״ל' />
            <Grid item xs={11}>
                <FormRowWithInput testId='wasAbroad' fieldName='האם חזר מחו״ל?' appendantLabelIcon={wereFlights ? <ComplexityIcon tooltipText='חקירה מורכבת' /> : undefined}>
                    <Controller
                        control={control}
                        name={fieldsNames.wereFlights}
                        defaultValue={wereFlights}
                        render={(props) => {
                            return (
                                <Toggle
                                    {...props}
                                    onChange={(event, value) => {
                                        if (value !== null) {
                                            props.onChange(value);
                                            onExposuresStatusChange(fieldsNames.wereFlights, value);
                                            if (value == true && !getValues(`borderCheckpointData.${fieldsNames.borderCheckpointType}`)) {
                                                setValue(`borderCheckpointData.${fieldsNames.borderCheckpointType}`, BorderCheckpointTypeCodes.FLIGHT);
                                            }
                                        }
                                    }}
                                    disabled={isViewMode}
                                />
                            );
                        }}
                    />
                </FormRowWithInput>
            </Grid>

            <BorderCheckpointForm
                wereFlights={wereFlights}
                onExposuresStatusChange={onExposuresStatusChange}
                exposures={exposures}
                handleChangeExposureDataAndFlightsField={handleChangeExposureDataAndFlightsField}
                onExposureAdded={onExposureAdded}
                disableFlightAddition={disableFlightAddition}
                onExposureDeleted={onExposureDeleted}
                isViewMode={isViewMode}
                borderCheckpointData={borderCheckpointData}
                fieldsNames={fieldsNames}
            />
        </div>
    );
};

interface Props {
    wereFlights: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
    exposures: Exposure[];
    handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
    onExposureAdded: (wasConfirmedExposure: boolean, wasAbroad: boolean) => void;
    disableFlightAddition: boolean;
    onExposureDeleted: (index: number) => void;
    isViewMode?: boolean;
    borderCheckpointData?: BorderCheckpointData;
};