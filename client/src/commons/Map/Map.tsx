import React from 'react';
// @ts-ignore
import GoogleMap from 'google-map-react';
import LocationInput, {
    GeocodeResponse,
    GoogleApiPlace
} from '../LocationInputField/LocationInput';

import useDBParser from 'Utils/vendor/useDBParsing';
import useGoogleGeocoder from 'commons/LocationInputField/useGoogleGeocoder';
import injectScript from 'commons/LocationInputField/useGoogleScriptInjector';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';

interface MapProps {
    height?: number | string;
    width?: number | string;
    selectedAddress: GeocodeResponse | null;
    setSelectedAddress: (newValue: GeocodeResponse | null) => void;
    name: string;
}

const defaultMapPosition = { lng: 35.217018, lat: 31.771959 };
const FOCUSED_ZOOM = 20;
const DEFAULT_ZOOM = 8;
const DEFAULT_MAP_HEIGHT = '20vh';
const DEFAULT_MAP_WIDTH = '30vw';
const Map = ({ selectedAddress, setSelectedAddress, name, ...props }: MapProps) => {
    const { parseAddress } = useGoogleApiAutocomplete();
    const { requestDetailsFromLocation } = useGoogleGeocoder();
    const { parseLocation } = useDBParser();
    const [mapPosition, setMapPosition] = React.useState<google.maps.LatLngLiteral | google.maps.LatLngBounds>(defaultMapPosition);
    const [markerPosition, setMarkerPosition] = React.useState<google.maps.LatLngLiteral| null>(null);
    const [marker, setMarker] = React.useState<google.maps.Marker | null>(null);
    const [map, setMap] = React.useState();
    const zoom = React.useMemo(() => selectedAddress ? FOCUSED_ZOOM : DEFAULT_ZOOM, [selectedAddress]);
    const _isMounted = React.useRef(true);

    //cleanup
    React.useEffect(() => {
        return () => {_isMounted.current = false}
    }, []);

    React.useEffect(() => {
        if (marker) {
            marker.setMap(null);
        }
        if(map) {
            if(markerPosition) {
                const maps =  (window as any).google.maps;
                const newMarker = new maps.Marker({
                    position: markerPosition,
                    map,
                    animation: maps.Animation.DROP});

                setMarker(newMarker)
            } else {
                setMarker(null)
            }
        }
    }, [map, markerPosition]);


    const onAddressChange = async () => {
        const parsedAddress = parseAddress(selectedAddress);
        const placeData = await parseLocation(selectedAddress);
        if(!parsedAddress) {
            setMarkerPosition(null);
            setMapPosition(defaultMapPosition);
            return;
        }

        if(_isMounted.current) {
            if (placeData) {
                const {geometry: {location : {lat,lng}, viewport}}= placeData;
                const newLocation = {
                    lng: typeof lng === 'function' ? lng() : (lng as number),
                    lat: typeof lat === 'function' ? lat() : (lat as number),
                };

                setMarkerPosition(newLocation);
                setMapPosition(newLocation);
                map && map.fitBounds(viewport);
            } else {
                setMarkerPosition(null);
                setMapPosition(defaultMapPosition);
            }
        }
    };

    React.useEffect(() => {
        onAddressChange()
    }, [selectedAddress]);

    const onMarkerDragEnd = async (event: any) => {
        const lat = event.lat, lng = event.lng;
        const newLocation = {lat, lng};
        const placeDetails = await requestDetailsFromLocation(newLocation);
        const detailsDBPayload = Array.isArray(placeDetails) ? placeDetails[0] : placeDetails;
        if(_isMounted.current) {
            setSelectedAddress(detailsDBPayload);
            setMarkerPosition(newLocation);
            setMapPosition(newLocation);
        }
    };

    const handleApiLoaded = (loadObject: any) => {
        setMap(loadObject.map)
    };

    const handleAddressSelected = (placeData: GoogleApiPlace | null) => {
        setSelectedAddress(placeData as GeocodeResponse);
    };

    const height = props.height || DEFAULT_MAP_HEIGHT;
    const width = props.width || DEFAULT_MAP_WIDTH;
    return <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', padding: '3vh 0'}}>
        <LocationInput name={name}
                       selectedAddress={selectedAddress as GoogleApiPlace}
                       setSelectedAddress={handleAddressSelected}
        />
        <div style={{height, width}}>
        <GoogleMap googleMapLoader={injectScript}
                   zoom={zoom} center={mapPosition}
                   yesIWantToUseGoogleMapApiInternals
                   onGoogleApiLoaded={handleApiLoaded}
                   onClick={onMarkerDragEnd}
        />
        </div>
    </div>;
};

export default Map;
