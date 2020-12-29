import React from 'react';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import PlaceSubType from 'models/PlaceSubType';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

import { usePlacesTypesAndSubTypesIncome } from './usePlacesTypesAndSubTypesInterfaces';

const OTHER = 'אחר';

const usePlacesTypesAndSubTypes = (parameters: usePlacesTypesAndSubTypesIncome) => {

    const { setPlacesSubTypesByTypes } = parameters;

    const getPlacesSubTypesByTypes = () => {
        const getPlacesSubTypesByTypesLogger = logger.setup('Fetching Places And Sub Types By Types');
        getPlacesSubTypesByTypesLogger.info('launching places and sub types by types request', Severity.LOW);
        axios.get('/intersections/getPlacesSubTypesByTypes').then(
            result => {
                if (result?.data) {

                    let sortedResult : PlacesSubTypesByTypes = {};
                    Object.keys(result.data).forEach((placeTypes)=>{
                        sortedResult[placeTypes] = moveOtherValueLocationToLast(result.data[placeTypes]);
                    })

                    getPlacesSubTypesByTypesLogger.info('places and sub types by types request was successful', Severity.LOW);
                    setPlacesSubTypesByTypes(sortedResult)
                } else {
                    getPlacesSubTypesByTypesLogger.warn('got status 200 but wrong data', Severity.HIGH);
                }
            }
        ).catch((error) => {
            getPlacesSubTypesByTypesLogger.error(`got errors in server result: ${error}`,Severity.HIGH);
        })
    };

    const moveOtherValueLocationToLast = (placetypes: PlaceSubType[] ) => {
        const otherIndex : number = placetypes.findIndex(source => source.displayName === OTHER);
        const otherPlaceType : {id:number,displayName:string}[] = placetypes.splice(otherIndex, 1);
        return placetypes.concat(otherPlaceType);
    }

    React.useEffect(() => {
        getPlacesSubTypesByTypes();
    }, []);
};

export default usePlacesTypesAndSubTypes;
