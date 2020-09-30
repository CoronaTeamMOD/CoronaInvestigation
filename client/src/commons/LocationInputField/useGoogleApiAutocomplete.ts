import React from "react";
import {GoogleApiPlace, GeocodeResponse} from "./LocationInput";
import injectScript from "./useGoogleScriptInjector";
import {throttle} from "Utils/vendor/underscoreReplacement";

interface APIRequestParams {
    input: string;
    componentRestrictions?: { country: string | string[] };
}

const useGoogleApiAutocomplete = () => {
    const [autoCompleteService, setAutoCompleteService] = React.useState<google.maps.places.AutocompleteService>();

    React.useEffect(() => {
        injectScript()
            .then(maps => setAutoCompleteService(new maps.places.AutocompleteService()))
            .catch(console.error);
    }, []);

    const callGoogleApi = (request: APIRequestParams, callback: (results?: GoogleApiPlace[]) => void) => {
        if (autoCompleteService) {
            (autoCompleteService as any).getPlacePredictions(request, callback);
        }
    };

    const autoCompleteFetch = React.useMemo(() => throttle(callGoogleApi, 200), [autoCompleteService]);

    const autoCompletePlacesFromApi = (input: string, callback: (data?: GoogleApiPlace[]) => any) => {
        const componentRestrictions = {country: 'IL'};
        autoCompleteFetch({input, componentRestrictions}, callback);
    };

    const parseAddress = (address: string | GeocodeResponse | GoogleApiPlace | null) => {
        const parseString = (location: string) => {
            let parsed = JSON.parse(location);
            while (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            return parsed;
        };

        const handleParseString = (location: string) => {
            try {
               const parsed = parseString(location);
                return parsed;
            } catch (error) {
                try {
                    const wrappedLocation = `"${location}"`;
                    const parsedWrappedLocation =  parseString(wrappedLocation);
                    return parsedWrappedLocation;
                } catch (secondError) {
                    console.error('error parsing location regularly:', error);
                    console.error('error parsing location wrapped with quote marks:', secondError);

                    const invalidLocation = {
                        description: 'מיקום לא תקין',
                        place_id: null,
                    };

                    return invalidLocation;
                }
            }
        };

        const parsedAddress = typeof address === 'string' ? handleParseString(address as string) : address;

        if (parsedAddress) {
            const {description, formatted_address} = parsedAddress;
            return {description: description || formatted_address, ...parsedAddress};
        } else {
            return null;
        }
    };

    return {
        autoCompletePlacesFromApi,
        parseAddress,
    }
};

export default useGoogleApiAutocomplete;
