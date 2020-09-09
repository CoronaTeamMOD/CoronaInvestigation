import DBAddress from "models/enums/DBAddress";

interface ClinicalDetailsData {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress: DBAddress;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: string[];
    backgroundDeseases: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    isPregnant: boolean;
};

export default ClinicalDetailsData;
