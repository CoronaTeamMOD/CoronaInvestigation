import Contact from 'models/Contact';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import InvolvementReason from 'models/enums/InvolvementReason';

const useInvolvedContact = () => {
    const { shouldDisableContact } = useStatusUtils();
    
    const isInvolved = (involvementReason: number | null | undefined) => involvementReason;
    const isInvolvedThroughFamily = (involvementReason: number | null) => involvementReason === InvolvementReason.FAMILY;
    const shouldDisableDeleteContact = (isContactComplete: boolean, contact: Contact) => isContactComplete || (contact.creationTime && shouldDisableContact(contact.creationTime)) as boolean;

    return {
        isInvolved,
        isInvolvedThroughFamily,
        shouldDisableDeleteContact,
    }
};

export default useInvolvedContact;
