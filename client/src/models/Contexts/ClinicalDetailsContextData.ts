import FlattenedDBAddress from 'models/DBAddress';
import SymptomsExistenceInfo from 'models/SymptomsExistenceInfo';

interface ClinicalDetailsData extends SymptomsExistenceInfo {
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationSource: number | null;
    isolationSourceDesc: string | null;
    isolationAddress: FlattenedDBAddress;
    isInIsolation: boolean | null;
    isIsolationProblem: boolean | null;
    isIsolationProblemMoreInfo: string;
    isSymptomsStartDateUnknown: boolean;
    symptoms: string[];
    doesHaveBackgroundDiseases: boolean | null;
    backgroundDeseases: string[];
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    wasHospitalized: boolean;
    isPregnant: boolean | null;
    otherSymptomsMoreInfo: string;
    otherBackgroundDiseasesMoreInfo: string;
    wasInstructedToBeInIsolation: boolean;
};

export default ClinicalDetailsData;
