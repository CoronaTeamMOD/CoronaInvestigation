import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Divider, FormControlLabel, Grid, Typography } from '@material-ui/core';

import axios from 'Utils/axios';
import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import useContactQuestioning from './useContactQuestioning';
import { setFormState } from 'redux/Form/formActionCreators';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningCheck from './ContactQuestioningCheck';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';

const ContactQuestioning: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
    const classes = useStyles();

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(state => state.contactTypes);

    const [allContactedInteractions, setAllContactedInteractions] = React.useState<InteractedContact[]>([]);
    const [currentInteractedContact, setCurrentInteractedContact] = React.useState<InteractedContact>();
    const [familyRelationships, setFamilyRelationships] = React.useState<FamilyRelationship[]>([]);

    const { saveContactQuestioning, saveContact, updateInteractedContact, changeIdentificationType, openAccordion, updateNoResponse, loadInteractedContacts } =
        useContactQuestioning({ setAllContactedInteractions, allContactedInteractions, setCurrentInteractedContact });

    React.useEffect(() => {
        loadInteractedContacts();
        axios.get('/contactedPeople/familyRelationships').then((result: any) => {
            setFamilyRelationships(result?.data?.data?.allFamilyRelationships?.nodes);
        });
    },[]);

    const saveContacted = (e: React.ChangeEvent<{}>) => {
        e.preventDefault();
        setFormState(investigationId, id, true);
        saveContactQuestioning().then(onSubmit);
    }

    return (
        <>
            <form id={`form-${id}`} onSubmit={(e) => saveContacted(e)}>
                <Typography className={classes.title} variant='body1'><b>טופס תשאול מגעים ({allContactedInteractions.length})</b></Typography>
                {
                    allContactedInteractions.sort((firstInteractedContact, secondInteractedContact) =>
                        firstInteractedContact.lastName.localeCompare(secondInteractedContact.lastName)).map((interactedContact) => (
                            <div key={interactedContact.id} className={classes.form}>
                                <Accordion expanded={interactedContact.expand} className={classes.accordion} style={{ borderRadius: '3vw'}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        onClick={() => {
                                            openAccordion(interactedContact);
                                        }}
                                        aria-controls='panel1a-content'
                                        id='panel1a-header'
                                        dir='ltr'
                                    >
                                        <Grid item xs={2} container>
                                            <Grid item xs={9} container>
                                                <FormControlLabel
                                                    onClick={(event) => event.stopPropagation()}
                                                    onChange={((event: any, checked: boolean) => {
                                                        updateNoResponse(interactedContact, checked);
                                                    })}
                                                    control={
                                                        <Checkbox
                                                            color='primary'
                                                            checked={currentInteractedContact?.id === interactedContact.id ? currentInteractedContact?.cantReachContact : interactedContact.cantReachContact}
                                                        />
                                                    }
                                                    label='אין מענה'
                                                />
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
                                                <b>מספר טלפון:</b> {interactedContact.phoneNumber}
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
        </>
    )
};

interface Props {
    id: number;
    onSubmit: () => void;
}

export default ContactQuestioning;
