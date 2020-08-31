import React from 'react';
import {Autocomplete, AutocompleteRenderInputParams} from "@material-ui/lab";
import {TextField} from "@material-ui/core";
import useLocationAutoComplete from "./useLocationAutocomplete";
import useStyles from "./LocationInputStyles";
import LocationOptionItem from "./LocationOptionItem";

interface PlaceType {
    title: string;
    subTitle: { text: string }[];
}

export interface DisplayPlaceType {
    title: string;
    subTitle: string[];
}

const LocationInput = () => {
    const classes = useStyles();

    const inputLabel = 'כתובת';
    const noOptionsText = 'אין תוצאות המתאימות לחיפוש';

    const {autoCompletePlacesFromApi} = useLocationAutoComplete();
    const [locationOptions, setLocationOptions] = React.useState<DisplayPlaceType[]>([]);
    const [selectedAddress, setAddress] = React.useState<DisplayPlaceType | null>(null);
    const [input, setInput] = React.useState<string>('');

    const fitDataToFormat = (data: PlaceType[]): DisplayPlaceType[] => (
        data.map(place => ({
            title: place.title,
            subTitle: place.subTitle.map(subtitle => subtitle.text)
        }))
    );

    React.useEffect(() => {
        let active = true;

        if (input === '') {
            setLocationOptions(selectedAddress ? [selectedAddress] : []);
            return undefined;
        }

        autoCompletePlacesFromApi(input)
            .then((data: PlaceType[]) => {
                if (active) {
                    let newOptions = [] as DisplayPlaceType[];

                    if (selectedAddress) {
                        newOptions = [selectedAddress];
                    }

                    if (data && data.length && data.length > 0) {
                        newOptions = [...newOptions, ...fitDataToFormat(data)];
                    }

                    setLocationOptions(newOptions);
                }
            });

        return () => {
            active = false;
        };
    }, [selectedAddress,input, fetch]);

    const onLocationChange = (event: React.ChangeEvent<{}>, newValue: DisplayPlaceType | null) => {
        const options = newValue ? [newValue, ...locationOptions] : locationOptions;
        setLocationOptions(options);
        setAddress(newValue);
    };

    const onInputChange = (event: React.ChangeEvent<{}>,
                           newInputValue: string,) => {
        setInput(newInputValue);
    };

    const inputElement = (params: AutocompleteRenderInputParams) =>
        <TextField {...params} label={inputLabel} variant="outlined" fullWidth/>;

    return (
        <Autocomplete className={classes.textField}
                      autoComplete
                      filterSelectedOptions
                      includeInputInList
                      filterOptions={x => x}
                      clearOnBlur={false}
                      value={selectedAddress}
                      options={locationOptions}
                      noOptionsText={noOptionsText}
                      getOptionLabel={(option) => (option.title)}
                      onChange={onLocationChange}
                      onInputChange={onInputChange}
                      renderInput={inputElement}
                      renderOption={LocationOptionItem}
        />
    );
};

export default LocationInput;