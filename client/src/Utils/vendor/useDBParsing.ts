import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";
import {GeocodeResponse, GoogleApiPlace} from "commons/LocationInputField/LocationInput";

type parseAddressStringified = (address: (GoogleApiPlace|null), rawData: false | undefined) => Promise<string|null>;
type parseAddressRaw = (address: GoogleApiPlace, rawData: true) => Promise<GeocodeResponse>;
// type parseNullAddress = (address:null, rawData: boolean) => Promise<null>;
type ParseTypes = parseAddressStringified | parseAddressRaw;

const useDBParser = () => {
    const {parseAddress, requestDetailsFromPlaceId} = useGoogleApiAutocomplete();

    const parseLocation = async (address: GoogleApiPlace | null, rawData: boolean = false) => {
        if (address) {
            const parsedAddress = parseAddress(address);
            const details = await requestDetailsFromPlaceId(parsedAddress?.place_id);
            const description = parsedAddress?.description;
            const detailsDBPayload = Array.isArray(details) ? details[0] : details;

            return rawData ? ({...detailsDBPayload, description}) : JSON.stringify({...detailsDBPayload, description})
        }

        return address;
    };


    return {
        parseLocation,
    }
}

export default useDBParser;