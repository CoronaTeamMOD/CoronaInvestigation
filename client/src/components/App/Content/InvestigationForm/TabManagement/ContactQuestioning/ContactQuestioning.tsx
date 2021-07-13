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
import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const SIZE_OF_CONTACTS = 4;//10;
let loaded = SIZE_OF_CONTACTS;

const ContactQuestioning: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {
    const [allContactedInteractions, setAllContactedInteractions] = useState<GroupedInteractedContact[]>([]);
    const [familyRelationships, setFamilyRelationships] = useState<FamilyRelationship[]>([]);
    const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
    const [contactsToShow, setContactsToShow] = useState<GroupedInteractedContact[]>([]);
    
    const classes = useStyles();

    const { shouldDisable } = useContactFields();
    const { isInvolvedThroughFamily } = useInvolvedContact();

   const interactedContacts = useSelector<StoreStateType,GroupedInteractedContact[]>(state=>state.interactedContacts.interactedContacts);
    


    // const methods = useForm<FormInputs>({
    //     mode: 'all',
    //     resolver: yupResolver(ContactQuestioningSchema),
    // });

    //const { getValues, trigger } = methods;

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
        setContactStatuses//,
        // getValues
    });

    const loopWithSlice = (start: number, end: number) => {
        const slicedContacts = interactedContacts.slice(start, end);
        setContactsToShow([...contactsToShow, ...slicedContacts]);
    };

    const handleShowMoreContacts = () => {
        loopWithSlice(loaded, loaded + 2);
        loaded = loaded + 2;
    };

    const listenScrollEvent = (event:React.UIEvent<HTMLDivElement>): void=> {
        const element  = event.target as HTMLElement; 
        if (element.scrollHeight - element.scrollTop >= element.clientHeight &&  element.scrollHeight - element.scrollTop < element.clientHeight + 50)
        {
            handleShowMoreContacts();
        }
    }


    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, []);

    useEffect(() => {
       
        if (interactedContacts && interactedContacts.length>0){
            setAllContactedInteractions(interactedContacts);
            //setIsLoading(false);
        }
        
        if (interactedContacts) {
            loopWithSlice(0, SIZE_OF_CONTACTS);
        }
        
    }, [interactedContacts]);


    return (
        <div className={classes.scrolledTab}  onScroll={listenScrollEvent}>

            {/* <FormProvider {...methods}> */}
                  <form
                    id={`form-${id}`}
                    onSubmit={(e: React.FormEvent) => { onSubmit(e) }} > </form> 
                    <FormTitle
                        title={`טופס תשאול מגעים (${interactedContacts.length})`}
                    />
                    <span className={classes.numOfContacts}>מוצגים {Math.min(loaded,interactedContacts.length)} מתוך {interactedContacts.length}
                        <a className={classes.loadMore} hidden={loaded > interactedContacts.length} onClick={() => handleShowMoreContacts()}> טען עוד</a>
                    </span> 

                    <Grid container className={classes.accordionContainer}>
                        {contactsToShow.map(
                            (interactedContact, index) => {
                                const isFamilyContact: boolean = isInvolvedThroughFamily(
                                    interactedContact.involvementReason
                                );
                                return (
                                    <Grid item xs={12}   key={interactedContact.id}>
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
               
            {/* </FormProvider> */}
        </div>
    );
};

interface Props {
    id: number;
    isViewMode?: boolean;
};

export default ContactQuestioning;