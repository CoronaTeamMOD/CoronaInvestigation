import City from '../Address/City';
import Street from '../Address/Street';
import IdentificationType from '../IdentificationTypes/IdentificationType';

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
        identificationType: IdentificationType;
        lastName: string;
        phoneNumber: string;
        epidemiologicStatus: {
            recoveryDate: Date | null,
            serologicImmunityStartDate: Date | null,
            serologicImmunityExpirationDate: Date | null,
            vaccineEffectivenessStartDate: Date | null,
            vaccineExpirationDate: Date | null
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
};