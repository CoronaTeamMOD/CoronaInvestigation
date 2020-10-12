import CovidPatientDBOutput from '../Exposure/CovidPatientDBOutput';

interface GetInvestigatedPatientDetails {
    data: {
        investigationByEpidemiologyNumber: {
            investigatedPatientByInvestigatedPatientId : PersonalInfoDbData
        }
    }
}

export interface PersonalInfoDbData {
    covidPatientByCovidPatient: CovidPatientDBOutput,
    additionalPhoneNumber: string;
    patientContactPhoneNumber: string;
    patientContactInfo: string;
    subOccupation: string;
    occupation: string;
    otherOccupationExtraInfo: string;
    hmo: string;
    id: number;
    subOccupationBySubOccupation : {
        city: number,
        displayName: string
    }
}

export default GetInvestigatedPatientDetails;