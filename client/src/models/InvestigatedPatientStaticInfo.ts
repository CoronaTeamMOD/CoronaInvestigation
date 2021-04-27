import IdentificationType from "./IdentificationType";

interface InvestigatedPatientStaticInfo {
    isDeceased: boolean;
    additionalPhoneNumber: string;
    gender: string;
    identityType: IdentificationType;
    isCurrentlyHospitalized: boolean;
    isInClosedInstitution: boolean;
    isReturnSick: boolean;
    previousDiseaseStartDate: string | null;
    isVaccinated: boolean;
    vaccinationEffectiveFrom: string | null;
    isSuspicionOfMutation: boolean;
    mutationName: string | null;
};

export default InvestigatedPatientStaticInfo;