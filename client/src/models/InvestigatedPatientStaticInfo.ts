interface InvestigatedPatientStaticInfo {
    isDeceased: boolean;
    additionalPhoneNumber: string;
    gender: string;
    identityType: string;
    isCurrentlyHospitalized: boolean;
    isInClosedInstitution: boolean;
    isReturnSick: boolean;
    previousDiseaseStartDate: Date | null;
    isVaccinated: boolean;
    vaccinationEffectiveFrom: Date | null;
    isSuspicionOfMutation: boolean;
    mutationName: string | null;
};

export default InvestigatedPatientStaticInfo;