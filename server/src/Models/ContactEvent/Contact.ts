interface Contact {
    id?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    identificationNumber?: string;
    identificationType?: string;
    contactType: number;
    extraInfo?: string;
}

export default Contact;