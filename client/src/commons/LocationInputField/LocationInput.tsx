import React from 'react';
import { Controller, Control } from 'react-hook-form';

import useDBParser from 'Utils/vendor/useDBParsing';

import useStyles from './LocationInputFieldStyles';
import LocationOptionItem from './OptionItem/LocationOptionItem';
import useGoogleApiAutocomplete from './useGoogleApiAutocomplete';
import AutocompletedField from "../AutoCompletedField/AutocompletedField";

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

const renderOption = LocationOptionItem;
const noOptionsMessage = 'הקלידו מיקום תיקני לחיפוש...';


const LocationInput = (props: LocationInputProps) => {
    const { control, name, selectedAddress,  setSelectedAddress, required=false } = props;
    const {autoCompletePlacesFromApi, parseAddress} = useGoogleApiAutocomplete();
    const {parseLocation} = useDBParser();

    const [locationOptions, setLocationOptions] = React.useState<GoogleApiPlace[]>([]);
    const [input, setInput] = React.useState<string>('');
    const parsedSelected = React.useMemo(() => parseAddress(selectedAddress), [selectedAddress]);
    const _isMounted = React.useRef(true);
    const classes = useStyles({});

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
    }, [selectedAddress, input]);    

    const onChange = async (newValue: GoogleApiPlace | null) => {
        const geoCodedAddress = await parseLocation(newValue);
        _isMounted && setSelectedAddress(geoCodedAddress as GoogleApiPlace);
    };

    const AutocompleteComponent =
        <AutocompletedField
            value={parsedSelected}
            options={locationOptions}
            onChange={(event: React.ChangeEvent<{}>, newValue) => onChange(newValue as GoogleApiPlace | null)}
            onInputChange={(event: React.ChangeEvent<{}>, newInputValue: string) => setInput(newInputValue as string)}
            getOptionLabel={(option: any) => typeof option === 'string' ? option : option.description}
            renderOption={LocationOptionItem}
            className={classes.longAutoComplete}
            noOptionsMessage={noOptionsMessage}
        />;

    return (
        control ? 
            <Controller name={name}
                control={control}
                render={(props) => AutocompleteComponent}
            />
        :
            AutocompleteComponent
    );
};

interface LocationInputProps {
    name: string;
    selectedAddress: GoogleApiPlace | null;
    setSelectedAddress: (newValue: GoogleApiPlace | null ) => void;
    control?: Control<Record<string, any>>;
};

export default LocationInput;
