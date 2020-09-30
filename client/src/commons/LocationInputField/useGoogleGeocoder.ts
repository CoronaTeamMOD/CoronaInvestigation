import React from "react";
import {GeocodeResponse} from "./LocationInput";
import injectScript from "./useGoogleScriptInjector";

const useGoogleGeocoder = () => {
    const [geocoder, setGeocoder] = React.useState<google.maps.Geocoder>();

    React.useEffect(() => {
        injectScript()
            .then(maps => setGeocoder(new maps.Geocoder()))
            .catch(console.error);
    }, []);

    const getDetailsFromPlaceId = (placeId: string): Promise<GeocodeResponse[] | GeocodeResponse> =>
        new Promise((resolve, reject) => {
            if (geocoder) {
                geocoder.geocode({placeId},
                    (data, status) => (status === 'OK') ? resolve(data) : reject({error:{status}})
                );
            } else {
                if((window as any).google.maps) {
                    const tempGeocoder = new (window as any).google.maps.Geocoder() as google.maps.Geocoder;
                    tempGeocoder.geocode({placeId},
                        (data, status) => (status === 'OK') ? resolve(data) : reject({error:{status}})
                    );
                    return;
                }

                reject({error: 'geocoder undefined'})
            }
        });

    const getDetailsFromGeometry = (location: google.maps.LatLngLiteral): Promise<GeocodeResponse[] | GeocodeResponse> =>
        new Promise((resolve, reject) => {
            if (geocoder) {
                geocoder.geocode({location},
                    (data, status) => (status === 'OK') ? resolve(data) : reject({error:{status}})
                );
            } else {
                reject({error: 'geocoder undefined'})
            }
        });

    const requestDetailsFromPlaceId = React.useCallback(getDetailsFromPlaceId, [geocoder]);
    const requestDetailsFromLocation = React.useCallback(getDetailsFromGeometry, [geocoder]);

    return {
        requestDetailsFromPlaceId,
        requestDetailsFromLocation
    }
};

export default useGoogleGeocoder;