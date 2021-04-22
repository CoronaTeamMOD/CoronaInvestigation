import IdentificationType from './IdentificationType';
import EpidemiologicStatus from './EpidemiologicStatus';

interface Person {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    identificationType: IdentificationType;
    identificationNumber: string;
    additionalPhoneNumber: string;
    gender: string;
    birthDate: Date;
    epidemiologicStatus? : EpidemiologicStatus | null
};

export default Person;