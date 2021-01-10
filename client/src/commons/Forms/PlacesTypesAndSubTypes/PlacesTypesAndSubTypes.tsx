import { Autocomplete } from '@material-ui/lab';
import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, FormControl, TextField, Collapse } from '@material-ui/core';

import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import FormInput from 'commons/FormInput/FormInput';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const placeTypeDisplayName = 'סוג אתר';
const placeSubTypeDisplayName = 'תת סוג';

const defaultSubType = { displayName: '', id: -1 };

const PlacesTypesAndSubTypes: React.FC<PlacesTypesAndSubTypesProps> = (props: PlacesTypesAndSubTypesProps): JSX.Element => {

    const { placeTypeName, placeSubTypeName, onPlaceTypeChange, onPlaceSubTypeChange } = props;
    const { control, errors, watch } = useFormContext();

    const formClasses = useFormStyles();

    const placeType = watch(placeTypeName);
    const placeSubType = watch(placeSubTypeName);

    const [placeTypeInput, setPlaceTypeInput] = useState<string>('');
    const [placeSubTypeInput, setPlaceSubTypeInput] = useState<string>('');
    const {placesSubTypesByTypes, subtypesFetched} = usePlacesTypesAndSubTypes();

    const placeSubTypeById = (placeSubTypeId: number): PlaceSubType | undefined => {
        return placesSubTypesByTypes[placeType]?.find((placeSubType: PlaceSubType) => placeSubType.id === placeSubTypeId);
    };

    const placeSubTypeObj: PlaceSubType | null = useMemo(
        () => (
            placeSubType
                ? (placeSubTypeById(placeSubType.id || placeSubType) || null)
                : defaultSubType)
        , [placeSubType, placesSubTypesByTypes]
    );

    useEffect(() => {
        setPlaceTypeInput(placeType || '');
        if (subtypesFetched) {
            if (placesSubTypesByTypes[placeType]) {
                const defaultPlaceSubType = placesSubTypesByTypes[placeType][0];
                const wasTypeSelected = placesSubTypesByTypes[placeType].map(subtype => subtype.id).includes(placeSubType);

                if (defaultPlaceSubType && !wasTypeSelected) {
                    onPlaceSubTypeChange(defaultPlaceSubType);
                }
            } else {
                onPlaceSubTypeChange(null);
            }
        }
    }, [placeType, placesSubTypesByTypes]);

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

    const isTabForm = props.size === 'Tab';
    const InputWrapperComp = isTabForm ? FormRowWithInput : FormInput;

    return (
        <Grid className={isTabForm ? '' : formClasses.formRow} container justify='flex-start'>
            <Grid item xs={5}>
                <InputWrapperComp fieldName={placeTypeDisplayName}>
                    <Grid item xs={7}>
                        <FormControl
                            disabled={!subtypesFetched}
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
                                        value={props.value}
                                        onBlur={props.onBlur}
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
                    <Grid item xs={6}>
                <Collapse in={placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType].length > 1}>
                      <InputWrapperComp fieldName={placeSubTypeDisplayName} labelLength={2}>
                            <Grid item xs={8}>
                                <FormControl
                                    fullWidth
                                >
                                    <Controller
                                        name={placeSubTypeName}
                                        control={control}
                                        render={(props) => (
                                            placesSubTypesByTypes[placeType] ? <Autocomplete
                                                options={placesSubTypesByTypes[placeType]}
                                                getOptionLabel={(option) => option ? option.displayName : option}
                                                value={placeSubTypeObj}
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
                                            :
                                            <>
                                            </>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </InputWrapperComp>
                        </Collapse>
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
    onPlaceTypeChange: (newPlaceType: string) => void;
    onPlaceSubTypeChange: (placeSubType: PlaceSubType | null) => void;
    size: FormSize;
};
