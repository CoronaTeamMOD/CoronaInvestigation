export interface GetInvestigatedPatientClinicalDetailsFields {
    data: {
        investigationByEpidemiologyNumber: ClinicalDetails
    }
}

interface ClinicalDetails {
    isolationAddress: {
        apartment: number;
        houseNum: number;
        streetByStreet: {
            displayName: string,
            id: string,
        };
        cityByCity: {
            displayName: string,
            id: string
        };
    }
    epidemiologyNumber: number;
    isolationStartDate: Date | null;
    isolationEndDate: Date | null;
    isolationSource: number | null;
    isInIsolation: boolean | null;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: {
        nodes: {symptomName: string}[]
    },
    investigatedPatientByInvestigatedPatientId: {
        isPregnant: boolean | null;
        doesHaveBackgroundDiseases: boolean;
        investigatedPatientBackgroundDiseasesByInvestigatedPatientId: {
            nodes: {backgroundDeseasName: string}[]
        }
    },
    hospital: string;
    hospitalizationStartDate: Date | null;
    hospitalizationEndDate: Date | null;
    wasHospitalized: boolean;
    doesHaveSymptoms: boolean;
    otherSymptomsMoreInfo: string;
    otherBackgroundDiseasesMoreInfo: string;
}