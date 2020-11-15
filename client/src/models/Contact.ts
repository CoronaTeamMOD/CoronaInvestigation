import InteractedContact from './InteractedContact';

interface Contact {
    serialId?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    idNumber?: string;
    contactType: number;
    extraInfo?: string;
    contactStatus?: InteractedContact['contactStatus'];
    creationTime: Date;
}

export default Contact;