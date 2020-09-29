import React from 'react';
import { Controller } from 'react-hook-form'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

import useGoogleApiAutocomplete from './useGoogleApiAutocomplete';
import LocationOptionItem from './OptionItem/LocationOptionItem';
import useStyles from './LocationInputFieldStyles';
import useDBParser from 'Utils/vendor/useDBParsing';

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
const  LocationInput = (props: LocationInputProps) => {
    const { control, name, constOptions, selectedAddress,  setSelectedAddress, required} = props;
    const {autoCompletePlacesFromApi, parseAddress} = useGoogleApiAutocomplete();
    const {parseLocation} = useDBParser();

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

    const filterOptions = (x: any) => x;

    const staticOptionConfig = {
        autoComplete: true,
        filterSelectedOptions: true,
        includeInputInList: true,
        clearOnBlur: false,
        disableClearable: true,
        filterOptions
    };

    const config = (!constOptions) ? { ...staticOptionConfig } : {};
    
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

    const onChange = async (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        const geoCodedAddress = await parseLocation(newValue);
        _isMounted && setSelectedAddress(event,geoCodedAddress as GoogleApiPlace);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={(props) => (
                <Autocomplete
                    options={locationOptions} 
                    value={parsedSelected}
                    onInputChange={(event: React.ChangeEvent<{}>, newInputValue: string) => setInput(newInputValue as string)}
                    onChange={(event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null | GeocodeResponse) => props.onChange(newValue)}
                    noOptionsText={noOptionsMessage}
                    filterOptions={filterOptions}
                    getOptionLabel={(option: any) => typeof option === 'string' ? option : option.description}
                    renderInput={(params: AutocompleteRenderInputParams) =>
                        <TextField  
                            {...params} 
                            fullWidth 
                        />
                    }
                    className={classes.autcompleteField + classes.longAutoComplete}
                    {...config}
                    {...(renderOption) ? { renderOption: renderOption } : {}}
                />
            )}
        />
    );
};

interface LocationInputProps {
    name?: any;
    control?: any;
    required?: boolean;
    selectedAddress: GoogleApiPlace | null;
    setSelectedAddress?:(event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) =>void;
    constOptions?: boolean;
}

export default LocationInput;