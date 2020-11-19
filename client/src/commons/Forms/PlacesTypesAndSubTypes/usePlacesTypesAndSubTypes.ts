import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';

import { usePlacesTypesAndSubTypesIncome } from './usePlacesTypesAndSubTypesInterfaces';


const usePlacesTypesAndSubTypes = (parameters: usePlacesTypesAndSubTypesIncome) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const { setPlacesSubTypesByTypes } = parameters;

    const getPlacesSubTypesByTypes = () => {
        const getPlacesSubTypesByTypesLogger = logger.setup({
            workflow: 'Fetching Places And Sub Types By Types',
            user: userId,
            investigation: epidemiologyNumber
        });
        getPlacesSubTypesByTypesLogger.info('launching places and sub types by types request',Severity.LOW)
        axios.get('/intersections/getPlacesSubTypesByTypes').then(
            result => {
                if (result && result.data) {
                    getPlacesSubTypesByTypesLogger.info('places and sub types by types request was successful',Severity.LOW)
                    setPlacesSubTypesByTypes(result.data)
                } else {
                    getPlacesSubTypesByTypesLogger.warn('got status 200 but wrong data',Severity.HIGH)
                }
            }
        ).catch((error) => {
            getPlacesSubTypesByTypesLogger.error(`got errors in server result: ${error}`,Severity.HIGH)
        })
    };

    React.useEffect(() => {
        getPlacesSubTypesByTypes();
    }, []);
};

export default usePlacesTypesAndSubTypes;
