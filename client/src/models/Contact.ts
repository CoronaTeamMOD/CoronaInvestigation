interface Contact {
    serialId?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    id?: string;
    contactType: number;
    extraInfo?: string;
}

export default Contact;