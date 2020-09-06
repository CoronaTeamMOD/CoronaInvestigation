interface InteractionPerson {
    name: string;
    id: string;
    phoneNumber: string;
}

interface Interaction {
    placeType: string;
    placeName: string;
    placeAddress: string;
    placeNumber: string;
    interactionStartTime: Date;
    interactionEndTime: Date;
    interactionPersons: InteractionPerson[];
}

export default Interaction;