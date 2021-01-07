import React from 'react';
import axios  from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import PlaceSubType from 'models/PlaceSubType';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import { usePlacesTypesAndSubTypesIncome } from './usePlacesTypesAndSubTypesInterfaces';

const OTHER = 'אחר';

const usePlacesTypesAndSubTypes = (parameters: usePlacesTypesAndSubTypesIncome) => {

    const { setPlacesSubTypesByTypes } = parameters;

    const getPlacesSubTypesByTypes = () => {
        const getPlacesSubTypesByTypesLogger = logger.setup('Fetching Places And Sub Types By Types');
        getPlacesSubTypesByTypesLogger.info('launching places and sub types by types request', Severity.LOW);
        setIsLoading(true)
        axios.get('/intersections/getPlacesSubTypesByTypes').then(
            result => {
                if (result?.data) {
                    const sortedResult : PlacesSubTypesByTypes = {};
                    Object.keys(result.data).forEach((placeTypes)=>{
                        sortedResult[placeTypes] = result.data[placeTypes].sort(sortAndMoveOtherValueToLast);
                    })

                    getPlacesSubTypesByTypesLogger.info('places and sub types by types request was successful', Severity.LOW);
                    setPlacesSubTypesByTypes(sortedResult)
                } else {
                    getPlacesSubTypesByTypesLogger.warn('got status 200 but wrong data', Severity.HIGH);
                }
            }
        ).catch((error) => {
            getPlacesSubTypesByTypesLogger.error(`got errors in server result: ${error}`,Severity.HIGH);
        }).finally(() => setIsLoading(false))
    };

    const sortAndMoveOtherValueToLast = (firstPlaceType : PlaceSubType, secondPlaceType : PlaceSubType) => {
        if(firstPlaceType.displayName === OTHER){
            return 1;
        }

        if(secondPlaceType.displayName === OTHER){
            return -1;
        }

        return firstPlaceType.displayName < secondPlaceType.displayName ? -1 : 1;
    }

    React.useEffect(() => {
        getPlacesSubTypesByTypes();
    }, []);
};

export default usePlacesTypesAndSubTypes;
