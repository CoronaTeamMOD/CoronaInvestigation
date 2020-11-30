import InvolvementReason from 'models/enums/InvolvementReason';

const useInvolvedContact = () => {
    
    const isInvolved = (involvementReason: number | null | undefined) => involvementReason;
    const isInvolvedThroughFamily = (involvementReason: number | null) => involvementReason === InvolvementReason.FAMILY;
    const isInvolvedThroughEducation = (involvementReason: number | null) => involvementReason === InvolvementReason.EDUCATION;

    return {
        isInvolved,
        isInvolvedThroughFamily,
        isInvolvedThroughEducation
    }
};

export default useInvolvedContact;