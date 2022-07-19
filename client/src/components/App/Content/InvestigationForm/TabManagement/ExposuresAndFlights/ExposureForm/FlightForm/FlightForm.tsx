import { Accordion, AccordionDetails, AccordionSummary, Grid, IconButton, Link, TextField, Typography } from "@material-ui/core";
import { Delete, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { fieldsNames } from "commons/Contexts/ExposuresAndFlights";
import DatePick from "commons/DatePick/DatePick";
import InlineErrorText from "commons/InlineErrorText/InlineErrorText";
import { Flight } from "models/ExposureData";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import StoreStateType from "redux/storeStateType";
import useStyles from "./FlightFormStyles";
import Country from "models/Country";
import AlphabetWithDashTextField from "commons/AlphabetWithDashTextField/AlphabetWithDashTextField";
import { fetchFlightsByAirlineID } from "httpClient/exposure";
import FlightNumberTextField from "commons/FlightNumberTextField/FlightNumberTextField";
import FlightNumberCodes from "models/enums/FlightNumberCodes";
import { removeFlight, setFlightData } from "redux/ExposuresAndFlights/ExposuresAndFlightsActionCreator";
import useCustomSwal from "commons/CustomSwal/useCustomSwal";
import theme from "styles/theme";
import ExposureActionFlag from "models/enums/ExposureActionFlags";
import { format, isValid } from 'date-fns';


const FlightForm = (props: Props) => {

    const flightTitle = 'פרטי טיסה חזור לארץ';
    const startDateLabel = 'מתאריך';
    const endDateLabel = 'עד תאריך';
    const sourceCountryLabel = 'מוצא';
    const destinationCountryLabel = 'יעד';
    const airportLabel = 'שם שדה תעופה';
    const airlineLabel = 'חברת תעופה';
    const flightNumLabel = 'מספר טיסה';
    const otherflightNumLabel = 'מספר טיסה אחר';
    const flightSeatNumLabel = 'מספר מושב';
    const otherAirlineLabel = 'חברת תעופה אחרת'
    const otherFlightNum = 'אחר';
    const deleteButtonText = 'מחיקה';
    const flightDeleteWarningTitle = 'מחיקת טיסה';
    const flightDeleteWarningMsg = 'האם אתה בטוח שתרצה למחוק את הטיסה?';
    const displayDateFormat = 'dd/MM/yyyy';

    const {
        isViewMode, index, flight
    } = props;

    const { control, errors, setValue, getValues, trigger } = useFormContext();
    const { alertWarning } = useCustomSwal();

    const flightErrors = errors ? (errors.flights ? errors.flights[index] : {}) : {};
    const classes = useStyles();
    const dispatch = useDispatch();

    const [flights, setFlights] = useState<string[]>([]);
    const countries = useSelector<StoreStateType, Map<string, Country>>((state) => state.countries);
    const countryOptions = Array.from(countries).map(([name, value]) => value);

    const airlines = useSelector<StoreStateType, Map<string, string>>(state => state.airlines);
    const formattedAirlines = Array.from(airlines).map(airline => { return { id: airline[0], displayName: airline[1] } })

    const setValueInRedux = (key: string, value: any) => {
        dispatch(setFlightData(key as keyof Flight, value, index, flight.id));
    }

    const initOtherFlightNumber = () => {
        setValue(`flights[${index}].${fieldsNames.otherFlightNum}`, '');
        setValueInRedux(fieldsNames.otherFlightNum, '');
    }


    const initFlightNumberData = () => {
        setValue(`flights[${index}].${fieldsNames.otherAirline}`, '');
        setValueInRedux(fieldsNames.otherAirline, '');
        setValue(`flights[${index}].${fieldsNames.flightNumber}`, undefined);
        setValueInRedux(fieldsNames.flightNumber, undefined);
        initOtherFlightNumber();
    }

    const triggerFlightFields = () => {
        trigger(`flights[${index}].${fieldsNames.flightStartDate}`);
        trigger(`flights[${index}].${fieldsNames.flightEndDate}`);
        trigger(`flights[${index}].${fieldsNames.originAirport}`);
        trigger(`flights[${index}].${fieldsNames.originCountry}`);
        trigger(`flights[${index}].${fieldsNames.destinationAirport}`);
        trigger(`flights[${index}].${fieldsNames.destinationCountry}`);
        trigger(`flights[${index}].${fieldsNames.flightNumber}`);
        trigger(`flights[${index}].${fieldsNames.airline}`);
        trigger(`flights[${index}].${fieldsNames.otherAirline}`);
        trigger(`flights[${index}].${fieldsNames.otherFlightNum}`);
    }

    const onAccordionExpanded = (isExpanded: boolean) => {
        setExpanded(isExpanded);
        if (isExpanded) {
            triggerFlightFields();
        }
    }

    const onRemoveFlightClicked = () => {

        alertWarning(flightDeleteWarningMsg, {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                dispatch(removeFlight(index, flight.id));
            }
        })
    }

    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        if (flight.airline && flight.airline.id) {
            fetchFlightsByAirlineID(flight.airline.id.toString()).then(res => {
                if (res) {
                    setFlights(res);
                }
            })
        }
    }, [flight.airline])

    useEffect(() => {
        trigger(`flights[${index}].${fieldsNames.flightStartDate}`);
        trigger(`flights[${index}].${fieldsNames.flightEndDate}`);
    }, [flight.flightStartDate, flight.flightEndDate]);



    return (
        <Accordion
            className={classes.accordion}
            TransitionProps={{ unmountOnExit: true }}
            onChange={(e, expanded) => onAccordionExpanded(expanded)}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel1a-content'
                id='panel1a-header'
                dir='ltr'
            >
                <Grid container spacing={2} direction="row-reverse">
                    <Grid item md={10} >
                        <Typography className={classes.flightTitle}> {flightTitle}
                            {expanded === false && <>
                                {flight.flightStartDate && isValid(new Date(flight.flightStartDate)) && <> <span> | {startDateLabel}: </span><span> {format(new Date(flight.flightStartDate), displayDateFormat)}</span> </>}
                                {flight.flightEndDate && isValid(new Date(flight.flightEndDate)) && <> <span> | {endDateLabel}: </span><span> {format(new Date(flight.flightEndDate), displayDateFormat)}</span> </>}
                                {flight.flightOriginCountry && <> <span> | {sourceCountryLabel}: </span><span> {flight.flightOriginCountry.displayName}</span> </>}
                                {flight.flightNum && <> <span> | {flightNumLabel}: </span><span> {flight.flightNum}</span> </>}
                            </>}
                        </Typography>



                    </Grid>
                    <Grid item md={2}>
                        <IconButton onClick={onRemoveFlightClicked} disabled={isViewMode}>
                            <Delete />
                        </IconButton>
                        <Link component='button' onClick={onRemoveFlightClicked} disabled={isViewMode}>{deleteButtonText}</Link>
                    </Grid>
                </Grid></AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item md={12} container spacing={4} alignItems="center">
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.flightStartDate}`}
                                defaultValue={flight.flightStartDate || null}
                                render={(props) => {
                                    return (
                                        <DatePick
                                            {...props}
                                            placeholder={startDateLabel}
                                            maxDate={new Date()}
                                            labelText={startDateLabel}
                                            onChange={(newDate: Date) => {
                                                props.onChange(newDate);
                                                setValueInRedux(fieldsNames.flightStartDate, newDate);
                                            }}
                                            disabled={isViewMode}
                                            error={Boolean(flightErrors && flightErrors[fieldsNames.flightStartDate])}
                                            fullWidth
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.flightStartDate]}
                                />
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.flightEndDate}`}
                                defaultValue={flight.flightEndDate || null}
                                render={(props) => {
                                    return (
                                        <DatePick
                                            {...props}
                                            placeholder={endDateLabel}
                                            maxDate={new Date()}
                                            labelText={endDateLabel}
                                            onChange={(newDate: Date) => {
                                                props.onChange(newDate);
                                                setValueInRedux(fieldsNames.flightEndDate, newDate);
                                            }}
                                            disabled={isViewMode}
                                            error={flightErrors && Boolean(flightErrors[fieldsNames.flightEndDate])}
                                            fullWidth
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.flightEndDate]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item md={12} container spacing={4} alignItems="center">
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.originCountry}`}
                                defaultValue={flight.flightOriginCountry || null}
                                render={(props) => {
                                    return (
                                        <Autocomplete
                                            options={countryOptions}
                                            getOptionLabel={(option: Country) => option.displayName}
                                            value={props.value}
                                            onChange={(event, value) => {
                                                props.onChange(value);
                                                setValueInRedux(fieldsNames.originCountry, value);
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    label={sourceCountryLabel}
                                                    {...params}
                                                    placeholder={sourceCountryLabel}
                                                    error={flightErrors && Boolean(flightErrors[fieldsNames.originCountry])}
                                                />}
                                            disabled={isViewMode}
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.originCountry]}
                                />
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.originAirport}`}
                                defaultValue={flight.flightOriginAirport}
                                render={(props) => {
                                    return (
                                        <AlphabetWithDashTextField
                                            {...props}
                                            value={props.value || ''}
                                            InputLabelProps={{
                                                className: classes.airportTextbox,
                                            }}
                                            placeholder={airportLabel}
                                            label={airportLabel}
                                            disabled={isViewMode}
                                            onBlur={() => { setValueInRedux(fieldsNames.originAirport, getValues(`flights[${index}].${fieldsNames.originAirport}`)) }}
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.originAirport]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item md={12} container spacing={4} alignItems="center">
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.destinationCountry}`}
                                defaultValue={flight.flightDestinationCountry || null}
                                render={(props) => {
                                    return (
                                        <Autocomplete
                                            options={countryOptions}
                                            getOptionLabel={(option: Country) => option.displayName}
                                            value={props.value}
                                            onChange={(event, value) => {
                                                props.onChange(value);
                                                setValueInRedux(fieldsNames.destinationCountry, value);
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    label={destinationCountryLabel}
                                                    {...params}
                                                    placeholder={destinationCountryLabel}
                                                    error={flightErrors && Boolean(flightErrors[fieldsNames.destinationCountry])}
                                                />}
                                            disabled={isViewMode}
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.destinationCountry]}
                                />
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.destinationAirport}`}
                                defaultValue={flight.flightDestinationAirport || null}
                                render={(props) => {
                                    return (
                                        <AlphabetWithDashTextField
                                            {...props}
                                            value={props.value || ''}
                                            InputLabelProps={{
                                                className: classes.airportTextbox,
                                            }}
                                            placeholder={airportLabel}
                                            label={airportLabel}
                                            disabled={isViewMode}
                                            onBlur={() => { setValueInRedux(fieldsNames.destinationAirport, getValues(`flights[${index}].${fieldsNames.destinationAirport}`)) }}
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.destinationAirport]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item md={12} container spacing={4} alignItems="center">
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.airline}`}
                                defaultValue={flight.airline || null}
                                render={(props) => {
                                    return (
                                        <Autocomplete
                                            options={formattedAirlines}
                                            getOptionLabel={(option) => option.displayName}
                                            value={props.value}
                                            onChange={(event, newAirline) => {
                                                props.onChange(newAirline ?? null);
                                                setValueInRedux(fieldsNames.airline, newAirline ?? null);
                                                if (newAirline) {
                                                    initFlightNumberData();
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    error={flightErrors && Boolean(flightErrors[fieldsNames.airline])}
                                                    label={airlineLabel}
                                                    {...params}
                                                    placeholder={airlineLabel}
                                                />}
                                            disabled={isViewMode}
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.airline]}
                                />
                            </div>
                        </Grid>
                        {flight.airline && flight.airline.id == FlightNumberCodes.OTHER &&
                            <Grid item md={3}>
                                <Controller
                                    control={control}
                                    name={`flights[${index}].${fieldsNames.otherAirline}`}
                                    defaultValue={flight.otherAirline || null}
                                    render={(props) => {
                                        return (
                                            <TextField
                                                {...props}
                                                inputProps={{ maxLength: 50 }}
                                                value={props.value}
                                                onChange={(value) => {
                                                    props.onChange(value);
                                                }}
                                                placeholder={otherAirlineLabel}
                                                label={otherAirlineLabel}
                                                disabled={isViewMode}
                                                onBlur={() => { setValueInRedux(fieldsNames.otherAirline, getValues(`flights[${index}].${fieldsNames.otherAirline}`)) }}
                                            />
                                        );
                                    }}
                                />
                                <div className={classes.errorMsg}>
                                    <InlineErrorText
                                        error={flightErrors && flightErrors[fieldsNames.otherAirline]}
                                    />
                                </div>
                            </Grid>
                        }
                        <Grid item md={3}>
                            <Controller
                                control={control}
                                name={`flights[${index}].${fieldsNames.flightNumber}`}
                                defaultValue={flight.flightNum}
                                render={(props) => {
                                    return (
                                        <Autocomplete
                                            options={flights}
                                            value={props.value}
                                            onChange={(event, newFlight) => {
                                                const data = newFlight ?? '';
                                                props.onChange(data);
                                                setValueInRedux(fieldsNames.flightNumber, data);
                                                initOtherFlightNumber();
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    error={flightErrors && Boolean(flightErrors[fieldsNames.flightNumber])}
                                                    label={flightNumLabel}
                                                    {...params}
                                                    placeholder={flightNumLabel}
                                                />
                                            }
                                            disabled={isViewMode}
                                        />
                                    );
                                }}
                            />
                            <div className={classes.errorMsg}>
                                <InlineErrorText
                                    error={flightErrors && flightErrors[fieldsNames.flightNumber]}
                                />
                            </div>
                        </Grid>
                        {flight.flightNum && flight.flightNum == otherFlightNum &&
                            <Grid item md={3}>
                                <Controller
                                    control={control}
                                    name={`flights[${index}].${fieldsNames.otherFlightNum}`}
                                    defaultValue={flight.otherFlightNum || null}
                                    render={(props) => {
                                        return (
                                            <FlightNumberTextField
                                                {...props}
                                                value={props.value}
                                                onChange={(value) => {
                                                    props.onChange(value);

                                                }}
                                                placeholder={otherflightNumLabel}
                                                label={otherflightNumLabel}
                                                disabled={isViewMode}
                                                onBlur={() => { setValueInRedux(fieldsNames.otherFlightNum, getValues(`flights[${index}].${fieldsNames.otherFlightNum}`)) }}
                                            />
                                        );
                                    }}
                                />
                                <div className={classes.errorMsg}>
                                    <InlineErrorText
                                        error={flightErrors && flightErrors[fieldsNames.otherFlightNum]}
                                    />
                                </div>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>

    )


}
interface Props {
    isViewMode?: boolean;
    index: number;
    flight: Flight;
};

export default FlightForm;