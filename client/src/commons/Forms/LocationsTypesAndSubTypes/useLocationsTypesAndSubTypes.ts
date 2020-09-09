import React from 'react';

import axios from 'Utils/axios';

import { useLocationsTypesAndSubTypesIncome, useLocationsTypesAndSubTypesOutcome } from './useLocationsTypesAndSubTypesInterfaces';

const useLocationsTypesAndSubTypes = (parameters: useLocationsTypesAndSubTypesIncome) : useLocationsTypesAndSubTypesOutcome => {

    const { setLocationsSubTypesByTypes } = parameters;

    const getLocationsSubTypesByTypes = () => {
        axios.get('/intersections/getLocationsSubTypesByTypes').then(
            result => (result && result.data) && setLocationsSubTypesByTypes(result.data)
        );
    };

    React.useEffect(() => {
        getLocationsSubTypesByTypes();
    }, []);

    return {

    }
};

export default useLocationsTypesAndSubTypes;
