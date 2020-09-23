import { useInteractionsQuestioningIncome } from './useInteractionsQuestioningInterfaces';

const useInteractionsQuestioning = (parameters: useInteractionsQuestioningIncome) => {

    const { interactionContacts, interactions } = parameters;

    let contactInteractionId = 0;

    interactions.map((interaction) => ((interaction?.contacts?.length > 0) &&
        interaction?.contacts.forEach(contact => {
            interactionContacts.push(
                {
                    id: contactInteractionId,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phoneNumber: contact.phoneNumber.number,
                    contactDate: interaction.startTime,
                    contactType: contact.contactType,
                    extraInfo: contact.extraInfo
                }
            )
            contactInteractionId++;
        })
    ))

    interactionContacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
};

export default useInteractionsQuestioning;
