interface InteractedContact {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    contactDate: Date;
    contactType: string;
    extraInfo: string;
    doesNeedIsolation: boolean;
}

export default InteractedContact;
