import IdentificationType from 'models/IdentificationType';

type ContactedPerson = {
    id : number;
    firstName : string;
    lastName : string;
    identificationNumber: string;
    identificationType: IdentificationType;
    birthDate: string;
    phoneNumber: string | null;
    additionalPhoneNumber: string | null;
    personInfo: number;
    addressByIsolationAddress: {
        cityByCity: {
            displayName: string;
        }
    },
}

export default ContactedPerson;