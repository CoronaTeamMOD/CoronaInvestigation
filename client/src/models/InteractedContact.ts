import PhoneNumberControl from './PhoneNumberControl';

interface InteractedContact {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    contactDate: Date;
    contactType: boolean;
    extraInfo: string;
    identificationType: string;
    identificationNumber: string;
    birthDate?: Date;
    cantReachContact: boolean;
    additionalPhoneNumber?: PhoneNumberControl;
}

export default InteractedContact;
