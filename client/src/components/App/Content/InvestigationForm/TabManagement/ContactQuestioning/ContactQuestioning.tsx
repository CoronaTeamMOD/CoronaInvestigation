import { Button, Grid } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ContactStatus from 'models/ContactStatus';
import FormTitle from 'commons/FormTitle/FormTitle';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactFields from 'Utils/Contacts/useContactFields';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

import useStyles from './ContactQuestioningStyles';
import { FormInputs } from './ContactQuestioningInterfaces';
import useContactQuestioning from './useContactQuestioning';
import InteractedContactAccordion from './InteractedContactAccordion';
import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';

const SIZE_OF_CONTACTS = 10;
let loaded = SIZE_OF_CONTACTS;

const ContactQuestioning: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {
    const [allContactedInteractions, setAllContactedInteractions] = useState<GroupedInteractedContact[]>([]);
    const [familyRelationships, setFamilyRelationships] = useState<FamilyRelationship[]>([]);
    const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
    const [contactsToShow, setContactsToShow] = useState<GroupedInteractedContact[]>([]);
    
    const classes = useStyles();

    const { shouldDisable } = useContactFields();
    const { isInvolvedThroughFamily } = useInvolvedContact();

    const methods = useForm<FormInputs>({
        mode: 'all',
        resolver: yupResolver(ContactQuestioningSchema),
    });

    const { getValues, trigger } = methods;

    const {
        onSubmit,
        parsePerson,
        saveContact,
        loadInteractedContacts,
        loadFamilyRelationships,
        loadContactStatuses,
        getRulerApiDataFromServer
    } = useContactQuestioning({
        id,
        setAllContactedInteractions,
        allContactedInteractions,
        setFamilyRelationships,
        setContactStatuses,
        getValues
    });

    const loopWithSlice = (start: number, end: number) => {
        const slicedContacts = allContactedInteractions.slice(start, end);
        setContactsToShow([...contactsToShow, ...slicedContacts]);
    };

    const handleShowMoreContacts = () => {
        loopWithSlice(loaded, loaded + SIZE_OF_CONTACTS);
        loaded = loaded + SIZE_OF_CONTACTS;
    };

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, []);

    useEffect(() => {
        if (allContactedInteractions) {
            trigger();
            loopWithSlice(0, SIZE_OF_CONTACTS);
        }
    }, [allContactedInteractions]);

    return (
        <>
            <FormProvider {...methods}>
                <form
                    id={`form-${id}`}
                    onSubmit={(e: React.FormEvent) => { onSubmit(e) }}
                >
                    <FormTitle
                        title={`טופס תשאול מגעים (${allContactedInteractions.length})`}
                    />

                    <Grid container className={classes.accordionContainer}>
                        {contactsToShow.map(
                            (interactedContact, index) => {
                                const isFamilyContact: boolean = isInvolvedThroughFamily(
                                    interactedContact.involvementReason
                                );
                                return (
                                    <Grid item xs={12}>
                                        <InteractedContactAccordion
                                            interactedContact={interactedContact}
                                            index={index}
                                            contactStatuses={contactStatuses}
                                            saveContact={saveContact}
                                            parsePerson={parsePerson}
                                            isFamilyContact={isFamilyContact}
                                            familyRelationships={familyRelationships}
                                            shouldDisable={shouldDisable}
                                            isViewMode={isViewMode}
                                        />
                                    </Grid>
                                );
                            } 
                        )}
                        <a className={classes.loadMore} hidden={loaded > allContactedInteractions.length} onClick={() => handleShowMoreContacts()}> טען עוד</a>
                    </Grid>
                </form>
            </FormProvider>
        </>
    );
};

interface Props {
    id: number;
    isViewMode?: boolean;
};

export default ContactQuestioning;