import InvolvedContact from './InvolvedContact';
import InteractedContact from './InteractedContact';

interface Contact {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    identificationNumber?: string;
    identificationType: string;
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
