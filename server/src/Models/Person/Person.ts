import IdentificationType from '../IdentificationTypes/IdentificationType';
interface Person {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    identificationTypeByIdentityType: IdentificationType;
    identificationNumber: string;
    additionalPhoneNumber: string;
    gender: string;
    birthDate: Date;
};

export default Person;
