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
    epidemioligyNumber: number;
    creator: string;
    lastUpdator: string;
    doesHaveBackgroundDiseases: boolean;
    otherSymptomsMoreInfo: string;
};

export default ClinicalDetails;
