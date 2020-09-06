interface ClinicalDetailsData {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress: string;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: string[];
    backgroundIllnesses: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
};

export default ClinicalDetailsData;
