interface Contact {
    serialId?: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    idNumber?: string;
    contactType: number;
    extraInfo?: string;
}

export default Contact;