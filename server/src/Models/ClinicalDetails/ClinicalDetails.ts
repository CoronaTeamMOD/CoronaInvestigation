interface ClinicalDetails {
    epidemiologyNumber: number;
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress: string;
    isInIsolation: boolean;
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
    isPregnant: boolean;
    investigatedPatientId: number;
    doesHaveBackgroundDiseases: boolean;
    otherSymptomsMoreInfo: string;
    otherBackgroundDiseasesMoreInfo: string;
    isolationSource: number | null;
    isolationSourceDesc: string | null;
};

export default ClinicalDetails;
