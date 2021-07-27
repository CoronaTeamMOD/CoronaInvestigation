import { Button, Grid } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

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
import {contactQuestioningService} from 'services/contactQuestioning.service';


const SIZE_OF_CONTACTS = 4;
let loaded = SIZE_OF_CONTACTS;

const ContactQuestioning: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {
    const [allContactedInteractions, setAllContactedInteractions] = useState<GroupedInteractedContact[]>([]);
    const [familyRelationships, setFamilyRelationships] = useState<FamilyRelationship[]>([]);
    const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
    const [contactsToShow, setContactsToShow] = useState<GroupedInteractedContact[]>([]);

    const classes = useStyles();

    const { shouldDisable } = useContactFields();
    const { isInvolvedThroughFamily } = useInvolvedContact();

    const interactedContacts = useSelector<StoreStateType, GroupedInteractedContact[]>(state => state.interactedContacts.interactedContacts);

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
        setContactStatuses
    });

    const loopWithSlice = (start: number, end: number) => {
        const slicedContacts = interactedContacts.slice(start, end);
        setContactsToShow([...contactsToShow, ...slicedContacts]);
    };

    const handleShowMoreContacts = () => {
        loopWithSlice(loaded, loaded + 2);
        loaded = loaded + 2;
    };

    const listenScrollEvent = (event: React.UIEvent<HTMLDivElement>): void => {
        const element = event.target as HTMLElement;
        if (element.scrollHeight - element.scrollTop >= element.clientHeight && element.scrollHeight - element.scrollTop < element.clientHeight + 50) {
            handleShowMoreContacts();
        }
    }

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
        contactQuestioningService.resetIdentityValidation();
    }, []);

    useEffect(() => {
        if (interactedContacts && interactedContacts.length > 0) {
            setAllContactedInteractions(interactedContacts);
            if (interactedContacts.length > SIZE_OF_CONTACTS) {
                loaded = SIZE_OF_CONTACTS;
                setContactsToShow(interactedContacts.slice(0, SIZE_OF_CONTACTS));
            }
            else {
                loaded = interactedContacts.length;
                setContactsToShow(interactedContacts);
            }
        }
    }, [interactedContacts]);


    return (
        <div className={classes.scrolledTab} onScroll={listenScrollEvent}>

            <form
                id={`form-${id}`}
                onSubmit={(e: React.FormEvent) => { onSubmit(e) }} > </form>
            <FormTitle
                title={`טופס תשאול מגעים (${interactedContacts.length})`}
            />
            <span className={classes.numOfContacts}>מוצגים {Math.min(loaded, interactedContacts.length)} מתוך {interactedContacts.length}
            </span>

            <Grid container className={classes.accordionContainer}>
                {contactsToShow.map(
                    (interactedContact, index) => {
                        const isFamilyContact: boolean = isInvolvedThroughFamily(
                            interactedContact.involvementReason
                        );
                        return (
                            <Grid item xs={12} key={interactedContact.id}>
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
            </Grid>

        </div>
    );
};

interface Props {
    id: number;
    isViewMode?: boolean;
};

export default ContactQuestioning;