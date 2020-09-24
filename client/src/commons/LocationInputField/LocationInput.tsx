import React from 'react';

import useGoogleApiAutocomplete from './useGoogleApiAutocomplete';
import LocationOptionItem from './OptionItem/LocationOptionItem';
import AutocompletedField from '../AutoCompletedField/AutocompletedField';
import useStyles from './LocationInputFieldStyles';

export interface GoogleApiPlace {
    description: string;
    structured_formatting?: {
        main_text: string;
        secondary_text: string;
        main_text_matched_substrings: [
            {
                offset: number;
                length: number;
            },
        ];
    };
    place_id: string;
};

interface GeocodeAddressComponent {
    types: string[];
    long_name: string;
}

interface LocationObject {
lng: () => number | number;
lat: () => number | number;
}

export interface GeocodeResponse extends google.maps.GeocoderResult {
    description?: string;
}

const  LocationInput = ({selectedAddress,  setSelectedAddress}: LocationInputProps) => {
    const classes = useStyles({});
    const {autoCompletePlacesFromApi, parseAddress} = useGoogleApiAutocomplete();
    const [locationOptions, setLocationOptions] = React.useState<GoogleApiPlace[]>([]);
    const [input, setInput] = React.useState<string>('');

    const parsedSelected = React.useMemo(() => parseAddress(selectedAddress), [selectedAddress]);

    React.useEffect(() => {
        let active = true;

        if (input === '') {
            setLocationOptions(selectedAddress ? [selectedAddress] : []);
            return undefined;
        }

        autoCompletePlacesFromApi( input , (data?: GoogleApiPlace[]) => {
            if (active) {
                setLocationOptions(data || []);
            }
        });


        return () => {
            active = false;
        };
    }, [selectedAddress,input]);

    const onInputChange = (event: React.ChangeEvent<{}>,
                           newInputValue: string,) => {
        setInput(newInputValue);
    };

    return (
        <AutocompletedField
            value={parsedSelected}
            options={locationOptions}
            onChange={setSelectedAddress}
            onInputChange={onInputChange}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            renderOption={LocationOptionItem}
            className={classes.longAutoComplete}
        />
    );
};

interface LocationInputProps {
    selectedAddress: GoogleApiPlace | null;
    setSelectedAddress:(event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) =>void;
}

export default LocationInput;