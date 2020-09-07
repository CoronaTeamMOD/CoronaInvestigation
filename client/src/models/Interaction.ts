import InteractionEventDialogData from "./Contexts/InteractionEventDialogData";

interface InteractionPerson {
    name: string;
    id: string;
    phoneNumber: string;
}

interface Interaction extends InteractionEventDialogData {
    id: number;
    interactionPersons: InteractionPerson[];
}

export default Interaction;