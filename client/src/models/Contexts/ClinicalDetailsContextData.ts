import FlattenedDBAddress from 'models/DBAddress';
import SymptomsExistenceInfo from 'models/SymptomsExistenceInfo';

interface ClinicalDetailsData extends SymptomsExistenceInfo {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationSource: number | null;
    isolationAddress: FlattenedDBAddress;
    isInIsolation: boolean;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    isSymptomsStartDateUnknown: boolean;
    symptoms: string[];
    doesHaveBackgroundDiseases: boolean;
    backgroundDeseases: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    wasHospitalized: boolean;
    isPregnant: boolean;
    otherSymptomsMoreInfo: string;
    otherBackgroundDiseasesMoreInfo: string;
};

export default ClinicalDetailsData;
