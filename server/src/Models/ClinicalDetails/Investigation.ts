interface Investigation {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress: string;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    investigatedPatientId: number;
    epidemioligyNumber: number;
    creator: number;
    lastUpdator: number;
};

export default Investigation;
