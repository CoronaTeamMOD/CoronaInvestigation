import React from 'react';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';

export interface usePlacesTypesAndSubTypesIncome {
    setPlacesSubTypesByTypes: React.Dispatch<React.SetStateAction<PlacesSubTypesByTypes>>;
};