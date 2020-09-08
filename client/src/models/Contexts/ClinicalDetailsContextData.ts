interface ClinicalDetailsData {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress: string;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: string[];
    backgroundDeseases: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    isPregnant: boolean;
    investigatedPatientId: number;
    epidemioligyNumber: number;
    creator: string,
    lastUpdator: string,
};

export default ClinicalDetailsData;
