import { useSelector } from 'react-redux';
import { ExpandMore } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid } from '@material-ui/core';

import logger from 'logger/logger';
import ContactStatus from 'models/ContactStatus';
import { Severity, Service } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import FormTitle from 'commons/FormTitle/FormTitle';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactQuestioning from './useContactQuestioning';
import { setFormState } from 'redux/Form/formActionCreators';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import useContactFields from 'Utils/vendor/useContactFields';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningInfo from './ContactQuestioningInfo';
import ContactQuestioningCheck from './ContactQuestioningCheck';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';

export const duplicateIdsErrorMsg = 'found duplicate identification numbers';

const ContactQuestioning: React.FC<Props> = ({ id }: Props): JSX.Element => {
    const classes = useStyles();
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const [allContactedInteractions, setAllContactedInteractions] = useState<InteractedContact[]>([]);
    const [familyRelationships, setFamilyRelationships] = useState<FamilyRelationship[]>([]);
    const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);

    const { shouldDisable } = useContactFields();

    const methods = useForm();

    const {
        saveContactQuestioning, saveContact, updateInteractedContact, changeIdentificationType, loadInteractedContacts,
        loadFamilyRelationships, loadContactStatuses, handleDuplicateIdsError
    } = useContactQuestioning({ setAllContactedInteractions, allContactedInteractions, setFamilyRelationships, setContactStatuses });

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, []);

    const saveContacted = (event: React.ChangeEvent<{}>) => {
        event.preventDefault();
        setFormState(investigationId, id, true);
        saveContactQuestioning().then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Saving all contacts',
                step: 'got respond from the server',
                user: userId,
                investigation: investigationId
            });
        }).catch(err => {
            if(err.response.data === duplicateIdsErrorMsg) {
                handleDuplicateIdsError();
            } else {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Saving all contacts',
                    step: `got the following error from the server: ${err}`,
                    user: userId,
                    investigation: investigationId
                });
            }
        });
    }

    return (
        <>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(e) => saveContacted(e)}>
                    <FormTitle title={`טופס תשאול מגעים (${allContactedInteractions.length})`} />
                    {
                        allContactedInteractions.sort((firstInteractedContact, secondInteractedContact) =>
                        firstInteractedContact.phoneNumber ? firstInteractedContact.phoneNumber.localeCompare(secondInteractedContact.phoneNumber) : 0).map((interactedContact) => (
                                <div key={interactedContact.id} className={classes.form}>
                                    <Accordion className={classes.accordion} style={{ borderRadius: '3vw'}}>
                                        <AccordionSummary
                                            test-id='contactLocation'
                                            expandIcon={<ExpandMore />}
                                            aria-controls='panel1a-content'
                                            id='panel1a-header'
                                            dir='ltr'
                                        >
                                            <ContactQuestioningInfo
                                                interactedContact={interactedContact}
                                                updateInteractedContact={updateInteractedContact}
                                                contactStatuses={contactStatuses}
                                            />
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container justify='space-evenly'>
                                                <ContactQuestioningPersonal
                                                    interactedContact={interactedContact}
                                                    changeIdentificationType={changeIdentificationType}
                                                    updateInteractedContact={updateInteractedContact}
                                                />
                                                <Divider orientation='vertical' variant='middle' light={true}/>
                                                <ContactQuestioningClinical
                                                    familyRelationships={familyRelationships as FamilyRelationship[]}
                                                    interactedContact={interactedContact}
                                                    updateInteractedContact={updateInteractedContact}
                                                />
                                                <Divider orientation='vertical' variant='middle' light={true}/>
                                                <ContactQuestioningCheck
                                                    interactedContact={interactedContact}
                                                    updateInteractedContact={updateInteractedContact}
                                                />
                                            </Grid>
                                        </AccordionDetails>
                                        <PrimaryButton
                                            disabled={shouldDisable(interactedContact.contactStatus)}
                                            test-id='saveContact'
                                            style={{ marginRight: '1.5vw' }}
                                            onClick={() => {
                                                saveContact(interactedContact);
                                            }}
                                        >
                                            שמור מגע
                                        </PrimaryButton>
                                    </Accordion>
                                </div>
                        ))
                    }
                </form>
            </FormProvider>
        </>
    )
};

interface Props {
    id: number;
}

export default ContactQuestioning;
