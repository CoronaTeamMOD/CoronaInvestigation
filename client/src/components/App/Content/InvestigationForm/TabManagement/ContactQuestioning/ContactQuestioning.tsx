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

import {SIZE_OF_CONTACTS} from './useContactQuestioning';

const ContactQuestioning: React.FC<Props> = ({ id, isViewMode }: Props): JSX.Element => {
    const [allContactedInteractions, setAllContactedInteractions] = useState<GroupedInteractedContact[]>([]);
    const [familyRelationships, setFamilyRelationships] = useState<FamilyRelationship[]>([]);
    const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isMore, setIsMore] = useState<boolean>(true);
    const [contactsLength, setContactsLength] = useState<number>(0);

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
        getRulerApiData,
        getRulerApiDataFromServer
    } = useContactQuestioning({
        id,
        setAllContactedInteractions,
        allContactedInteractions,
        setFamilyRelationships,
        setContactStatuses,
        getValues,
        currentPage,
        setIsMore,
        contactsLength, 
        setContactsLength
    });

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, [currentPage]);

    useEffect(() => {
        if (allContactedInteractions) {
            trigger();
        }
    }, [allContactedInteractions]);

    const params: any =
    {
        "RulerCheckColorRequest": {
            "MOHHeader": {
                "ActivationID": "1",
                "CustID": "23",
                "AppID": "130",
                "SiteID": "2",
                "InterfaceID": "Ruler"
            },
            "Ids": [{
                "IdType": 3,
                "IDnum": "??2563621",
                "DOB": "24011971",
                "Tel": "0542987778"
            },
            {
                "IdType": 2,
                "IDnum": ".T0901828",
                "DOB": "24011971",
                "Tel": "0542987778"
            },
            {
                "IdType": 2,
                "IDnum": "?0901788",
                "DOB": "24011971",
                "Tel": "0542987778"
            }
            ]
        }
    }
    const parameters: JSON = params;

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
                    <span className={classes.numOfContacts}>מוצגים {Math.min(SIZE_OF_CONTACTS*currentPage,contactsLength)} מתוך {contactsLength} מגעים 
                        <a className={classes.loadMore} hidden={!isMore} onClick={() => setCurrentPage(currentPage+1)}> טען עוד</a>
                    </span>

                    <Grid container className={classes.accordionContainer}>
                        {allContactedInteractions.map(
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
                        <div onClick={() => { getRulerApiData(parameters) }}>לחץ להדפסת נתוני הרמזור - קליינט</div>
                        <div onClick={() => { getRulerApiDataFromServer() }}>לחץ להדפסת נתוני הרמזור - סרבר</div>
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