import { Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import ContactStatus from 'models/ContactStatus';
import FormTitle from 'commons/FormTitle/FormTitle';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactFields from 'Utils/Contacts/useContactFields';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

import useStyles from './ContactQuestioningStyles';
import useContactQuestioning from './useContactQuestioning';
import InteractedContactAccordion from './InteractedContactAccordion';
import { contactQuestioningService } from 'services/contactQuestioning.service';
import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';
import { resetInteractedContacts, setContactFormState, setInteractedContact } from 'redux/InteractedContacts/interactedContactsActionCreators';
import InteractedContactFields from 'models/enums/InteractedContact';
import ContactStatusCodes from 'models/enums/ContactStatusCodes';

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

    const dispatch = useDispatch();
    const interactedContacts = useSelector<StoreStateType, GroupedInteractedContact[]>(state => state.interactedContacts.interactedContacts);
    const ifContactsNeedIsolation = useSelector<StoreStateType, boolean | undefined>(state => state.rulesConfig.ifContactsNeedIsolation);
    const {
        onSubmit,
        parsePerson,
        saveContact,
        loadInteractedContacts,
        loadFamilyRelationships,
        loadContactStatuses,
        getRuleConfigIfContactsNeedIsolation,
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

    const initFormState = () => {
        interactedContacts.forEach((interactedContact: GroupedInteractedContact) => {
           if ( ifContactsNeedIsolation == false && interactedContact.contactStatus !== ContactStatusCodes.COMPLETED){
                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_NEED_HELP_IN_ISOLATION, false));
                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_NEED_ISOLATION, false));
            }
            ContactQuestioningSchema.isValid({ ...interactedContact, identificationType: interactedContact.identificationType?.id || interactedContact.identificationType }).then(isValid => {
                dispatch(setContactFormState(interactedContact.id, isValid));
            })
        });
    }

    useEffect(() => {
        if (interactedContacts && interactedContacts.length > 0) {
            initFormState();
        }
    }, [interactedContacts?.length]);

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
        getRuleConfigIfContactsNeedIsolation();
        contactQuestioningService.resetIdentityValidation();
        setContactsToShow([]);
        return () => { dispatch(resetInteractedContacts()) };
    }, []);

    useEffect(() => {
        if (interactedContacts && interactedContacts.length > 0 && contactsToShow.length == 0) {
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
                                    ifContactNeedIsolation={ifContactsNeedIsolation}
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