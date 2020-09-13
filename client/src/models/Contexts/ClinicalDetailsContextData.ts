import DBAddress from 'models/enums/DBAddress';

interface ClinicalDetailsData {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationAddress: DBAddress;
    isInIsolation: boolean;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: string[];
    doesHaveBackgroundDiseases: boolean;
    backgroundDeseases: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    doesHaveSymptoms: boolean;
    wasHospitalized: boolean;
    isPregnant: boolean;
};

export default ClinicalDetailsData;
