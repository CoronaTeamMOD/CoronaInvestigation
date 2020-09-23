import React from "react";
import {GoogleApiPlace, GeocodeResponse} from "./LocationInput";
import injectScript from "./useGoogleScriptInjector";
import {throttle} from "Utils/vendor/underscoreReplacement";

interface APIRequestParams {
    input: string;
    componentRestrictions?: { country: string | string[] };
}

const useGoogleApiAutocomplete = () => {
    const [autocompleteService, setAutoCompleteService] = React.useState();
    const [geocoder, setGeocoder] = React.useState();

    React.useEffect(() => {
        const init = async () => {
            try {
                await injectScript();
                setAutoCompleteService(new (window as any).google.maps.places.AutocompleteService());
                setGeocoder(new (window as any).google.maps.Geocoder());
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const callGoogleApi = (request: APIRequestParams, callback: (results?: GoogleApiPlace[]) => void) => {
        if (autocompleteService) {
            (autocompleteService as any).getPlacePredictions(request, callback);
        }
    };

    const autoCompleteFetch = React.useMemo(() => throttle(callGoogleApi, 200), [autocompleteService]);

    const autoCompletePlacesFromApi = (input: string, callback: (data?: GoogleApiPlace[]) => any) => {
        const componentRestrictions = {country: 'IL'};
        autoCompleteFetch({input, componentRestrictions}, callback);
    };

    const getDetailsFromPlaceId = (placeId: string): Promise<GeocodeResponse[] | GeocodeResponse> =>
        new Promise((resolve, reject) => {
            if (geocoder) {
                (geocoder as any).geocode({placeId, language: 'iw',},
                    (data: GeocodeResponse, status: string) => {
                        if (status === 'OK') {
                            resolve(data)
                        } else {
                            reject({error: {status}})
                        }
                    }
                );
            } else {
                reject({error: 'geocoder undefined'})
            }
        });

    const geocodeUseCallback = React.useCallback(getDetailsFromPlaceId, [geocoder]);
    const requestDetailsFromPlaceId = (placeId: string) => geocodeUseCallback(placeId);

    const parseAddress = (address: string | GeocodeResponse | GoogleApiPlace | null) => {
        const parseString = (location: string) => {
            try {
                const parsed = JSON.parse(location);
                return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
            } catch (error) {
                try {
                    const wrappedLocation = `"${location}"`;
                    const wrappedParsedLocation = JSON.parse(wrappedLocation);
                    return typeof wrappedParsedLocation === 'string' ? JSON.parse(wrappedParsedLocation) : wrappedParsedLocation;
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

        const parsedAddress = typeof address === 'string' ? parseString(address as string) : address;

        if (parsedAddress) {
            const {description, formatted_address, place_id} = parsedAddress;
            return {description: description || formatted_address, place_id};
        } else {
            return null;
        }
    };

    return {
        autoCompletePlacesFromApi,
        requestDetailsFromPlaceId,
        parseAddress
    }
};

export default useGoogleApiAutocomplete;