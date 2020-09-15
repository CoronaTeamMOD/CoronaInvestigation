import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";
import {GoogleApiPlace} from "commons/LocationInputField/LocationInput";

const useDBParser = () => {
    const {parseAddress, requestDetailsFromPlaceId} = useGoogleApiAutocomplete();

    const parseLocation = async (address: GoogleApiPlace | null) => {
        if (address) {
            const parsedAddress = parseAddress(address);
            const details = await requestDetailsFromPlaceId(parsedAddress?.place_id);
            const description = parsedAddress?.description;
            const detailsDBPayload = Array.isArray(details) ? details[0] : details;

            return JSON.stringify({...detailsDBPayload, description})
        }

        return address;
    };


    return {
        parseLocation,
    }
}

export default useDBParser;