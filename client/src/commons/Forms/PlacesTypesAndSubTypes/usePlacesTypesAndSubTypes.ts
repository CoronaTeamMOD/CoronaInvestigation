import React from 'react';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';

import { usePlacesTypesAndSubTypesIncome } from './usePlacesTypesAndSubTypesInterfaces';

const OTHER = 'אחר';

const usePlacesTypesAndSubTypes = (parameters: usePlacesTypesAndSubTypesIncome) => {

    const { setPlacesSubTypesByTypes } = parameters;

    const getPlacesSubTypesByTypes = () => {
        const getPlacesSubTypesByTypesLogger = logger.setup('Fetching Places And Sub Types By Types');
        getPlacesSubTypesByTypesLogger.info('launching places and sub types by types request', Severity.LOW);
        axios.get('/intersections/getPlacesSubTypesByTypes').then(
            result => {
                if (result && result.data) {

                    for(let placeTypes in result.data){
                        result.data[placeTypes] = moveOtherValueLocationToLast(result.data[placeTypes]);
                    }

                    getPlacesSubTypesByTypesLogger.info('places and sub types by types request was successful', Severity.LOW);
                    setPlacesSubTypesByTypes(result.data)
                } else {
                    getPlacesSubTypesByTypesLogger.warn('got status 200 but wrong data', Severity.HIGH);
                }
            }
        ).catch((error) => {
            getPlacesSubTypesByTypesLogger.error(`got errors in server result: ${error}`,Severity.HIGH);
        })
    };

    const moveOtherValueLocationToLast = (placetypes:Array<{id:number,displayName:string}>) => {
        let foundOtherValue = false;
        //Checks if the 'other' value is not last already
        if(placetypes[placetypes.length-1].displayName != OTHER){
            for(let index = 0; index < placetypes.length && !foundOtherValue; index++){
                if(placetypes[index].displayName === OTHER){
                    placetypes.push(placetypes.splice(index, 1)[0]);
                    foundOtherValue = true;
                }
            }
        }
        
        return placetypes;
    }

    React.useEffect(() => {
        getPlacesSubTypesByTypes();
    }, []);
};

export default usePlacesTypesAndSubTypes;
