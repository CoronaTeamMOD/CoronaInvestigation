import PersonStaticInfo from './PersonStaticInfo';

interface InvestigatedPatientStaticInfo {
    isDeceased: boolean;
    additionalPhoneNumber: string;
    gender: string;
    identityType: string;
    patientInfo: PersonStaticInfo;
    isHospitalized: boolean;
    isInInstitution: boolean;
};

export default InvestigatedPatientStaticInfo;
