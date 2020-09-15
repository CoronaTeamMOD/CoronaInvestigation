import React, {useState} from 'react';
import { Grid , FormControl, FormHelperText, InputLabel} from '@material-ui/core';
    
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
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
        if (placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType][0] && !placesSubTypesByTypes[placeType].map(type => type.id).includes(placeSubType)) {
            onPlaceSubTypeChange(placesSubTypesByTypes[placeType][0].id);
        }
    }, [placeType]);

    usePlacesTypesAndSubTypes({setPlacesSubTypesByTypes});

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={6}>
                <FormInput fieldName='סוג אתר'>
                        <CircleSelect
                            required={required}
                            disabled={Object.keys(placesSubTypesByTypes).length === 0}
                            value={placeType}
                            onChange={(event) => onPlaceTypeChange(event.target.value as string)}
                            className={formClasses.formSelect}
                            options={Object.keys(placesSubTypesByTypes)}
                        />
                </FormInput>
            </Grid>
            {
                placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType].length > 1 && 
                <Grid item xs={6}>
                    <FormInput fieldName='תת סוג'>
                            <CircleSelect
                                required={required}
                                value={placeSubType}
                                onChange={(event) => onPlaceSubTypeChange(event.target.value as number)}
                                className={formClasses.formSelect}
                                isNameUnique={false}
                                idKey='id'
                                nameKey='displayName'
                                options={placesSubTypesByTypes[placeType] || []}
                            />
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
    onPlaceSubTypeChange: (newPlaceSubType: number) => void;
}