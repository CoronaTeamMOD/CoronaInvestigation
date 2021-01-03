export interface GetInvolvedContactsResponse {
    data: {
        allInvolvedContacts: {
            nodes: InvolvedContactDB[];
        }
    },
    errors?: {
        message: string;
    }[]
}

export interface InvolvedContactDB {
    id: number;
    familyRelationship: {
        id: number,
        displayName: string;
    },
    personByPersonId: {
        birthDate: Date;
        additionalPhoneNumber: string;
        firstName: string;
        identificationNumber: string;
        identificationType: string;
        lastName: string;
        phoneNumber: string;
    },
    involvementReason: number;
    isContactedPerson: boolean;
    address: {
        city: {
            id: string
            displayName: string
        },
        street: {
            id: string
            displayName: string
        },
        houseNum: string
        floor: string
    },
    educationGrade: {
        educationGrade: string
    },
    educationClassNumber: number,
    subOccupationByInstitutionName: {
        institutionName: string;
    }
}
