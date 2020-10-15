interface Contact {
    serialId?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    id?: string;
    familyRelationship?: string;
    relationship?: string;
    contactType: number;
    extraInfo?: string;
}

export default Contact;