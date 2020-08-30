import React from 'react';

interface StartInvestiationDateVariables {
    hasSymptoms: Date | undefined;
    exposureDate: Date | undefined;
    setHasSymptoms: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setExposureDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export default StartInvestiationDateVariables;