import React, {useState} from 'react';
import { Grid } from '@material-ui/core';
    
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import LocationsSubTypesByTypes from 'models/LocationsSubTypesByTypes';

import useInteractionEventForm from './useLocationsTypesAndSubTypes';

const LocationsTypesAndSubTypes : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { locationSubType, locationType, onLocationTypeChange, onLocationSubTypeChange } = props;

    const formClasses = useFormStyles();
    const [locationsSubTypesByTypes, setLocationsSubTypesByTypes] = useState<LocationsSubTypesByTypes>({});

    React.useEffect(()=> {
        if (locationsSubTypesByTypes !== {} && locationType === '') {
            const defaultLocationType : string = Object.keys(locationsSubTypesByTypes)[0];
            onLocationTypeChange(defaultLocationType);
        }
    }, [locationsSubTypesByTypes]);

    React.useEffect(()=> {
        const defaultLocationType = locationsSubTypesByTypes[locationType] ? locationsSubTypesByTypes[locationType][0] : locationSubType;
        onLocationSubTypeChange(defaultLocationType);
    }, [locationType]);

    useInteractionEventForm({setLocationsSubTypesByTypes});

    return (
        <Grid className={formClasses.formRow} container justify='flex-start'>
            <Grid item xs={6}>
                <FormInput fieldName='סוג אתר'>
                    <CircleSelect
                        value={locationType}
                        onChange={(event) => onLocationTypeChange(event.target.value as string)}
                        className={formClasses.formSelect}
                        options={Object.keys(locationsSubTypesByTypes) || []}
                    />
                </FormInput>
            </Grid>
            {
                locationsSubTypesByTypes[locationType] && locationsSubTypesByTypes[locationType] .length > 0 
                && 
                <Grid item xs={6}>
                    <FormInput fieldName='תת סוג'>
                        <CircleSelect
                            value={locationSubType}
                            onChange={(event) => onLocationSubTypeChange(event.target.value as string)}
                            className={formClasses.formSelect}
                            options={locationsSubTypesByTypes[locationType] || []}
                        />
                    </FormInput>
                </Grid>
            }
        </Grid>
    );
};

export default LocationsTypesAndSubTypes;

interface Props {
    locationType: string;
    locationSubType: string;
    onLocationTypeChange: (newLocationType: string) => void;
    onLocationSubTypeChange: (newLocationSubType: string) => void;
}