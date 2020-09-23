import React, {ReactElement, useCallback} from 'react';
import {withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker} from "react-google-maps";
import LocationInput, {GeocodeResponse, GoogleApiPlace} from "../commons/LocationInputField/LocationInput";
import useDBParser from "../Utils/vendor/useDBParsing";
import injectScript from "../commons/LocationInputField/useGoogleScriptInjector";
import useGoogleApiAutocomplete from "../commons/LocationInputField/useGoogleApiAutocomplete";

interface MapProps {
    height?: number | string;
}

const Map = (props: MapProps) => {
    const {parseLocation} = useDBParser();
    const mapContainer = <div style={{height: props.height || '40vh', width: '55vw'}}/>;
    const mapElement = <div style={{height: `100%`}}/>;

    const {
       requestDetailsFromPlaceId} = useGoogleApiAutocomplete();
    const defaultMapPosition = {lng: 34.8516, lat: 31.0461};
    const defaultMarkerPosition = {lng: 0, lat: 0};
    const [mapPosition, setMapPosition] = React.useState(defaultMapPosition);
    const [markerPosition, setMarkerPosition] = React.useState(defaultMarkerPosition);
    const [selectedAddress, setSelectedAddress] = React.useState<GeocodeResponse | null>(null);
    const [mapComponent, setMapComponent] = React.useState<React.ReactElement>( <div>sandy</div>);

    React.useEffect(() => {
        injectScript()
            .then(() => setMapComponent(  <AsyncMap containerElement={mapContainer} mapElement={mapElement}/>))
            .catch(() => setMapComponent( <div>ERROR</div>))
            .finally(() => console.log((window as any).google.maps))
    }, []);


    const onMarkerDragEnd = async (event: any) => {
        const lat = event.latLng.lat(),
            lng = event.latLng.lng();

        // // todo make it update the search field
        // const placeDetails = await getDetailsFromGeometry({lat, lng});
        // setSelectedAddress(placeDetails);
    };

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
            setMarkerPosition(defaultMarkerPosition);
            setMapPosition(defaultMapPosition);
        }
    };

    const AsyncMap = withGoogleMap(
        () =>
            // not sure if center is true
            <GoogleMap defaultZoom={15} defaultCenter={{...defaultMapPosition}}
                       center={{...mapPosition}}>
                <Marker draggable
                        onDragEnd={onMarkerDragEnd}
                        position={{...markerPosition}}
                />
                <LocationInput selectedAddress={selectedAddress as GoogleApiPlace} setSelectedAddress={handleAddressSelected}/>
            </GoogleMap>
    );



    return mapComponent;
};

export default Map;