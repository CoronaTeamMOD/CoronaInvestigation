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
    familyRelationshipByFamilyRelationship: {
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
    cityByIsolationCity: {
        city: string;
    },
    educationGrade: string,
    educationClassNumber: number,
    subOccupationByInstitutionName: {
        institutionName: string;
    }
}
