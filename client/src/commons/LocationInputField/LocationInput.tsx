import React from 'react';

import useGoogleApiAutocomplete from './useGoogleApiAutocomplete';
import LocationOptionItem from './OptionItem/LocationOptionItem';
import AutocompletedField from '../AutoCompletedField/AutocompletedField';
import useStyles from './LocationInputFieldStyles';
import useGoogleGeocoder from "./useGoogleGeocoder";

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

export interface GeocodeResponse extends google.maps.GeocoderResult {
    description?: string;
}

const  LocationInput = (props: LocationInputProps) => {
    const { selectedAddress,  setSelectedAddress, required} = props;
    const {autoCompletePlacesFromApi, parseAddress} = useGoogleApiAutocomplete();
    const {requestDetailsFromPlaceId} = useGoogleGeocoder();

    const [locationOptions, setLocationOptions] = React.useState<GoogleApiPlace[]>([]);
    const [input, setInput] = React.useState<string>('');
    const parsedSelected = React.useMemo(() => parseAddress(selectedAddress), [selectedAddress]);
    const _isMounted = React.useRef(true);

    const classes = useStyles({});

    // cleanup
    React.useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

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

    const onInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        if (newInputValue === '') {
            setSelectedAddress(event, null);
        }
        setInput(newInputValue);
    };

    const onChange = async (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        const detailsResult = newValue ? await requestDetailsFromPlaceId(newValue.place_id) : null;
        const description = newValue?.description;
        const detailsObject = Array.isArray(detailsResult) ? detailsResult[0] : detailsResult;

        const geoCodedAddress =  detailsObject ? ({...detailsObject, description}) : null;
        _isMounted && setSelectedAddress(event,geoCodedAddress as GoogleApiPlace);
    };

    return (
        <AutocompletedField
            required={required}
            value={parsedSelected}
            options={locationOptions}
            onChange={onChange}
            onInputChange={onInputChange}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            renderOption={LocationOptionItem}
            className={classes.longAutoComplete}
        />
    );
};

interface LocationInputProps {
    required?: boolean;
    selectedAddress: GoogleApiPlace | null;
    setSelectedAddress:(event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) =>void;
}

export default LocationInput;