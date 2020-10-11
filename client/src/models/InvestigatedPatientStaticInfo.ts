import PersonStaticInfo from './PersonStaticInfo';

interface InvestigatedPatientStaticInfo {
    isDeceased: boolean;
    additionalPhoneNumber: string;
    gender: string;
    identityType: string;
    patientInfo: PersonStaticInfo;
}

export default InvestigatedPatientStaticInfo;
