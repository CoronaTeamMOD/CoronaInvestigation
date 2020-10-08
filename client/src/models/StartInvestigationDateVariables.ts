import React from 'react';

interface StartInvestigationDateVariables {
    exposureDate: Date | undefined;
    hasSymptoms: boolean;
    endInvestigationDate: Date;
    symptomsStartDate: Date | undefined;
    setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | undefined>> | undefined;
    setExposureDate: React.Dispatch<React.SetStateAction<Date | undefined>> | undefined;
    setHasSymptoms: React.Dispatch<React.SetStateAction<boolean>> | undefined;
    setEndInvestigationDate: React.Dispatch<React.SetStateAction<Date>> | undefined;
}

export default StartInvestigationDateVariables;
