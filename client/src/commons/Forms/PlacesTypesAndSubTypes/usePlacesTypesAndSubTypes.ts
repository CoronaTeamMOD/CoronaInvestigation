import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import axios  from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import PlaceSubType from 'models/PlaceSubType';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';


import StoreStateType from 'redux/storeStateType';
import {setPlaceTypes} from 'redux/PlaceTypes/placetypeActionCreators';

const OTHER = 'אחר';

const usePlacesTypesAndSubTypes = () => {
    const placesSubTypesByTypes = useSelector<StoreStateType,PlacesSubTypesByTypes>(state => state.placeSubTypesByTypes);


    const subtypesFetched = useMemo(() => Object.keys(placesSubTypesByTypes).length > 0, [placesSubTypesByTypes]);

    const getPlacesSubTypesByTypes = () => {
        if (Object.keys(placesSubTypesByTypes).length > 0) {
            return;
        }

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
                    setPlaceTypes(sortedResult);
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

    return {
        subtypesFetched,
        placesSubTypesByTypes
    }
};

export default usePlacesTypesAndSubTypes;
