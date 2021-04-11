import City from '../Address/City';
import Street from '../Address/Street';

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
        id: number;
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
        epidemiologicStatus: {
            recoveryDate: Date,
            serologicImmunityStartDate: Date,
            serologicImmunityExpirationDate: Date,
            vaccineEffectivenessStartDate: Date,
            vaccineExpirationDate: Date
        } | null;
    },
    involvementReason: number;
    isContactedPerson: boolean;
    address: {
        city: City;
        street: Street;
        houseNum: string;
        floor: string;
    },
    educationGrade: {
        educationGrade: string;
    },
    educationClassNumber: number;
    subOccupationByInstitutionName: {
        institutionName: string;
    }
}
