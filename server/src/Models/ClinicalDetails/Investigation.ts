interface Investigation {
    isolationStartTime: Date | null;
    isolationEndTime: Date | null;
    isolationAddress: number;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartTime: Date | null;
    hospital: string;
    hospitalizationStartTime: Date | null;
    hospitalizationEndTime: Date | null;
    investigatedPatientId: number;
    epidemiologyNumber: number;
    creator: string;
    lastUpdator: string;
};

export default Investigation;
