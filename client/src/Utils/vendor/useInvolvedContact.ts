import Contact from 'models/Contact';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import InvolvementReason from 'models/enums/InvolvementReason';


const useInvolvedContact = () => {
    const { shouldDisableContact } = useStatusUtils();
    
    const isInvolved = (involvementReason: number | null | undefined) => involvementReason;
    const isInvolvedThroughFamily = (involvementReason: number | null) => involvementReason === InvolvementReason.FAMILY;
    const isInvolvedThroughEducation = (involvementReason: number | null) => involvementReason === InvolvementReason.EDUCATION;
    const shouldDisableDeleteContact = (isContactComplete: boolean, contact: Contact) => isContactComplete || shouldDisableContact(contact.creationTime) || (contact.involvedContactId && contact.involvedContactId !== null) as boolean;

    return {
        isInvolved,
        isInvolvedThroughFamily,
        isInvolvedThroughEducation,
        shouldDisableDeleteContact,
    }
};

export default useInvolvedContact;
