import PhoneNumberControl from './PhoneNumberControl';
import IdentificationTypes from './enums/IdentificationTypes';

interface InteractedContact {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    contactDate: Date;
    contactType: boolean;
    extraInfo: string;
    identificationType: IdentificationTypes;
    identificationNumber: string;
    birthDate?: Date;
    cantReachContact: boolean;
    additionalPhoneNumber: PhoneNumberControl;
    relationship: string;
}

export default InteractedContact;
