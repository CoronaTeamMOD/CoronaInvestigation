import React, {useState} from 'react';
import { Grid } from '@material-ui/core';
    
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

import usePlacesTypesAndSubTypes from './usePlacesTypesAndSubTypes';

const PlacesTypesAndSubTypes : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { placeSubType, placeType, onPlaceTypeChange, onPlaceSubTypeChange } = props;

    const formClasses = useFormStyles();
    const [placesSubTypesByTypes, setPlacesSubTypesByTypes] = useState<PlacesSubTypesByTypes>({});

    React.useEffect(()=> {
        if (Object.keys(placesSubTypesByTypes).length > 0 && placeType === '') {
            onPlaceTypeChange(Object.keys(placesSubTypesByTypes)[0]);
        }
    }, [placesSubTypesByTypes]);

    React.useEffect(()=> {
        const defaultPlaceType = (placesSubTypesByTypes[placeType] && placesSubTypesByTypes[placeType][0]) ? placesSubTypesByTypes[placeType][0].id : placeSubType;
        onPlaceSubTypeChange(defaultPlaceType);
    }, [placeType]);

    usePlacesTypesAndSubTypes({setPlacesSubTypesByTypes});

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={6}>
                <FormInput fieldName='סוג אתר'>
                    <CircleSelect
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
    placeType: string;
    placeSubType: number;
    onPlaceTypeChange: (newPlaceType: string) => void;
    onPlaceSubTypeChange: (newPlaceSubType: number) => void;
}