type ConnectedInvestigationContact = {
    investigationGroupReasonByReason: {
        displayName : string;
    }
    nodes : ConnectedInvestigation[]
}

export type ConnectedInvestigation = {
    epidemiologyNumber: number,
    contactEventsByInvestigationId:{
        nodes : ContactEvent[]
    },
    investigatedPatientByInvestigatedPatientId: CovidPatient
}

type ContactEvent = {
    contactedPeopleByContactEvent : {
        nodes: {
            addressByIsolationAddress: {
                cityByCity: {
                    displayName: string;
                }
            },
            personByPersonInfo: {
                firstName : string;
                lastName : string;
                id : number;
                identificationNumber: string;
            }
        }[]
    }
}

type CovidPatient = {
    covidPatientByCovidPatient: {
        fullName: string;
        identityNumber: string;
    }
}

export default ConnectedInvestigationContact;