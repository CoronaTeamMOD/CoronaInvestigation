
import { Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';

import Country from 'models/Country';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const FlightEventForm : React.FC = () : JSX.Element => {

    const formClasses = useFormStyles();

    const countries : Map<string, Country> = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);

    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { airline, 
        flightDestinationAirport,
        flightDestinationCity,
        flightDestinationCountry,
        flightNum,
        flightOriginAirport,
        flightOriginCity,
        flightOriginCountry
    } = interactionEventDialogData;

    const onChange = (value: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר טיסה'>
                        <CircleTextField
                            value={flightNum}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.FLIGHT_NUM)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='חברת תעופה'>
                        <CircleTextField
                            value={airline}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.AIR_LINE)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ מוצא'>
                        <Autocomplete
                            options={Array.from(countries, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={countries.get(flightOriginCountry as string)?.displayName}
                            onChange={(event, selectedCountry) => {
                                onChange(selectedCountry?.id as string, InteractionEventDialogFields.FLIGHT_ORIGIN_COUNTRY)
                            }}
                            renderInput={(params) =>
                                <CircleTextField
                                    {...params}
                                    className={formClasses.autocomplete}
                                />
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <CircleTextField
                            value={flightOriginCity}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.FLIGHT_ORIGIN_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='ארץ יעד'>
                    <Autocomplete
                        options={Array.from(countries, ([id, value]) => ({ id, value }))}
                        getOptionLabel={(option) => option.value.displayName}
                        inputValue={countries.get(flightDestinationCountry as string)?.displayName}
                        onChange={(event, selectedCountry) => {
                            onChange(selectedCountry?.id as string, InteractionEventDialogFields.FLIGHT_DESTINATION_COUNTRY)
                        }}
                        renderInput={(params) =>
                            <CircleTextField
                                {...params}
                                className={formClasses.autocomplete}
                            />
                        }
                    />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <CircleTextField
                            value={flightDestinationCity}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.FLIGHT_DESTINATION_CITY)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default FlightEventForm;