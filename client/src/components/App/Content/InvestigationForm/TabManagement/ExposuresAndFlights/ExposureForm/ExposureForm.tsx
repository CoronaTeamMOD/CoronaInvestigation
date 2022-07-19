import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import AlphanumericTextField from "commons/AlphanumericTextField/AlphanumericTextField";
import { fieldsNames } from "commons/Contexts/ExposuresAndFlights";
import DatePick from "commons/DatePick/DatePick";
import TimePick from "commons/DatePick/TimePick";
import InlineErrorText from "commons/InlineErrorText/InlineErrorText";
import CustomToggle from "commons/Toggle/CustomToggle";
import Toggle from "commons/Toggle/Toggle";
import BorderCheckpoint from "models/BorderCheckpoint";
import Country from "models/Country";
import { BorderCheckpointCodes, BorderCheckpointTypeCodes } from "models/enums/BorderCheckpointCodes";
import CountryCodes from "models/enums/CountryCodes";
import ExposureActionFlag from "models/enums/ExposureActionFlags";
import { ExposureData, ExposureDetails, Flight, initialFlight } from "models/ExposureData";
import KeyValuePair from "models/KeyValuePair";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { addNewFlight, setExposureData } from "redux/ExposuresAndFlights/ExposuresAndFlightsActionCreator";
import StoreStateType from "redux/storeStateType";
import ExposureDetailForm from "./ExposureDetailForm/ExposureDetailForm";
import useStyles from "./ExposureFormStyles";
import FlightForm from "./FlightForm/FlightForm";

const ExposureForm = (props: Props) => {

    const {
        isViewMode
    } = props;

    const { control, errors, setValue, getValues } = useFormContext();
    const classes = useStyles();
    const dispatch = useDispatch();

    const wasConfirmedExposureLabel = 'האם היה מגע ידוע עם חולה/חולים מאומתים?';
    const wasInVacationLabel = 'האם שהה באתר נופש?';
    const wasInEventLabel = 'האם ביקר באירוע רב משתתפים?';
    const wasInAboardLabel = 'האם חזר מחו"ל?';
    const borderCheckpointTypeLabel = 'אופן כניסה לישראל';
    const borderCheckpointLabel = 'מעבר גבול דרכו נכנס';
    const lastDestinationCountryLabel = 'יעד בו שהה';
    const arrivalDateToIsraelLabel = 'תאריך כניסה לישראל';
    const arrivalTimeToIsraelLabel = 'שעת כניסה לישראל';
    const addFlightButton = 'הוסף טיסה';
    const addExposureDetailsButton = 'הוסף חשיפה למאומת';

    const exposureAndFlightsData = useSelector<StoreStateType, ExposureData | null>(state => state.exposuresAndFlights.exposureData);
    const borderCheckpointTypes = useSelector<StoreStateType, KeyValuePair[]>(state => state.borderCheckpointTypes);
    const borderCheckpoints = useSelector<StoreStateType, BorderCheckpoint[]>(state => state.borderCheckpoints);
    const countries = useSelector<StoreStateType, Map<string, Country>>((state) => state.countries);


    const [borderCheckpointsByType, setBorderCheckpointsByType] = useState<BorderCheckpoint[]>([]);
    const countryOptions = Array.from(countries).map(([name, value]) => value);
    const exposureDataIsNull = exposureAndFlightsData === null;

    const setExposureFormValues = () => {
        setValue(fieldsNames.wereConfirmedExposures, exposureAndFlightsData?.wasConfirmedExposure);
        setValue(fieldsNames.wereConfirmedExposuresDesc, exposureAndFlightsData?.wereConfirmedExposuresDesc);
        setValue(fieldsNames.wasInVacation, exposureAndFlightsData?.wasInVacation);
        setValue(fieldsNames.wasInEvent, exposureAndFlightsData?.wasInEvent);
        setValue(fieldsNames.wereFlights, exposureAndFlightsData?.wasAbroad);
        setValue(fieldsNames.borderCheckpointType, exposureAndFlightsData?.borderCheckpointType);
        setValue(fieldsNames.borderCheckpoint, exposureAndFlightsData?.borderCheckpoint);
        setValue(fieldsNames.lastDestinationCountry, exposureAndFlightsData?.lastDestinationCountry);
    }

    const setValueInRedux = (key: string, value: any) => {
        dispatch(setExposureData(key as keyof ExposureData, value));
    }

    const initBorderCheckpointType = (value: number | null) => {
        setValue(fieldsNames.borderCheckpointType, value);
        setValueInRedux(fieldsNames.borderCheckpointType, value);
    }

    const initBorderCheckpoint = (value: string | null) => {
        let borderCheckpoint = null;
        if (value) {
            borderCheckpoint = borderCheckpoints.find(b => b.id === value);
        }
        setValue(fieldsNames.borderCheckpoint, borderCheckpoint);
        setValueInRedux(fieldsNames.borderCheckpoint, borderCheckpoint);
    }

    const resetBorderCheckpointFields = (borderCheckpointType: number | null) => {
        if (borderCheckpointType)
            initBorderCheckpoint(borderCheckpointType === BorderCheckpointTypeCodes.FLIGHT ? BorderCheckpointCodes.NATBAG : null);
        setValue(fieldsNames.arrivalDateToIsrael, null);
        setValueInRedux(fieldsNames.arrivalDateToIsrael, null);
        setValue(fieldsNames.arrivalTimeToIsrael, null);
        setValueInRedux(fieldsNames.arrivalTimeToIsrael, null);
        setValue(fieldsNames.lastDestinationCountry, null);
        setValueInRedux(fieldsNames.lastDestinationCountry, null);
    }

    const onAddNewFlightClicked = () => {
       const  defaultCountry = countryOptions.find(c => c.id == CountryCodes.DEFAULT_COUNTRY);
          const newFlight = {
               ...initialFlight,
               flightDestinationCountry:defaultCountry
           }
       dispatch(addNewFlight(newFlight)); 
    }

    useEffect(() => {
        if (exposureAndFlightsData) {
            setExposureFormValues();
        }
    }, [exposureDataIsNull])

    useEffect(() => {
        setBorderCheckpointsByType(borderCheckpoints.filter(c => c.borderCheckpointTypeId == exposureAndFlightsData?.borderCheckpointType));
    }, [exposureAndFlightsData?.borderCheckpointType])

    return (
        <Grid container direction="column" spacing={2} className={classes.subForm}>
            <Grid item >
                <Typography className={classes.label}>
                    {wasConfirmedExposureLabel}
                </Typography>
                <>
                    <Controller
                        control={control}
                        name={fieldsNames.wasConfirmedExposure}
                        defaultValue={exposureAndFlightsData?.wasConfirmedExposure}
                        render={(props) => {
                            return (
                                <Toggle
                                    {...props}
                                    //className={classes.wereConfirmedExposures}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            props.onChange(value);
                                            setValueInRedux(fieldsNames.wasConfirmedExposure, value);
                                        }
                                    }}
                                    disabled={isViewMode}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={fieldsNames.wereConfirmedExposuresDesc}
                        defaultValue={exposureAndFlightsData?.wereConfirmedExposuresDesc}
                        render={(props) => {
                            return (
                                <AlphanumericTextField
                                    {...props}
                                    label='פירוט'
                                    className={classes.wereConfirmedExposuresDesc}
                                    disabled={isViewMode}
                                    onBlur={() => setValueInRedux(fieldsNames.wereConfirmedExposuresDesc, getValues(fieldsNames.wereConfirmedExposuresDesc))}
                                />
                            );
                        }}
                    />
                </>
            </Grid>
            
            {exposureAndFlightsData?.wasConfirmedExposure === true && 
               <>
               <Grid item md={12} container spacing={4} alignItems="center">
                    {exposureAndFlightsData?.exposureDetails.map((exposureDetails: ExposureDetails, index: number) =>
                        (exposureDetails?.actionFlag != ExposureActionFlag.DELETE) && 
                            <ExposureDetailForm
                            isViewMode={isViewMode}
                            index={index}
                            exposureDetails={exposureDetails}></ExposureDetailForm> 
                    )}       
                </Grid>
                
                 <Grid item md={12}>
                   <Button
                       className = {classes.addFlightButton}
                       onClick={() => {/*onAddNewFlightClicked()*/ }/*onExposureAdded(false, true)*/}
                       disabled={/*disableFlightAddition ||*/ isViewMode}
                   >
                      <Add/>
                      <Typography>
                       {addExposureDetailsButton}
                       </Typography>
                   </Button>
               </Grid>
               </>
            }
          


            <Grid item>
                <Typography className={classes.label}>
                    {wasInVacationLabel}
                </Typography>
                <>
                    <Controller
                        control={control}
                        name={fieldsNames.wasInVacation}
                        defaultValue={exposureAndFlightsData?.wasInVacation}
                        render={(props) => {
                            return (
                                <Toggle
                                    {...props}
                                    value={props.value}
                                    onChange={(event, value) => {
                                        if (value !== null) {
                                            props.onChange(value);
                                            setValueInRedux(fieldsNames.wasInVacation, value);
                                        }
                                    }}
                                    disabled={isViewMode}
                                />
                            );
                        }}
                    />
                    <div className={classes.errorMsg}>
                        <InlineErrorText
                            error={errors[fieldsNames.wasInVacation]}
                        />
                    </div>
                </>
            </Grid>
            <Grid item>
                <Typography className={classes.label}>
                    {wasInEventLabel}
                </Typography>
                <>
                    <Controller
                        control={control}
                        name={fieldsNames.wasInEvent}
                        defaultValue={exposureAndFlightsData?.wasInEvent}
                        render={(props) => {
                            return (
                                <Toggle
                                    {...props}
                                    onChange={(event, value) => {
                                        if (value !== null) {
                                            props.onChange(value);
                                            setValueInRedux(fieldsNames.wasInEvent, value);
                                        }
                                    }}
                                    disabled={isViewMode}
                                />
                            )
                        }}
                    />
                    <div className={classes.errorMsg}>
                        <InlineErrorText
                            error={errors[fieldsNames.wasInEvent]}
                        />
                    </div>
                </>
            </Grid>
            <Grid item>
                <Typography className={classes.label}>
                    {wasInAboardLabel}
                </Typography>
                <Controller
                    control={control}
                    name={fieldsNames.wasAbroad}
                    defaultValue={exposureAndFlightsData?.wasAbroad}
                    render={(props) => {
                        return (
                            <Toggle
                                {...props}
                                value={props.value}
                                onChange={(event, value) => {
                                    if (value !== null) {
                                        props.onChange(value);
                                        if (value == true && !exposureAndFlightsData?.borderCheckpointType) {
                                            initBorderCheckpointType(BorderCheckpointTypeCodes.FLIGHT);
                                            initBorderCheckpoint(BorderCheckpointCodes.NATBAG);
                                        }
                                        else if (value == false) {
                                            initBorderCheckpointType(null);
                                            resetBorderCheckpointFields(null);
                                        }
                                        setValueInRedux(fieldsNames.wasAbroad, value);

                                    }
                                }}
                                disabled={isViewMode}
                            />
                        );
                    }}
                />
            </Grid>
            {exposureAndFlightsData?.wasAbroad === true &&
                <Grid item>
                    <Typography className={classes.label}>
                        {borderCheckpointTypeLabel}
                    </Typography>
                    <>
                        <Controller
                            name={fieldsNames.borderCheckpointType}
                            control={control}
                            defaultValue={exposureAndFlightsData?.borderCheckpointType}
                            render={(props) => (
                                <CustomToggle
                                    options={borderCheckpointTypes}
                                    value={props.value}
                                    onChange={(e, value) => {
                                        if (value !== null) {
                                            props.onChange(value);
                                            setValueInRedux(fieldsNames.borderCheckpointType, value);
                                            resetBorderCheckpointFields(value);
                                        }
                                    }}
                                />
                            )}
                        />
                        <div className={classes.errorMsg}>
                            <InlineErrorText
                                error={errors[fieldsNames.borderCheckpointType]}
                            />
                        </div>
                    </>
                </Grid>
            }
            {exposureAndFlightsData?.wasAbroad === true && exposureAndFlightsData?.borderCheckpointType &&
                <Grid item container spacing={4} alignItems="center">
                    <Grid item md={2}>
                        <Controller
                            control={control}
                            name={fieldsNames.borderCheckpoint}
                            defaultValue={exposureAndFlightsData?.borderCheckpoint}
                            render={(props) => {
                                return (
                                    <Autocomplete
                                        options={borderCheckpointsByType}
                                        getOptionLabel={(option: BorderCheckpoint) => option.displayName}
                                        value={props.value}
                                        onChange={(event, value) => {
                                            props.onChange(value);
                                            setValueInRedux(fieldsNames.borderCheckpoint, value);
                                        }}
                                        defaultValue={exposureAndFlightsData?.borderCheckpoint}
                                        renderInput={(params) =>
                                            <TextField
                                                label={borderCheckpointLabel}
                                                {...params}
                                                placeholder={borderCheckpointLabel}
                                                error={Boolean(errors[fieldsNames.borderCheckpoint])}
                                            />}
                                        disabled={isViewMode}
                                    />
                                );
                            }}
                        />
                        <div className={classes.errorMsg}>
                            <InlineErrorText
                                error={errors[fieldsNames.borderCheckpoint]}
                            />
                        </div>
                    </Grid>
                    <Grid item md={2} >
                        <Controller
                            control={control}
                            name={fieldsNames.lastDestinationCountry}
                            defaultValue={exposureAndFlightsData?.lastDestinationCountry}
                            render={(props) => {
                                return (
                                    <Autocomplete
                                        options={countryOptions}
                                        getOptionLabel={(option: Country) => option.displayName}
                                        value={props.value}
                                        onChange={(event, value) => {
                                            props.onChange(value);
                                            setValueInRedux(fieldsNames.lastDestinationCountry, value);
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                label={lastDestinationCountryLabel}
                                                {...params}
                                                placeholder={lastDestinationCountryLabel}
                                                error={Boolean(errors[fieldsNames.lastDestinationCountry])}
                                            />}
                                        disabled={isViewMode}
                                    />
                                );
                            }}
                        />
                        <div className={classes.errorMsg}>
                            <InlineErrorText
                                error={errors[fieldsNames.lastDestinationCountry]}
                            />
                        </div>
                    </Grid>

                </Grid>
            }
            {exposureAndFlightsData?.wasAbroad === true && exposureAndFlightsData?.borderCheckpointType && exposureAndFlightsData?.borderCheckpointType != BorderCheckpointTypeCodes.FLIGHT &&
                <Grid item container spacing={4} alignItems="center">

                    <Grid item md={2}>
                        <Controller
                            control={control}
                            name={fieldsNames.arrivalDateToIsrael}
                            defaultValue={exposureAndFlightsData?.arrivalDateToIsrael || null}
                            render={(props) => {
                                return (
                                    <DatePick
                                        {...props}
                                        placeholder={arrivalDateToIsraelLabel}
                                        maxDate={new Date()}
                                        testId='flightFromDate'
                                        labelText={arrivalDateToIsraelLabel}
                                        onChange={(newDate: Date) => {
                                            props.onChange(newDate);
                                            setValueInRedux(fieldsNames.arrivalDateToIsrael, newDate);
                                        }}
                                        disabled={isViewMode}
                                        error={Boolean(errors[fieldsNames.arrivalDateToIsrael])}
                                        fullWidth
                                    />
                                );
                            }}
                        />
                        <div className={classes.errorMsg}>
                            <InlineErrorText
                                error={errors[fieldsNames.arrivalDateToIsrael]}
                            />
                        </div>
                    </Grid>

                    <Grid item md={2}>
                        <Controller
                            name={fieldsNames.arrivalTimeToIsrael}
                            control={control}
                            defaultValue={exposureAndFlightsData?.arrivalTimeToIsrael || null}
                            render={(props) => (
                                <TimePick
                                    value={props.value}
                                    onChange={(newTime: string) => {
                                        props.onChange(newTime);
                                        setValueInRedux(fieldsNames.arrivalTimeToIsrael, newTime);
                                    }}
                                    labelText={arrivalTimeToIsraelLabel}
                                    disabled={isViewMode}
                                    error={Boolean(errors[fieldsNames.arrivalTimeToIsrael])}
                                    fullWidth
                                // margin='none'
                                />
                            )}
                        />
                        <div className={classes.errorMsg}>
                            <InlineErrorText
                                error={errors[fieldsNames.arrivalTimeToIsrael]}
                            />
                        </div>
                    </Grid>

                </Grid>
            }
            {exposureAndFlightsData?.wasAbroad === true && exposureAndFlightsData?.borderCheckpointType && exposureAndFlightsData?.borderCheckpointType == BorderCheckpointTypeCodes.FLIGHT &&
               <>
               <Grid item md={12} container spacing={4} alignItems="center">
                    {exposureAndFlightsData?.flights.map((flight: Flight, index: number) =>
                        (flight?.actionFlag != ExposureActionFlag.DELETE) && 
                            <FlightForm
                            isViewMode={isViewMode}
                            index={index}
                            flight={flight}></FlightForm> 
                    )}       
                </Grid>
                
                 <Grid item md={12}>
                   <Button
                       className = {classes.addFlightButton}
                       onClick={() => {onAddNewFlightClicked() }/*onExposureAdded(false, true)*/}
                       disabled={/*disableFlightAddition ||*/ isViewMode}
                   >
                      <Add/>
                      <Typography>
                       {addFlightButton}
                       </Typography>
                   </Button>
               </Grid>
               </>
            }
        </Grid>
    );
};




interface Props {
    isViewMode?: boolean;
};

export default ExposureForm;