import FlattenedDBAddress from 'models/DBAddress';

interface ClinicalDetailsData {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationSource: number | null;
    isolationAddress: FlattenedDBAddress;
    isInIsolation: boolean;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    isSymptomsStartDateUnknown: boolean;
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
    otherSymptomsMoreInfo: string;
    otherBackgroundDiseasesMoreInfo: string;
};

export default ClinicalDetailsData;
