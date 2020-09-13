import React, {useCallback} from 'react';
import {withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker} from "react-google-maps";
import LocationInput, {PlaceDetails} from "../commons/LocationInputField/LocationInput";
import useGoogleApiAutocomplete from "../commons/LocationInputField/useGoogleApiAutocomplete";

interface MapProps {
    height?: number | string;
}

const Map = (props: MapProps) => {
    const {getDetailsFromGeometry, loadScript} = useGoogleApiAutocomplete();
    const defaultMapPosition = {lon: 0, lat: 0};
    const defaultMarkerPosition = {lon: 0, lat: 0};
    const [mapPosition, setMapPosition] = React.useState(defaultMapPosition);
    const [markerPosition, setMarkerPosition] = React.useState(defaultMarkerPosition);
    const [selectedAddress, setSelectedAddress] = React.useState<PlaceDetails | null>(null);
    const [mapComponent, setMapComponent] = React.useState<React.ElementType>(() => <div>sandy</div>);

    React.useEffect(() => {
        loadScript()
            .then(() => setMapComponent( () => <AsyncMap containerElement={mapContainer} mapElement={mapElement}/>))
            .catch(() => setMapComponent(() =>  <div>ERROR</div>))
    })
    const onMarkerDragEnd = async (event: any) => {
        const lat = event.latLng.lat(),
            lon = event.latLng.lon();

        // todo make it update the search field
        const placeDetails = await getDetailsFromGeometry({lat, lon});
        setSelectedAddress(placeDetails);
    };

    const handleAddressSelected = (placeData: PlaceDetails | null) => {
        setSelectedAddress(placeData);

        if (placeData) {
            const newLocation = {
                lon: placeData.geometry.location.lon(),
                lat: placeData.geometry.location.lat(),
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
                <LocationInput handleLocationSelect={handleAddressSelected}/>
            </GoogleMap>
    );

    const mapContainer = <div style={{height: props.height || '50vh'}}/>;
    const mapElement = <div style={{height: `100%`}}/>;

    return (
        {mapComponent}
    );
};

export default Map;