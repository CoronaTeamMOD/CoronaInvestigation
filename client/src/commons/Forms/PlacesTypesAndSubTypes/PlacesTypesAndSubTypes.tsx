import React, {useState} from 'react';
import { Grid , FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
    
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const PlacesTypesAndSubTypes : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { placeSubType, placeType, onPlaceTypeChange, onPlaceSubTypeChange, required } = props;

    const formClasses = useFormStyles();
    const [placesSubTypesByTypes, setPlacesSubTypesByTypes] = useState<PlacesSubTypesByTypes>({});

    React.useEffect(()=> {
        if (Object.keys(placesSubTypesByTypes).length > 0 && placeType === '') {
            onPlaceTypeChange(Object.keys(placesSubTypesByTypes)[0]);
        }
    }, [placesSubTypesByTypes]);

    React.useEffect(() => {
        if (placesSubTypesByTypes[placeType]) {
            const defaultPlaceSubType = placesSubTypesByTypes[placeType][0];
            if (defaultPlaceSubType && !placesSubTypesByTypes[placeType].map(type => type.id).includes(placeSubType)) {
                onPlaceSubTypeChange(defaultPlaceSubType.id, defaultPlaceSubType.displayName);
            }
        }
    }, [placeType]);

    usePlacesTypesAndSubTypes({setPlacesSubTypesByTypes});

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={4}>
                <FormInput fieldName='סוג אתר'>
                    <FormControl 
                        disabled={Object.keys(placesSubTypesByTypes).length === 0}
                        required={required} 
                        fullWidth 
                    >
                        <InputLabel>סוג אתר</InputLabel>
                        <Select
                            label='סוג אתר'
                            value={placeType? placeType : ''}
                            onChange={(event) => onPlaceTypeChange(event.target.value as string)}
                        >
                            {
                                Object.keys(placesSubTypesByTypes).map((currentPlaceType) => (
                                    <MenuItem key={currentPlaceType} value={currentPlaceType}>{currentPlaceType}</MenuItem>
                                ))
                            }
                        </Select>
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
                            <Select
                                label='תת סוג'
                                value={placeSubType? placeSubType : ''}
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
                        </FormControl>
                    </FormInput>
                </Grid>
            }
        </Grid>
    );
};

export default PlacesTypesAndSubTypes;

interface Props {
    required?: boolean;
    placeType: string;
    placeSubType: number;
    onPlaceTypeChange: (newPlaceType: string) => void;
    onPlaceSubTypeChange: (newPlaceSubType: number, placeSubTypeDispalyName?: string) => void;
}