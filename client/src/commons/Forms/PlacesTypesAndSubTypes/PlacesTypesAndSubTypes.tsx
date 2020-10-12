import React, { useState, useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Grid, FormControl, TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import FormInput from 'commons/FormInput/FormInput';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const placeTypeDisplayName = 'סוג אתר';
const placeSubTypeDisplayName = 'תת סוג';

const PlacesTypesAndSubTypes: React.FC<Props> = (props: Props): JSX.Element => {

    const { control, setValue, placeTypeName, placeSubTypeName, placeType, placeSubType,
            onPlaceTypeChange, onPlaceSubTypeChange,
    } = props;

    const formClasses = useFormStyles();

    const [placesSubTypesByTypes, setPlacesSubTypesByTypes] = useState<PlacesSubTypesByTypes>({});
    const [placeTypeInput, setPlaceTypeInput] = useState<string>('');
    const [placeSubTypeInput, setPlaceSubTypeInput] = useState<string>('');

    const placeSubTypeById = (placeSubTypeId: number): PlaceSubType => {
        return placesSubTypesByTypes[placeType]?.filter((placeSubType: PlaceSubType) => placeSubType.id === placeSubTypeId)[0];
    };

    const placeSubTypeObj: PlaceSubType = placeSubTypeById(placeSubType);

    useEffect(() => {
        if (Object.keys(placesSubTypesByTypes).length > 0 && placeType === '') {
            onPlaceTypeChange(Object.keys(placesSubTypesByTypes)[0]);
        }
    }, [placesSubTypesByTypes]);

    useEffect(() => {
        if (placesSubTypesByTypes[placeType]) {
            const defaultPlaceSubType = placesSubTypesByTypes[placeType][0];
            if (defaultPlaceSubType && !placesSubTypesByTypes[placeType].map(type => type.id).includes(placeSubType)) {
                onPlaceSubTypeChange(defaultPlaceSubType);
            }
        }
    }, [placeType]);

    useEffect(() => {
        if (placeSubTypeObj) {
            setPlaceSubTypeInput(placeSubTypeObj.displayName);
            setValue(InteractionEventDialogFields.PLACE_NAME, `${placeType} ${placeSubTypeObj?.displayName}`);
        } else {
            setValue(InteractionEventDialogFields.PLACE_NAME, `${placeType}`);
        }
    }, [placeSubType]);
    
    const handleSubTypeInputChange = (subTypeInput: string) => {
        setPlaceSubTypeInput(subTypeInput);
        if (subTypeInput === '') {
            onPlaceSubTypeChange(placesSubTypesByTypes[placeType][0] as PlaceSubType);
        }
    };

    const handlePlaceTypeInputChange = (placeTypeInput: string) => {
        setPlaceTypeInput(placeTypeInput);
        if (placeTypeInput === '') {
            onPlaceTypeChange('');
        }
    };

    usePlacesTypesAndSubTypes({ setPlacesSubTypesByTypes });

    const PlaceTypeAutocompleteComponent =
        <Autocomplete
            options={Object.keys(placesSubTypesByTypes)}
            getOptionLabel={(option) => option}
            inputValue={placeTypeInput}
            value={placeType}
            getOptionSelected={(option) => option === placeType}
            onChange={(event, chosenPlaceType) => {
                onPlaceTypeChange(chosenPlaceType as string)
            }}
            onInputChange={(event, chosenPlaceType: string) => {
                handlePlaceTypeInputChange(chosenPlaceType);
            }}
            placeholder={placeTypeDisplayName}
            renderInput={(params) =>
                <TextField
                    {...params}
                    test-id='placeType'
                    label={placeTypeDisplayName}
                />
            }
        />;

    const PlaceSubTypeAutocompleteComponent =
        <Autocomplete
            options={placesSubTypesByTypes[placeType]}
            getOptionLabel={(option) => option ? option.displayName : option}
            value={placeSubTypeObj}
            inputValue={placeSubTypeInput}
            getOptionSelected={(option) => option.id === placeSubType}
            onChange={(event, chosenPlaceSubType) =>
                chosenPlaceSubType && onPlaceSubTypeChange(chosenPlaceSubType as PlaceSubType)
            }
            onInputChange={(event, placeSubTypeInput) => {
                handleSubTypeInputChange(placeSubTypeInput);
            }}
            placeholder={placeSubTypeDisplayName}
            renderInput={(params) =>
                <TextField
                    {...params}
                    test-id='placeSubType'
                    label={placeSubTypeDisplayName}

                />
            }
        />;

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={4}>
                <FormInput fieldName={placeTypeDisplayName}>
                    <FormControl className={formClasses.formTypesSelect}
                        disabled={Object.keys(placesSubTypesByTypes).length === 0}
                        fullWidth
                    >
                        {control ?
                            <Controller
                                name={placeTypeName}
                                control={control}
                                render={(props) => (
                                    PlaceTypeAutocompleteComponent
                                )}
                            />
                            :
                            PlaceTypeAutocompleteComponent
                        }
                    </FormControl>
                </FormInput>
            </Grid>
            {
                placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType].length > 1 &&
                <Grid item xs={6}>
                    <FormInput fieldName={placeSubTypeDisplayName}>
                        <FormControl
                            fullWidth
                        >
                            {control ?
                                <Controller
                                    name={placeSubTypeName}
                                    control={control}
                                    render={(props) => (
                                        PlaceSubTypeAutocompleteComponent
                                    )}
                                />
                                :
                                PlaceSubTypeAutocompleteComponent
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
    placeType: string;
    placeSubType: number;
    onPlaceTypeChange: (newPlaceType: string) => void;
    onPlaceSubTypeChange: (placeSubType: PlaceSubType) => void;
    control?: Control;
    setValue: (name: string, value: any) => void;
};
