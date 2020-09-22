import { Grid, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { Autocomplete } from '@material-ui/lab';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import {InteractionEventDialogContext} from '../../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import InteractionEventDialogFields from '../../../InteractionsEventDialogContext/InteractionEventDialogFields';

const TrainEventForm : React.FC = () : JSX.Element => {
    
    const formClasses = useFormStyles();
    
    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    
    const { setInteractionEventDialogData, interactionEventDialogData } = useContext(InteractionEventDialogContext);
    const { cityOrigin, boardingStation, cityDestination, endStation } = interactionEventDialogData;

    const onChange = (value: string, updatedField: InteractionEventDialogFields) =>
        setInteractionEventDialogData({...interactionEventDialogData as InteractionEventDialogData, [updatedField]: value});

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <Autocomplete
                            options={Array.from(cities, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value?.displayName || ''}
                            defaultValue={{ id: cityOrigin as string, value: cities.get(cityOrigin as string)}}
                            onChange={(event, selectedCity) => {
                                onChange(selectedCity?.id as string, InteractionEventDialogFields.CITY_ORIGIN)
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue === '') {
                                    onChange('', InteractionEventDialogFields.CITY_ORIGIN);
                                }
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
                            getOptionLabel={(option) => option.value?.displayName || ''}
                            defaultValue={{ id: cityDestination as string, value: cities.get(cityDestination as string)}}
                            onChange={(event, selectedCity) => {
                                onChange(selectedCity?.id as string, InteractionEventDialogFields.CITY_DESTINATION)
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue === '') {
                                    onChange('', InteractionEventDialogFields.CITY_DESTINATION);
                                }
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

export default TrainEventForm;