import React from 'react';

import axios from 'Utils/axios';

import { useLocationsTypesAndSubTypesIncome } from './useLocationsTypesAndSubTypesInterfaces';

const useLocationsTypesAndSubTypes = (parameters: useLocationsTypesAndSubTypesIncome) => {

    const { setLocationsSubTypesByTypes } = parameters;

    const getLocationsSubTypesByTypes = () => {
        axios.get('/contactEvents/getLocationsSubTypesByTypes').then(
            result => (result && result.data) && setLocationsSubTypesByTypes(result.data)
        );
    };

    React.useEffect(() => {
        getLocationsSubTypesByTypes();
    }, []);
};

export default useLocationsTypesAndSubTypes;
