import React from 'react';
// @ts-ignore
import GoogleMap from "google-map-react";
import LocationInput, {
    GeocodeResponse,
    GoogleApiPlace
} from "../commons/LocationInputField/LocationInput";

import useGoogleApiAutocomplete from "../commons/LocationInputField/useGoogleApiAutocomplete";

interface MapProps {
    height?: number | string;
    width?: number | string;

}

const Map = (props: MapProps) => {
    const {requestDetailsFromLocation, requestDetailsFromPlaceId} = useGoogleApiAutocomplete();
    const defaultMapPosition = {lng: 35.217018, lat: 31.771959};
    const [mapPosition, setMapPosition] = React.useState(defaultMapPosition);
    const [markerPosition, setMarkerPosition] = React.useState<google.maps.LatLngLiteral | null>(null);
    const [marker, setMarker] = React.useState<google.maps.Marker | null>(null);
    const [selectedAddress, setSelectedAddress] = React.useState<GeocodeResponse | null>(null);
    const [map, setMap] = React.useState();

    React.useEffect(() => {
        if (markerPosition && map) {
            const maps =  (window as any).google.maps;
            if (marker) {
                marker.setMap(null);
                setMarker(null)
            }

            const newMarker = new maps.Marker({
                position: markerPosition,
                map,
                animation: maps.Animation.DROP});
            setMarker(newMarker)
        }
    }, [markerPosition]);


    React.useEffect(() => console.log('map:',mapPosition , 'address:' , selectedAddress, 'marker:',markerPosition ) , [mapPosition, selectedAddress, markerPosition]);
    const onMarkerDragEnd = async (event: any) => {
        const lat = event.lat, lng = event.lng;
        const newLocation = {lat, lng};
        const placeDetails = await requestDetailsFromLocation(newLocation);
        const detailsDBPayload = Array.isArray(placeDetails) ? placeDetails[0] : placeDetails;
        setSelectedAddress(detailsDBPayload);
        setMarkerPosition(newLocation);
        setMapPosition(newLocation);
    };

    const handleApiLoaded = (loadObject: any) => setMap(loadObject.map);

    const handleAddressSelected = async (event:React.ChangeEvent<{}>, placeData: GoogleApiPlace | null) => {
        const details = placeData ? await requestDetailsFromPlaceId(placeData.place_id) : null;
        const description = placeData?.description;
        const detailsDBPayload = Array.isArray(details) ? details[0] : details;

        const geoCodedAddress =  detailsDBPayload ? ({...detailsDBPayload, description}) : null;
        setSelectedAddress(geoCodedAddress);

        if (geoCodedAddress) {
            const newLocation = {
                lng: geoCodedAddress.geometry.location.lng(),
                lat: geoCodedAddress.geometry.location.lat(),
            };

            setMarkerPosition(newLocation);
            setMapPosition(newLocation);
        } else {
            setMarkerPosition(null);
            setMapPosition(defaultMapPosition);
        }
    };

    return <div style={{height: props.height || '40vh', width: '55vw', marginBottom: '3vh'}}>
        <LocationInput selectedAddress={selectedAddress as GoogleApiPlace}
                       setSelectedAddress={handleAddressSelected}/>
        <GoogleMap bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_API_KEY}}
                   defaultZoom={15} center={mapPosition}
                   yesIWantToUseGoogleMapApiInternals
                   onGoogleApiLoaded={handleApiLoaded}
                   onClick={onMarkerDragEnd}
        >
        </GoogleMap>
    </div>;
};

export default Map;