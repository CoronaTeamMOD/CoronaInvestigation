import React from 'react';

export interface useOptionalExposureAndAbroadIncome {
    wasExposedToVerifiedPatient: boolean,
    setWasExposedToVerifiedPatient: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface useOptionalExposureAndAbroadOutcome {
    wasExposedToVerifiedPatientToggle: (event: React.ChangeEvent<{}>, value: boolean) => void;
}