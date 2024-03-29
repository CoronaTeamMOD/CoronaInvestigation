interface ClinicalDetails {
    epidemiologyNumber: number;
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress?: string;
    isolationAddressId?: number;
    isInIsolation: boolean | null;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: string[];
    backgroundDeseases: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    wasHospitalized: boolean;
    doesHaveSymptoms: boolean;
    isPregnant: boolean | null;
    investigatedPatientId: number;
    doesHaveBackgroundDiseases: boolean;
    otherSymptomsMoreInfo: string;
    otherBackgroundDiseasesMoreInfo: string;
    isolationSource: number | null;
    isolationSourceDesc: string | null;
    wasInstructedToBeInIsolation: boolean;
};

export default ClinicalDetails;
