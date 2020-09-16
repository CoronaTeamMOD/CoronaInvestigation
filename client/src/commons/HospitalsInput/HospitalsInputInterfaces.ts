import React from 'react';

import Hospital from 'models/Hospital';

export interface useHospitalsInputsIncome {
    hospitals: Hospital[];
    setHospitals: React.Dispatch<React.SetStateAction<Hospital[]>>;
}

export interface useHospitalsInputsOutcome {
    loadHospitals: () => void;
}