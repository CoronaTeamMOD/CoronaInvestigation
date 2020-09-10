import React from 'react';

import axios from 'Utils/axios';

import { usePlacesTypesAndSubTypesIncome } from './usePlacesTypesAndSubTypesInterfaces';

const usePlacesTypesAndSubTypes = (parameters: usePlacesTypesAndSubTypesIncome) => {

    const { setPlacesSubTypesByTypes } = parameters;

    const getPlacesSubTypesByTypes = () => {
        axios.get('/intersections/getPlacesSubTypesByTypes').then(
            result => (result && result.data) && setPlacesSubTypesByTypes(result.data)
        );
    };

    React.useEffect(() => {
        getPlacesSubTypesByTypes();
    }, []);
};

export default usePlacesTypesAndSubTypes;
