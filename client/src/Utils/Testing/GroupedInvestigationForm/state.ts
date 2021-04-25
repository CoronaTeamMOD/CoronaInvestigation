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

/*  
 *  This test describes a single related contact that is a family member.
 */
export const testPersonalDetails = {
    id : 777,
    personInfo: 888,
    firstName: 'יעקב',
    lastName: 'יעקובי',
    identificationNumber: '234567899',
    identificationType: 'דרכון',
    birthDate: '2021-02-03T08:36:03Z',
    phoneNumber: '0544444443',
    additionalPhoneNumber: null,
    addressByIsolationAddress: {
        cityByCity: {
            displayName: 'קריית מוטקין'
        }
    },
}

export const testEventNode = {
    id: 666,
    involvedContactByInvolvedContactId: {
        involvementReason: 1
    },
    personByPersonInfo: testPersonalDetails
}

export const testEvent = {
    contactedPeopleByContactEvent: {
        nodes: [testEventNode]
    }
}

export const testEvents = [testEvent]

export const testInvestigation = {
    epidemiologyNumber: 555,
    contactEventsByInvestigationId:{
        nodes : testEvents
    },
    investigatedPatientByInvestigatedPatientId: {
        covidPatientByCovidPatient: {
            fullName: 'מוטי בננה',
            identityNumber: '207950171'
        }
    }
}

export const testInvestigationsNodes = [testInvestigation]

export const testInvestigations = {
    investigationsByGroupId : {
        nodes : testInvestigationsNodes
    }
}
