interface InteractionContact {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    contactDate: Date;
    contactType: string;
    extraInfo?: string;
}

export default InteractionContact;
