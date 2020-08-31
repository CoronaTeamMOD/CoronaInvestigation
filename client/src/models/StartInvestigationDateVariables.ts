import React from 'react';

interface StartInvestiationDateVariables {
    symptomsStartDate: Date | undefined;
    exposureDate: Date | undefined;
    setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setExposureDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export default StartInvestiationDateVariables;