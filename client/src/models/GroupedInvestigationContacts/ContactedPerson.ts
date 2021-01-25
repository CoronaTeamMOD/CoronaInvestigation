type ContactedPerson = {
    id : number;
    firstName : string;
    lastName : string;
    identificationNumber: string;
    identificationType: string;
    birthDate: string;
    phoneNumber: string | null;
    additionalPhoneNumber: string | null;
}

export default ContactedPerson;