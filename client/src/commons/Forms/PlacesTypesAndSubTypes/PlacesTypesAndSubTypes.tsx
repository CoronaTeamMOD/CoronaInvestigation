import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import InteractionEventDialogFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventDialogFields';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const placeTypeDisplayName = 'סוג אתר';

const PlacesTypesAndSubTypes: React.FC<Props> = (props: Props): JSX.Element => {

    const { control, placeTypeName, placeSubTypeName, placeType, placeSubType,
            onPlaceTypeChange, onPlaceSubTypeChange, required,
    } = props;

    const formClasses = useFormStyles();

    const [placesSubTypesByTypes, setPlacesSubTypesByTypes] = useState<PlacesSubTypesByTypes>({});
    const [selectedPlaceType, setSelectedPlaceType] = useState<string>('');

    React.useEffect(() => {
        if (Object.keys(placesSubTypesByTypes).length > 0 && placeType === '') {
            onPlaceTypeChange(Object.keys(placesSubTypesByTypes)[0]);
        }
    }, [placesSubTypesByTypes]);

    React.useEffect(() => {
        if (placesSubTypesByTypes[placeType]) {
            const defaultPlaceSubType = placesSubTypesByTypes[placeType][0];
            if (defaultPlaceSubType && !placesSubTypesByTypes[placeType].map(type => type.id).includes(placeSubType)) {
                onPlaceSubTypeChange(defaultPlaceSubType.id);
            }
        }
    }, [placeType]);

    usePlacesTypesAndSubTypes({ setPlacesSubTypesByTypes });

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={4}>
                <FormInput fieldName={placeTypeDisplayName}>
                    <FormControl className={formClasses.formTypesSelect}
                        disabled={Object.keys(placesSubTypesByTypes).length === 0}
                        required={required}
                        fullWidth
                    >
                        {control ?
                            <Controller
                                name={placeTypeName}
                                control={control}
                                render={(props) => (
                                    <Autocomplete
                                        options={Object.keys(placesSubTypesByTypes)}
                                        getOptionLabel={(option) => option}
                                        inputValue={selectedPlaceType}
                                        getOptionSelected={(option) => option === props.value}
                                        onChange={(event, chosenPlaceType) => {
                                            setSelectedPlaceType(chosenPlaceType ? chosenPlaceType : '')
                                            props.onChange(chosenPlaceType ? chosenPlaceType : '')
                                        }}
                                        onInputChange={(event, chosenPlaceType) => {
                                            setSelectedPlaceType(chosenPlaceType);
                                            if (chosenPlaceType === '') {
                                                props.onChange('');
                                            }
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id='placeType'
                                                value={props.value ? props.value : ''}
                                                label={placeTypeDisplayName}
                                                onBlur={props.onBlur}
                                                id={InteractionEventDialogFields.PLACE_TYPE}
                                                placeholder={placeTypeDisplayName}
                                            />
                                        }
                                    />
                                )}
                            />
                            :
                            <Autocomplete
                                options={Object.keys(placesSubTypesByTypes)}
                                value={placeType ? placeType : ''}
                                onChange={(event, chosenPlaceType) => onPlaceTypeChange(chosenPlaceType as string)}
                                renderInput={(params: AutocompleteRenderInputParams) =>
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label={placeTypeDisplayName}
                                    />
                                }
                            />
                        }
                    </FormControl>
                </FormInput>
            </Grid>
            {
                placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType].length > 1 &&
                <Grid item xs={6}>
                    <FormInput fieldName='תת סוג'>
                        <FormControl
                            required={required}
                            fullWidth
                        >
                            <InputLabel>תת סוג</InputLabel>
                            {control ?
                                <Controller
                                    name={placeSubTypeName}
                                    control={control}
                                    render={(props) => (
                                        <Select
                                            test-id='placeSubType'
                                            label='תת סוג'
                                            value={props.value ? props.value : ''}
                                            onChange={(event) => props.onChange(event.target.value as number)}
                                        >
                                            {
                                                placesSubTypesByTypes[placeType].map((currentPlaceSubType) => (
                                                    <MenuItem
                                                        key={currentPlaceSubType.id}
                                                        value={currentPlaceSubType.id}
                                                    >
                                                        {currentPlaceSubType.displayName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    )}
                                />
                                :
                                <Select
                                    test-id='placeSubType'
                                    label='תת סוג'
                                    value={placeSubType ? placeSubType : ''}
                                    onChange={(event) => onPlaceSubTypeChange(event.target.value as number)}
                                >
                                    {
                                        placesSubTypesByTypes[placeType].map((currentPlaceSubType) => (
                                            <MenuItem
                                                key={currentPlaceSubType.id}
                                                value={currentPlaceSubType.id}
                                            >
                                                {currentPlaceSubType.displayName}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            }
                        </FormControl>
                    </FormInput>
                </Grid>
            }
        </Grid>
    );
};

export default PlacesTypesAndSubTypes;

interface Props {
    placeTypeName: string;
    placeSubTypeName: string;
    required?: boolean;
    placeType: string;
    placeSubType: number;
    onPlaceTypeChange: (newPlaceType: string) => void;
    onPlaceSubTypeChange: (newPlaceSubType: number, placeSubTypeDispalyName?: string) => void;
    control?: Control;
};
