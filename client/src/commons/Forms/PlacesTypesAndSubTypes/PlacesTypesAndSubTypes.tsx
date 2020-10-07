import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Grid, FormControl, TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import FormInput from 'commons/FormInput/FormInput';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import InteractionEventDialogFields from 'components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionsEventDialogContext/InteractionEventDialogFields';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const placeTypeDisplayName = 'סוג אתר';
const placeSubTypeDisplayName = 'תת סוג';

const PlacesTypesAndSubTypes: React.FC<Props> = (props: Props): JSX.Element => {

    const { control, placeTypeName, placeSubTypeName, placeType, placeSubType,
            onPlaceTypeChange, onPlaceSubTypeChange, required,
    } = props;

    const formClasses = useFormStyles();

    const [placesSubTypesByTypes, setPlacesSubTypesByTypes] = useState<PlacesSubTypesByTypes>({});
    const [selectedPlaceType, setSelectedPlaceType] = useState<string>('');
    const [selectedPlaceSubType, setSelectedPlaceSubType] = useState<PlaceSubType>();
    const [selectedPlaceSubTypeInput, setSelectedPlaceSubTypeInput] = useState<string>('');

    React.useEffect(() => {
        if (Object.keys(placesSubTypesByTypes).length > 0 && placeType === '') {
            onPlaceTypeChange(Object.keys(placesSubTypesByTypes)[0]);
        }
    }, [placesSubTypesByTypes]);

    React.useEffect(() => {
        placeType && setSelectedPlaceType(placeType);
        
        if (placesSubTypesByTypes[placeType]) {
            const defaultPlaceSubType = placesSubTypesByTypes[placeType][0];
            if (defaultPlaceSubType && !placesSubTypesByTypes[placeType].map(type => type.id).includes(placeSubType)) {
                onPlaceSubTypeChange(defaultPlaceSubType.id);
            }
        }
    }, [placeType]);

    React.useEffect(() => {
        if (typeof placeSubType === 'number') {
            setSelectedPlaceSubType(placeSubTypeById(placeSubType));
        } else {
            if (placeSubType) {
                setSelectedPlaceSubType(placeSubType);
            }
        }
    },[placesSubTypesByTypes]);

    React.useEffect(() => {
        setSelectedPlaceSubTypeInput(selectedPlaceSubType?.displayName as string);
    },[selectedPlaceSubType]);

    const placeSubTypeById = (placeSubTypeId: number): PlaceSubType => {
        return placesSubTypesByTypes[placeType]?.filter((placeSubType: PlaceSubType) => placeSubType.id === placeSubTypeId)[0];
    };

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
                                test-id='placeType'
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
                    <FormInput fieldName={placeSubTypeDisplayName}>
                        <FormControl
                            required={required}
                            fullWidth
                        >
                            {control ?
                                <Controller
                                    name={placeSubTypeName}
                                    control={control}
                                    render={(props) => (
                                        <Autocomplete
                                            options={placesSubTypesByTypes[placeType]}
                                            getOptionLabel={(option) => option ? option.displayName : option}
                                            inputValue={selectedPlaceSubTypeInput ? selectedPlaceSubTypeInput : ''}
                                            getOptionSelected={(option) => option.id === props.value}
                                            onChange={(event, chosenPlaceSubType) => {
                                                setSelectedPlaceSubType(chosenPlaceSubType ? chosenPlaceSubType : undefined)
                                                props.onChange(chosenPlaceSubType ? chosenPlaceSubType.id : '')
                                            }}
                                            onInputChange={(event, chosenPlaceSubType) => {
                                                setSelectedPlaceSubTypeInput(chosenPlaceSubType);
                                                if (chosenPlaceSubType === '') {
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
                                    test-id='placeSubType'
                                    options={placesSubTypesByTypes[placeType]}
                                    getOptionLabel={(option) => option ? option.displayName : option}
                                    value={placeSubTypeById(placeSubType) ? placeSubTypeById(placeSubType) : undefined}
                                    onChange={(event, chosenPlaceSubType) => onPlaceSubTypeChange(chosenPlaceSubType?.id as number)}
                                    renderInput={(params: AutocompleteRenderInputParams) =>
                                        <TextField
                                            {...params}
                                            fullWidth
                                            label={placeSubTypeDisplayName}
                                        />
                                    }
                                />
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
