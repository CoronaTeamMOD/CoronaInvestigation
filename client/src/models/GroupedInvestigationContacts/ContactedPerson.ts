type ContactedPerson = {
    id : number;
    firstName : string;
    lastName : string;
    identificationNumber: string;
    identificationType: string;
    birthDate: string;
    phoneNumber: string | null;
    additionalPhoneNumber: string | null;
    personInfo: number;
    addressByIsolationAddress: {
        cityByCity: {
            displayName: string;
        }
    },
}

export default ContactedPerson;