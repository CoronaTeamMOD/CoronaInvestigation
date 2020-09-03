interface ClinicalDetailsData {
    isolationStartDate: Date;
    isolationEndDate: Date;
    isolationAddress: string;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: string[];
    backgroundIllnesses: string[];
    hospital: string;
    hospitalizationStartDate: Date;
    hospitalizationEndDate: Date;
};

export default ClinicalDetailsData;
