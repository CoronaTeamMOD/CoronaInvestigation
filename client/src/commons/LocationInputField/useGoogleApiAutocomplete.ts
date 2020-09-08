import React from "react";
import {GoogleApiPlace} from "./LocationInput";
import injectScript from "./useGoogleScriptInjector";
import {throttle} from "Utils/vendor/underscoreReplacement";

interface APIRequestParams {
    input: string;
    componentRestrictions?: { country: string | string[] };
}

const useGoogleApiAutocomplete = () => {
    const [autocompleteService, setAutoCompleteService] = React.useState();

    React.useEffect(() => {
        const init = async () => {
            try {
                if (!(window as any).google) {
                    if(process.env.REACT_APP_GOOGLE_API_KEY){
                        await injectScript(process.env.REACT_APP_GOOGLE_API_KEY);
                    } else {
                        throw Error('no google api key found')
                    }
                }
                setAutoCompleteService(new (window as any).google.maps.places.AutocompleteService());
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const callGoogleApi = (request: APIRequestParams, callback: (results?: GoogleApiPlace[]) => void) => {
        if(autocompleteService) {
            (autocompleteService as any).getPlacePredictions(request, callback);
        }
    };

    const fetch = React.useMemo(() => throttle(callGoogleApi , 200), [autocompleteService]);

    const autoCompletePlacesFromApi = (input:string, callback: (data?: GoogleApiPlace[]) => any) => {
        const componentRestrictions = {country: 'IL'};
        fetch({input, componentRestrictions}, callback);
    };

    return {
        autoCompletePlacesFromApi
    }
};

export default useGoogleApiAutocomplete;