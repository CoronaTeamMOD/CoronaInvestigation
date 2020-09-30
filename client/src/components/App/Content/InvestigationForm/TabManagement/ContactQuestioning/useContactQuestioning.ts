import axios from 'Utils/axios';
import InteractedContact from 'models/InteractedContact';

import { useContactQuestioningOutcome, useContactQuestioningParameters } from './ContactQuestioningInterfaces';

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const { setFamilyRelationships } = parameters;

    const getAllRelationships = () => {
        axios.post('/contactedPeople/familyRelationships', {}).then((result: any) => {
            setFamilyRelationships(result?.data?.data?.allFamilyRelationships?.nodes);
        });
    };

    const saveContact = (interactedContact: InteractedContact) => {
        const contacts = [interactedContact];
        axios.post('/contactedPeople/saveAllContacts',
        {
            unSavedContacts: { contacts }
        });
    };

    return {
        getAllRelationships,
        saveContact,
    };
};

export default useContactQuestioning;
