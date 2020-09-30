import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";
import {GeocodeResponse, GoogleApiPlace} from "commons/LocationInputField/LocationInput";
import useGoogleGeocoder from "../../commons/LocationInputField/useGoogleGeocoder";

const useDBParser = () => {
    const {parseAddress} = useGoogleApiAutocomplete();
    const {requestDetailsFromPlaceId} = useGoogleGeocoder();

    const parseLocation = async (address: GoogleApiPlace | GeocodeResponse | null) => {
        if (address) {
            const getPlaceDetailsObject = async (placeId: string) => {
                const placeDetails = await requestDetailsFromPlaceId(placeId);
                const placeDetailsObject = Array.isArray(placeDetails) ? placeDetails[0] : placeDetails;
                return placeDetailsObject;
            }

            const parsedAddress = parseAddress(address);
            const isGeocodedLocation = !!((parsedAddress as GeocodeResponse).geometry);
            const placeData = (isGeocodedLocation || !(parsedAddress.place_id))
                ? (parsedAddress as GeocodeResponse)
                : await getPlaceDetailsObject(parsedAddress.place_id);
            const description = parsedAddress?.description;

            return {...placeData, description};
        }

        return address;
    };


    return {
        parseLocation,
    }
}

export default useDBParser;
