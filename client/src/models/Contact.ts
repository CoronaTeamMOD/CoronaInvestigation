import InvolvedContact from './InvolvedContact';
import InteractedContact from './InteractedContact';
import IdentificationType from './IdentificationType';

interface Contact {
    id?: number;
    personInfo?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    identificationNumber?: string;
    identificationType: IdentificationType;
    contactType: number;
    extraInfo?: string;
    contactStatus?: InteractedContact['contactStatus'];
    creationTime?: Date;
    startTime?: Date;
    involvedContactId?: number;
    involvedContact?: InvolvedContact | null;
    familyRelationship?: number;
};

export default Contact;
