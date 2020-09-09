import ClinicalDetails from '../../../../client/src/models/Contexts/ClinicalDetailsContextData';

interface ClinicalDetailsRequest extends ClinicalDetails {
    investigatedPatientId: number;
    epidemioligyNumber: number;
    creator: string;
    lastUpdator: string;
};

export default ClinicalDetailsRequest;
