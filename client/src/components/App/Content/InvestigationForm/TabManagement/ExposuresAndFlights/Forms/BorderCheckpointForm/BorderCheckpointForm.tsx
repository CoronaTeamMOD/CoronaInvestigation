import { Collapse, Divider, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { Exposure } from "commons/Contexts/ExposuresAndFlights";
import FieldName from "commons/FieldName/FieldName";
import CustomToggle from "commons/Toggle/CustomToggle";
import BorderCheckpoint from "models/BorderCheckpoint";
import BorderCheckpointData from "models/BorderCheckpointData";
import { BorderCheckpointTypeCodes } from "models/enums/BorderCheckpointCodes";
import KeyValuePair from "models/KeyValuePair";
import React from "react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import StoreStateType from "redux/storeStateType";
import FlightsForm from "../FlightsForm/FlightsForm";
import useStyles from "./BorderCheckpointFormStyles";
import useFormStyles from 'styles/formStyles';
import Country from 'models/Country';
import AutocompletedField from "commons/AutoCompletedField/AutocompletedField";
import TimePick from "commons/DatePick/TimePick";
import DatePick from "commons/DatePick/DatePick";
import InlineErrorText from "commons/InlineErrorText/InlineErrorText";

const BorderCheckpointForm = (props: Props) => {

    const { control, watch, setValue, errors } = useFormContext();
    const { fieldContainer } = useFormStyles();
    const { wereFlights, onExposuresStatusChange, exposures, handleChangeExposureDataAndFlightsField,
        onExposureAdded, disableFlightAddition, onExposureDeleted, isViewMode, borderCheckpointData, fieldsNames
    } = props;
    const classes = useStyles();
    const watchBorderCheckpointType = watch(`borderCheckpointData.${fieldsNames.borderCheckpointType}`);
    const watchWereFlights = watch(fieldsNames.wereFlights, wereFlights);
    const borderCheckpointTypes = useSelector<StoreStateType, KeyValuePair[]>(state => state.borderCheckpointTypes);
    const borderCheckpoints = useSelector<StoreStateType, BorderCheckpoint[]>(state => state.borderCheckpoints);
    const [borderCheckpointsByType, setBorderCheckpointsByType] = useState<BorderCheckpoint[]>([]);
    const countries = useSelector<StoreStateType, Map<string, Country>>((state) => state.countries);
    const countryOptions = Array.from(countries).map(([name, value]) => value);

    const borderCheckpointLabel = 'מעבר גבול דרכו נכנס';
    const addFlightButton: string = 'הוסף טיסה לחול';
    const lastDestinationCountryLabel: string = 'היעד בו שהה';
    const arrivalDateToIsraelLabel = 'תאריך כניסה לארץ';
    const arrivalTimeToIsraelLabel = 'שעת כניסה לארץ';

    const handleCountryChange = (selectedCountry: Country | null) => {
        onExposuresStatusChange(fieldsNames.lastDestinationCountry, selectedCountry ? selectedCountry.id : null);
    };

    const getLabel = (option: any) => {
        if (option.displayName) {
            return option.displayName;
        } else if (option !== '') return countries.get(option)?.displayName;
        else return '';
    };

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option: Country) => option.displayName,
    });

    const borderCheckpointErrors = errors && errors.borderCheckpointData ? errors.borderCheckpointData : {};

    const resetBorderCheckpointFields = () => {
        setValue(`borderCheckpointData.${fieldsNames.borderCheckpoint}`, undefined);
        setValue(`borderCheckpointData.${fieldsNames.arrivalDateToIsrael}`, null);
        setValue(`borderCheckpointData.${fieldsNames.arrivalTimeToIsrael}`, null);
        setValue(`borderCheckpointData.${fieldsNames.lastDestinationCountry}`, undefined);
    }

    useEffect(() => {
        setBorderCheckpointsByType(borderCheckpoints.filter(c => c.borderCheckpointTypeId == watchBorderCheckpointType));
    }, [watchBorderCheckpointType])

    return (
        <Collapse in={watchWereFlights}>
            <Grid container direction="column" spacing={2}>
                <Grid item md={2}>
                    <Typography> אופן כניסה לישראל</Typography>
                    <>
                        <Controller
                            name={`borderCheckpointData.${fieldsNames.borderCheckpointType}`}
                            control={control}
                            render={(props) => (
                                <CustomToggle
                                    options={borderCheckpointTypes}
                                    value={props.value}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            props.onChange(value);
                                            onExposuresStatusChange(fieldsNames.borderCheckpointType, value);
                                            resetBorderCheckpointFields();
                                        }
                                    }}
                                />
                            )}
                        />
                        <InlineErrorText
                            error={borderCheckpointErrors[fieldsNames.borderCheckpointType]}
                        />
                    </>
                </Grid>
                {watchBorderCheckpointType &&
                    <Grid item md={2} className={classes.autocomplete}>
                        <>
                            <Controller
                                control={control}
                                name={`borderCheckpointData.${fieldsNames.borderCheckpoint}`}
                                render={(props) => {
                                    return (
                                        <Autocomplete
                                            options={borderCheckpointsByType}
                                            getOptionLabel={(option: BorderCheckpoint) => option.displayName}
                                            value={props.value}
                                            onChange={(event, value) => {
                                                onExposuresStatusChange(fieldsNames.borderCheckpoint, value);
                                                props.onChange(value);
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    label={borderCheckpointLabel}
                                                    {...params}
                                                    placeholder={borderCheckpointLabel}
                                                    error={Boolean(borderCheckpointErrors[fieldsNames.borderCheckpoint])}
                                                />}
                                            disabled={isViewMode}
                                        />
                                    );
                                }}
                            />
                            <InlineErrorText
                                error={borderCheckpointErrors[fieldsNames.borderCheckpoint]}
                            />
                        </>
                    </Grid>
                }
                <Collapse in={watchBorderCheckpointType && watchBorderCheckpointType != BorderCheckpointTypeCodes.FLIGHT}>

                    <Grid item md={2} className={classes.autocomplete}>
                        <Controller
                            control={control}
                            name={`borderCheckpointData.${fieldsNames.lastDestinationCountry}`}
                            defaultValue={borderCheckpointData ? borderCheckpointData['lastDestinationCountry'] : null}
                            render={(props) => {
                                return (
                                    <AutocompletedField
                                        {...props}
                                        value={props.value}
                                        options={countryOptions}
                                        onChange={(event, newValue) => {
                                            const formattedValue = newValue ? newValue.id : null;
                                            props.onChange(formattedValue);
                                            handleCountryChange(newValue);
                                        }}
                                        getOptionLabel={(option) => getLabel(option)}
                                        filterOptions={filterOptions}
                                        label={lastDestinationCountryLabel}
                                        placeholder={lastDestinationCountryLabel}
                                        isViewMode={isViewMode}
                                    />
                                );
                            }}
                        />

                    </Grid>
                    <Grid item md={2} className={classes.arrivalDate}>
                        <>
                            <Controller
                                control={control}
                                name={`borderCheckpointData.${fieldsNames.arrivalDateToIsrael}`}
                                defaultValue={borderCheckpointData?.arrivalDateToIsrael || null}
                                render={(props) => {
                                    return (
                                        <DatePick
                                            {...props}
                                            maxDate={new Date()}
                                            testId='flightFromDate'
                                            labelText={arrivalDateToIsraelLabel}
                                            onChange={(newDate: Date) => {
                                                props.onChange(newDate);
                                                onExposuresStatusChange(fieldsNames.arrivalTimeToIsrael, newDate);
                                            }}
                                            disabled={isViewMode}
                                            error={Boolean(borderCheckpointErrors[fieldsNames.arrivalDateToIsrael])}
                                        />
                                    );
                                }}
                            />
                            <InlineErrorText
                                error={borderCheckpointErrors[fieldsNames.arrivalDateToIsrael]}
                            />
                        </>
                    </Grid>
                    <Grid item md={2}>
                        <>
                            <Controller
                                name={`borderCheckpointData.${fieldsNames.arrivalTimeToIsrael}`}
                                control={control}
                                defaultValue={borderCheckpointData?.arrivalTimeToIsrael || null}
                                render={(props) => (
                                    <TimePick
                                        value={props.value}
                                        onChange={(newTime: string) => {
                                            props.onChange(newTime);
                                            onExposuresStatusChange(fieldsNames.arrivalTimeToIsrael, newTime);
                                        }}
                                        labelText={arrivalTimeToIsraelLabel}
                                        disabled={isViewMode}
                                        error={Boolean(borderCheckpointErrors[fieldsNames.arrivalTimeToIsrael])}

                                    />
                                )}
                            />
                            <InlineErrorText
                                error={borderCheckpointErrors[fieldsNames.arrivalTimeToIsrael]}
                            />
                        </>
                    </Grid>
                </Collapse>

                {
                    watchBorderCheckpointType == BorderCheckpointTypeCodes.FLIGHT &&
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
                                    isViewMode={isViewMode}
                                />
                                <Divider />
                            </>
                        )}
                        <IconButton test-id='addFlight' onClick={() => onExposureAdded(false, true)} disabled={disableFlightAddition || isViewMode}>
                            <AddCircle color={disableFlightAddition ? 'disabled' : 'primary'} />
                        </IconButton>
                        <Typography variant='caption'>{addFlightButton}</Typography>
                    </div>
                }
            </Grid>
        </Collapse>
    );
};

interface Props {
    wereFlights: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
    exposures: Exposure[];
    onExposureAdded: (wasConfirmedExposure: boolean, wasAbroad: boolean) => void;
    disableFlightAddition: boolean;
    borderCheckpointData?: BorderCheckpointData;
    fieldsNames: any;
    handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
    onExposureDeleted: (index: number) => void;
    isViewMode?: boolean;
};

export default BorderCheckpointForm;