import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ExpandMore } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, TextField, Typography } from '@material-ui/core';

import logger from 'logger/logger';
import ContactType from 'models/ContactType';
import ContactStatus from 'models/ContactStatus';
import { Severity, Service } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import FormTitle from 'commons/FormTitle/FormTitle';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactQuestioning from './useContactQuestioning';
import { setFormState } from 'redux/Form/formActionCreators';
import InteractedContactFields from 'models/enums/InteractedContact';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningCheck from './ContactQuestioningCheck';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';

const ContactQuestioning: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
    const classes = useStyles();

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    const [allContactedInteractions, setAllContactedInteractions] = React.useState<InteractedContact[]>([]);
    const [currentInteractedContact, setCurrentInteractedContact] = React.useState<InteractedContact>();
    const [familyRelationships, setFamilyRelationships] = React.useState<FamilyRelationship[]>([]);
    const [contactStatuses, setContactStatuses] = React.useState<ContactStatus[]>([]);
    const [contactStatusInput, setContactStatusInput] = React.useState<string>();

    const methods = useForm();

    const {
        saveContactQuestioning, saveContact, updateInteractedContact, changeIdentificationType, loadInteractedContacts,
        loadFamilyRelationships, loadContactStatuses,
    } = useContactQuestioning({ setAllContactedInteractions, allContactedInteractions, setCurrentInteractedContact, setFamilyRelationships, contactStatuses, setContactStatuses });

    useEffect(() => {
        loadInteractedContacts();
        loadFamilyRelationships();
        loadContactStatuses();
    }, []);

    const saveContacted = (e: React.ChangeEvent<{}>) => {
        e.preventDefault();
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
            onSubmit();
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Saving all contacts',
                step: `got the following error from the server: ${err}`,
                user: userId,
                investigation: investigationId
            });
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
                                    <Accordion expanded={interactedContact.expand} className={classes.accordion} style={{ borderRadius: '3vw'}}>
                                        <AccordionSummary
                                            test-id='contactLocation'
                                            expandIcon={<ExpandMore />}
                                            onClick={() => {
                                                updateInteractedContact(interactedContact, InteractedContactFields.EXPAND, !interactedContact.expand);
                                            }}
                                            aria-controls='panel1a-content'
                                            id='panel1a-header'
                                            dir='ltr'
                                        >
                                            <Grid item xs={2} container>
                                                <Grid item xs={6} container>
                                                    <Autocomplete
                                                        options={contactStatuses}
                                                        getOptionLabel={(option) => option.displayName}
                                                        inputValue={contactStatusInput}
                                                        value={interactedContact.contactStatus}
                                                        onChange={(event, selectedStatus) => {
                                                            updateInteractedContact(interactedContact, InteractedContactFields.CONTACT_STATUS, selectedStatus);
                                                        }}
                                                        onInputChange={(event, newContactStatus) => {
                                                            setContactStatusInput(newContactStatus);
                                                        }}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                {...params}
                                                                placeholder='סטטוס'
                                                                onClick={(event) => event.stopPropagation()}
                                                            />
                                                        }
                                                    />
                                                </Grid>
                                                <Grid container item xs={2}>
                                                    <span onClick={(event) => event.stopPropagation()}>
                                                        <PhoneDial
                                                            phoneNumber={interactedContact.phoneNumber}
                                                        />
                                                    </span>
                                                </Grid>
                                                <Divider variant='fullWidth' orientation='vertical' flexItem />
                                            </Grid>
                                            <Grid container item xs={10} direction='row-reverse' alignItems='center' justify='space-between'>
                                                <Typography variant='body2'>
                                                    <b>שם פרטי:</b> {interactedContact.firstName}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    <b>שם משפחה:</b> {interactedContact.lastName}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    <b>מספר טלפון:</b> {interactedContact.phoneNumber ? interactedContact.phoneNumber : 'אין מספר'}
                                                </Typography>
                                                <Typography variant='body2'>
                                                    <b>תאריך המגע:</b> {format(new Date(interactedContact.contactDate), 'dd/MM/yyyy')}
                                                </Typography>
                                                {
                                                    interactedContact.contactType &&
                                                    <Typography variant='body2'>
                                                        <b>סוג מגע:</b> {contactTypes.get(+interactedContact.contactType)?.displayName}
                                                    </Typography>
                                                }
                                                {
                                                    interactedContact.extraInfo &&
                                                    <Typography variant='body2'>
                                                        <b>פירוט אופי המגע:</b> {interactedContact.extraInfo}
                                                    </Typography>
                                                }
                                            </Grid>
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
    onSubmit: () => void;
}

export default ContactQuestioning;
