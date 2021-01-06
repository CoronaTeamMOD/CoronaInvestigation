import { Grid } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ContactStatus from 'models/ContactStatus';
import FormTitle from 'commons/FormTitle/FormTitle';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactFields from 'Utils/Contacts/useContactFields';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';

import useStyles from './ContactQuestioningStyles';
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
    const classes = useStyles();
    const { shouldDisable } = useContactFields();
    const { isInvolvedThroughFamily } = useInvolvedContact();

    const methods = useForm<FormInputs>({
        mode: 'all',
        resolver: yupResolver(ContactQuestioningSchema),
    });

    const { getValues , trigger } = methods;
    
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
        getValues,
    });

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, []);

    useEffect(() => {
        if(allContactedInteractions){
            trigger();
        }
    } , [allContactedInteractions]);

    return (
        <>
            <FormProvider {...methods}>
                <form
                    id={`form-${id}`}
                    onSubmit={(e : React.FormEvent) => {onSubmit(e)}}
                >
                    <FormTitle
                        title={`טופס תשאול מגעים (${allContactedInteractions.length})`}
                    />
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
                                        />
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                </form>
            </FormProvider>
        </>
    );
};

interface Props {
    id: number;
}

export default ContactQuestioning;
