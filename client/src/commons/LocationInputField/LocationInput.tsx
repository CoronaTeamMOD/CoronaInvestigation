import React from 'react';

import useGoogleApiAutocomplete from './useGoogleApiAutocomplete';
import LocationOptionItem from './OptionItem/LocationOptionItem';
import AutocompletedField from '../AutoCompletedField/AutocompletedField';
import useStyles from './LocationInputFieldStyles';

export interface GoogleApiPlace {
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
        main_text_matched_substrings: [
            {
                offset: number;
                length: number;
            },
        ];
    };
}

const  LocationInput = ({selectedAddress,  setSelectedAddress}: LocationInputProps) => {
    const classes = useStyles({});

    const {autoCompletePlacesFromApi} = useGoogleApiAutocomplete();
    const [locationOptions, setLocationOptions] = React.useState<GoogleApiPlace[]>([]);
    const [input, setInput] = React.useState<string>('');

    React.useEffect(() => {
        let active = true;

        if (input === '') {
            setLocationOptions(selectedAddress ? [selectedAddress] : []);
            return undefined;
        }

        autoCompletePlacesFromApi( input , (data?: GoogleApiPlace[]) => {
            if (active) {
                let newOptions = [] as GoogleApiPlace[];

                if (selectedAddress) {
                    newOptions = [selectedAddress];
                }

                if (data) {
                    newOptions = [...newOptions, ...data];
                }

                setLocationOptions(newOptions);
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
            value={selectedAddress}
            options={locationOptions}
            onChange={setSelectedAddress}
            onInputChange={onInputChange}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            renderOption={LocationOptionItem}
            className={classes.width300}
        />
    );
};

interface LocationInputProps {
    selectedAddress: GoogleApiPlace | null;
    setSelectedAddress:(event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) =>void;
}

export default LocationInput;