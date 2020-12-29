export interface GetInvestigatedPatientClinicalDetailsFields {
    data: {
        investigationByEpidemiologyNumber: ClinicalDetails
    }
}

interface ClinicalDetails {
    isolationAddress: {
        floor: number;
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
    isInIsolation: boolean;
    isIsolationProblem: boolean;
    isIsolationProblemMoreInfo: string;
    symptomsStartDate: Date | null;
    symptoms: {
        nodes: {symptomName: string}[]
    },
    investigatedPatientByInvestigatedPatientId: {
        isPregnant: boolean;
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