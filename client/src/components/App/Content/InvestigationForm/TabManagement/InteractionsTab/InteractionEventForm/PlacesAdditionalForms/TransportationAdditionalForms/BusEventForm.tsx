import {Grid, TextField} from '@material-ui/core';
import React, {useContext} from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import StoreStateType from 'redux/storeStateType';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';
import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext';

const BusEventForm : React.FC = () : JSX.Element => {
    
    const formClasses = useFormStyles();

    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { busLine, busCompany, cityOrigin, boardingStation, cityDestination, endStation } = interactionEventDialogData;

    const onChange = (value: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='קו'>
                        <TextField
                            value={busLine}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.BUS_LINE)}/>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='חברה'>
                        <TextField
                            value={busCompany}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.BUS_COMPANY)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <Autocomplete
                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={cities.get(cityOrigin as string)?.displayName}
                            onChange={(event, selectedCity) => {
                                onChange(selectedCity?.id as string, InteractionEventDialogFields.CITY_ORIGIN)
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    className={formClasses.autocomplete}
                                />
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת עליה'>
                        <TextField
                            value={boardingStation}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.BOARDING_STATION)}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <Autocomplete
                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={cities.get(cityDestination as string)?.displayName}
                            onChange={(event, selectedCity) => {
                                onChange(selectedCity?.id as string, InteractionEventDialogFields.CITY_DESTINATION)
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    className={formClasses.autocomplete}
                                />
                            }
                        />
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת ירידה'>
                        <TextField
                            value={endStation}
                            onChange={event => onChange(event.target.value as string, InteractionEventDialogFields.END_STATION)}/>
                    </FormInput>
                </Grid>
            </div>
        </>
    );
};

export default BusEventForm;