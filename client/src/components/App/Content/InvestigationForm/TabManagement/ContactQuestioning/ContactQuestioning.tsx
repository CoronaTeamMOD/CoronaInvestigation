import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, useForm } from 'react-hook-form';

import ContactStatus from 'models/ContactStatus';
import FormTitle from 'commons/FormTitle/FormTitle';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactFields from 'Utils/Contacts/useContactFields';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';

import { FormInputs } from './ContactQuestioningInterfaces';
import useContactQuestioning from './useContactQuestioning';
import InteractedContactAccordion from './InteractedContactAccordion';
import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';

const ContactQuestioning: React.FC<Props> = ({ id }: Props): JSX.Element => {
    const [allContactedInteractions, setAllContactedInteractions] = useState<
        InteractedContact[]
    >([]);
    const [familyRelationships, setFamilyRelationships] = useState<
        FamilyRelationship[]
    >([]);
    const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);

    const { shouldDisable } = useContactFields();
    const { isInvolvedThroughFamily } = useInvolvedContact();

    const methods = useForm<FormInputs>({
        mode: 'all',
        resolver: yupResolver(ContactQuestioningSchema),
    });

    const {
        onSubmit,
        parsePerson,
        saveContact,
        loadInteractedContacts,
        loadFamilyRelationships,
        loadContactStatuses,
    } = useContactQuestioning({
        id,
        setAllContactedInteractions,
        allContactedInteractions,
        setFamilyRelationships,
        setContactStatuses,
    });

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, []);

    return (
        <>
            <FormProvider {...methods}>
                <form
                    id={`form-${id}`}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <FormTitle
                        title={`טופס תשאול מגעים (${allContactedInteractions.length})`}
                    />
                    {allContactedInteractions.map(
                        (interactedContact, index) => {
                            const isFamilyContact: boolean = isInvolvedThroughFamily(
                                interactedContact.involvementReason
                            );
                            return (
                                <InteractedContactAccordion
                                    interactedContact={interactedContact}
                                    index={index}
                                    contactStatuses={contactStatuses}
                                    saveContact={saveContact}
                                    parsePerson={parsePerson}
                                    isFamilyContact={isFamilyContact}
                                    familyRelationships={familyRelationships}
                                    shouldDisable={shouldDisable}
                                />
                            );
                        }
                    )}
                </form>
            </FormProvider>
        </>
    );
};

interface Props {
    id: number;
}

export default ContactQuestioning;
