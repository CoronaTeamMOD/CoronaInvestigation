import React from 'react';
import LocationsSubTypesByTypes from 'models/LocationsSubTypesByTypes';

export interface useLocationsTypesAndSubTypesIncome {
    setLocationsSubTypesByTypes: React.Dispatch<React.SetStateAction<LocationsSubTypesByTypes>>;
    // setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>>;
    // setHasBackgroundDiseases: React.Dispatch<React.SetStateAction<boolean>>;
    // setWasHospitalized: React.Dispatch<React.SetStateAction<boolean>>;
    // setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
    // setBackgroundDiseases: React.Dispatch<React.SetStateAction<string[]>>;
};

export interface useLocationsTypesAndSubTypesOutcome {
    // isInIsolationToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    // hasSymptomsToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    // hasBackgroundIllnessesToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
    // wasHospitalizedToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
};
