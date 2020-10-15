import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';

import { usePlacesTypesAndSubTypesIncome } from './usePlacesTypesAndSubTypesInterfaces';


const usePlacesTypesAndSubTypes = (parameters: usePlacesTypesAndSubTypesIncome) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const { setPlacesSubTypesByTypes } = parameters;

    const getPlacesSubTypesByTypes = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Places And Sub Types By Types',
            step: 'launching places and sub types by types request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/intersections/getPlacesSubTypesByTypes').then(
            result => {
                if (result && result.data) {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching Places And Sub Types By Types',
                        step: 'places and sub types by types request was successful',
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    setPlacesSubTypesByTypes(result.data)
                } else {
                    logger.warn({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Fetching Places And Sub Types By Types',
                        step: 'got status 200 but wrong data'
                    });
                }
            }
        ).catch((error) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.HIGH,
                workflow: 'Fetching Places And Sub Types By Types',
                step: `got errors in server result: ${error}`,
                user: userId,
                investigation: epidemiologyNumber
            });
        })
    };

    React.useEffect(() => {
        getPlacesSubTypesByTypes();
    }, []);
};

export default usePlacesTypesAndSubTypes;
