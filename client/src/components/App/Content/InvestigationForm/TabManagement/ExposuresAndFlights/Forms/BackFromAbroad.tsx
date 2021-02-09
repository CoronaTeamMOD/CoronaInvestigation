import React from 'react';
import { AddCircle } from '@material-ui/icons';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapse, Divider, IconButton, Typography } from '@material-ui/core';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import FormTitle from 'commons/FormTitle/FormTitle';
import FieldName from 'commons/FieldName/FieldName';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { Exposure, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';

import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from '../ExposuresAndFlightsStyles';

const addFlightButton: string = 'הוסף טיסה לחול';

export const BackFromAbroad = (props: Props) => {

    const { control, watch } = useFormContext();
    const { fieldContainer } = useFormStyles();
    const { wereFlights, onExposuresStatusChange, exposures, handleChangeExposureDataAndFlightsField,
        onExposureAdded, disableFlightAddition, onExposureDeleted
    } = props;
    const classes = useStyles();
    const watchWereFlights = watch(fieldsNames.wereFlights, wereFlights);

    return (
        <div className={classes.subForm}>
            <FormTitle title='חזרה מחו״ל' />
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
                                    }
                                }}
                            />
                        );
                    }}
                />
            </FormRowWithInput>

            <Collapse in={watchWereFlights} className={classes.additionalInformationForm}>
                <div>
                    <FieldName fieldName='פרטי טיסת חזור לארץ:' className={fieldContainer} />
                    {exposures.map((exposure, index) =>
                        exposure.wasAbroad &&
                        <>
                            <FlightsForm
                                fieldsNames={fieldsNames}
                                key={(exposure.id || '') + index.toString()}
                                exposureAndFlightsData={exposure}
                                index={index}
                                handleChangeExposureDataAndFlightsField={(fieldName: string, value: any) =>
                                    handleChangeExposureDataAndFlightsField(index, fieldName, value)
                                }
                                onExposureDeleted={() => onExposureDeleted(index)}
                            />
                            <Divider />
                        </>
                    )}
                    <IconButton test-id='addFlight' onClick={() => onExposureAdded(false, true)} disabled={disableFlightAddition}>
                        <AddCircle color={disableFlightAddition ? 'disabled' : 'primary'} />
                    </IconButton>
                    <Typography variant='caption'>{addFlightButton}</Typography>
                </div>
            </Collapse>
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
};