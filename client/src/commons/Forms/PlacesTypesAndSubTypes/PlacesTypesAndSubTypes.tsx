import { Autocomplete } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {Grid, FormControl, TextField} from '@material-ui/core';

import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import FormInput from 'commons/FormInput/FormInput';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const placeTypeDisplayName = 'סוג אתר';
const placeSubTypeDisplayName = 'תת סוג';

const defaultSubType = { displayName: '', id: -1 };

const PlacesTypesAndSubTypes: React.FC<PlacesTypesAndSubTypesProps> = (props: PlacesTypesAndSubTypesProps): JSX.Element => {

    const { placeTypeName, placeSubTypeName, placeType, placeSubType, onPlaceTypeChange, onPlaceSubTypeChange } = props;
    const { control, errors } = useFormContext();

    const formClasses = useFormStyles();

    const [placesSubTypesByTypes, setPlacesSubTypesByTypes] = useState<PlacesSubTypesByTypes>({});
    const [placeTypeInput, setPlaceTypeInput] = useState<string>('');
    const [placeSubTypeInput, setPlaceSubTypeInput] = useState<string>('');

    const placeSubTypeById = (placeSubTypeId: number): PlaceSubType => {
        return placesSubTypesByTypes[placeType]?.filter((placeSubType: PlaceSubType) => placeSubType.id === placeSubTypeId)[0];
    };

    const placeSubTypeObj: PlaceSubType = placeSubTypeById(placeSubType);

    useEffect(() => {
        if (placesSubTypesByTypes[placeType]) {
            const defaultPlaceSubType = placesSubTypesByTypes[placeType][0];
            if (defaultPlaceSubType && !placesSubTypesByTypes[placeType].map(type => type.id).includes(placeSubType)) {
                onPlaceSubTypeChange(defaultPlaceSubType);
            }
        }
    }, [placeType]);

    useEffect(() => {
        if (placeSubType !== null && placeSubTypeObj) {
                setPlaceSubTypeInput(placeSubTypeObj.displayName);
        }
    }, [placeSubType]);

    const handleSubTypeInputChange = (subTypeInput: string) => {
        setPlaceSubTypeInput(subTypeInput);
        if (subTypeInput === '') {
            onPlaceSubTypeChange(null);
        }
    };

    const handlePlaceTypeInputChange = (placeTypeInput: string) => {
        setPlaceTypeInput(placeTypeInput);
        if (placeTypeInput === '') {
            onPlaceTypeChange('');
        }
    };

    usePlacesTypesAndSubTypes({ setPlacesSubTypesByTypes });

    const isTabForm = props.size === 'Tab';
    const InputWrapperComp = isTabForm ? FormRowWithInput : FormInput;

    return (
        <Grid className={isTabForm ? '' : formClasses.formRow} container justify='flex-start'>
            <Grid item xs={5}>
                <InputWrapperComp fieldName={placeTypeDisplayName}>
                    <Grid item xs={7}>
                        <FormControl
                                     disabled={Object.keys(placesSubTypesByTypes).length === 0}
                                     fullWidth
                        >
                            <Controller
                                name={placeTypeName}
                                control={control}
                                render={(props) => (
                                    <Autocomplete
                                        options={Object.keys(placesSubTypesByTypes)}
                                        getOptionLabel={(option) => option}
                                        inputValue={placeTypeInput}
                                        value={placeType}
                                        onBlur={props.onBlur}
                                        getOptionSelected={(option) => option === placeType}
                                        onChange={(event, chosenPlaceType) => {
                                            onPlaceTypeChange(chosenPlaceType as string)
                                        }}
                                        onInputChange={(event, chosenPlaceType: string) => {
                                            if (event?.type !== 'blur') {
                                                handlePlaceTypeInputChange(chosenPlaceType);
                                            }
                                        }}
                                        placeholder={placeTypeDisplayName}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                error={errors && errors[placeTypeName]}
                                                label={(errors && errors[placeTypeName]?.message) || placeTypeDisplayName}
                                                test-id='placeType'
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>
                </InputWrapperComp>
            </Grid>
            {
                placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType].length > 1 &&
                <Grid item xs={6}>
                    <InputWrapperComp fieldName={placeSubTypeDisplayName} labelLength={2}>
                        <Grid item xs={8}>
                            <FormControl
                                fullWidth
                            >
                                <Controller
                                    name={placeSubTypeName}
                                    control={control}
                                    render={(props) => (
                                        <Autocomplete
                                            options={placesSubTypesByTypes[placeType]}
                                            getOptionLabel={(option) => option ? option.displayName : option}
                                            value={placeSubType === null ? defaultSubType : placeSubTypeObj}
                                            inputValue={placeSubTypeInput}
                                            getOptionSelected={(option) => option.id === placeSubType}
                                            onChange={(event, chosenPlaceSubType) =>
                                                onPlaceSubTypeChange(chosenPlaceSubType ? chosenPlaceSubType : null)
                                            }
                                            onInputChange={(event, placeSubTypeInput) => {
                                                if (event?.type !== 'blur') {
                                                    handleSubTypeInputChange(placeSubTypeInput);
                                                }
                                            }}
                                            onBlur={props.onBlur}
                                            placeholder={placeSubTypeDisplayName}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    error={errors && errors[placeSubTypeName]}
                                                    label={(errors && errors[placeSubTypeName]?.message) || placeSubTypeDisplayName}
                                                    test-id='placeSubType'
                                                />
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </InputWrapperComp>
                </Grid>
            }
        </Grid>
    );
};

export default PlacesTypesAndSubTypes;

type FormSize = 'Dialog' | 'Tab';

export interface PlacesTypesAndSubTypesProps {
    placeTypeName: string;
    placeSubTypeName: string;
    placeType: string;
    placeSubType: number;
    onPlaceTypeChange: (newPlaceType: string) => void;
    onPlaceSubTypeChange: (placeSubType: PlaceSubType | null) => void;
    size:FormSize;
};
