import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

export const noInvestigations = {
    investigationsByGroupId : {
        nodes : []
    }
}

export const familyContactReason = {
    investigationGroupReasonByReason : {
        id: 100000,
        displayName: "מגעי משפחה"    
    }
}

export const otherContactReason = {
    otherReason : "בדיקה",
    investigationGroupReasonByReason : {
        id: -1,
        displayName: "לא אמור להיראות"    
    }
}

export const testInvestigations = {
    investigationsByGroupId : {
        nodes : [{
            epidemiologyNumber: 555,
            contactEventsByInvestigationId:{
                nodes : [{
                    contactedPeopleByContactEvent: {
                        nodes: [{
                            id: 666,
                            involvedContactByInvolvedContactId: {
                                involvementReason: 1
                            },
                            addressByIsolationAddress: {
                                cityByCity: {
                                    displayName: 'קריית מוטקין'
                                }
                            },
                            personByPersonInfo: {
                                id : 777,
                                firstName: 'יעקב',
                                lastName: 'יעקובי',
                                identificationNumber: '234567899',
                                identificationType: 'דרכון',
                                birthDate: '2021-02-03T08:36:03Z',
                                phoneNumber: '0544444443',
                                additionalPhoneNumber: null
                            }
                        }]
                    }
                }]
            },
            investigatedPatientByInvestigatedPatientId: {
                covidPatientByCovidPatient: {
                    fullName: 'מוטי בננה',
                    identityNumber: '207950171'
                }
            }
        }]
    }
}


