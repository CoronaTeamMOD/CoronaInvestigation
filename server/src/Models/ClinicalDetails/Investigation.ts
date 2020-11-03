interface Investigation {
    isolationStartTime: Date | null;
    isolationEndTime: Date | null;
    isInIsolation: boolean;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartTime: Date | null;
    hospital: string;
    hospitalizationStartTime: Date | null;
    hospitalizationEndTime: Date | null;
    wasHospitalized: boolean;
    doesHaveSymptoms: boolean;
    epidemiologyNumber: number;
    isolationAddress: number | null;
    otherSymptomsMoreInfo: string;
    isolationSource: number | null;
};

export default Investigation;
