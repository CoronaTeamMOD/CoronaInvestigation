import PhoneNumberControl from "./PhoneNumberControl";

interface Contact {
    serialId?: string;
    firstName: string;
    lastName: string;
    phoneNumber: PhoneNumberControl;
    id?: string;
    contactType: number;
    extraInfo?: string;
}

export default Contact;