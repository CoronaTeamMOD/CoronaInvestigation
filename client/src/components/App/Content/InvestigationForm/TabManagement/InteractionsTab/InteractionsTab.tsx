import { startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import StoreStateType from 'redux/storeStateType';
import React, { useState, useEffect } from 'react';
import SchoolIcon from '@material-ui/icons/SchoolOutlined';

import InvolvedContact from 'models/InvolvedContact';
import { setFormState } from 'redux/Form/formActionCreators';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import InteractionsTabSettings from 'models/InteractionsTabSettings';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './InteractionsTabStyles';
import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import FamilyContactsDialog from './FamilyContactsDialog/FamilyContactsDialog';
import EducationContactsDialog from './EducationContactsDialog/EducationContactsDialog';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';

const defaultInteractionsTabSettings : InteractionsTabSettings = {
    allowUncontactedFamily: false
}

const InteractionsTab: React.FC<Props> = (props: Props): JSX.Element => {

    const { id, setAreThereContacts } = props;

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const [interactionToEdit, setInteractionToEdit] = useState<InteractionEventDialogData>();
    const [newInteractionEventDate, setNewInteractionEventDate] = useState<Date>();
    const [interactionsMap, setInteractionsMap] = useState<Map<number, InteractionEventDialogData[]>>(new Map<number, InteractionEventDialogData[]>())
    const [interactions, setInteractions] = useState<InteractionEventDialogData[]>([]);
    const [datesToInvestigate, setDatesToInvestigate] = useState<Date[]>([]);
    const [interactionsTabSettings, setInteractionsTabSettings] = useState<InteractionsTabSettings>(defaultInteractionsTabSettings);
    const [educationMembers, setEducationMembers] = useState<InvolvedContact[]>([]);
    const [familyMembers, setFamilyMembers] = useState<InvolvedContact[]>([]);
    const [uncontactedFamilyMembers, setUncontactedFamilyMembers] = useState<InvolvedContact[]>([]);
    const [showEducationMembers, setShowEducationMembers] = useState<boolean>(false);

    const { isInvolved } = useInvolvedContact();
    const classes = useStyles();

    const completeTabChange = () => {
        setFormState(investigationId, id, true);
    }

    const { loadInteractions, handleDeleteContactEvent, handleDeleteContactedPerson, saveInvestigaionSettingsFamily } =
        useInteractionsTab({
            setInteractions,
            interactions,
            setAreThereContacts,
            setDatesToInvestigate,
            setEducationMembers,
            setFamilyMembers,
            setInteractionsTabSettings,
            completeTabChange
        });

    useEffect(() => {
        const mappedInteractionsArray = new Map<number, Interaction[]>();
        interactions.forEach(interaction => {
            const interactionStartTime : Date | undefined = interaction.startTime;
            
            if (interactionStartTime) {
                const interactionDate = startOfDay(interactionStartTime).getTime();
                if (mappedInteractionsArray.get(interactionDate) === undefined) {
                    mappedInteractionsArray.set(interactionDate, [interaction]);
                } else {
                    (mappedInteractionsArray.get(interactionDate) as Interaction[]).push(interaction);
                }
            }
        });

        setInteractionsMap(mappedInteractionsArray);
        setAreThereContacts(!(interactions.findIndex((interaction) => interaction.contacts.length > 0) === -1));
    }, [interactions]);

    const submitTab = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const uncontactedFamilyMembersArray : InvolvedContact[] = familyMembers.filter(member => !member.isContactedPerson);
        const areThereUncontactedMembers = uncontactedFamilyMembersArray.length > 0;
        if (!interactionsTabSettings.allowUncontactedFamily && areThereUncontactedMembers) {
            setUncontactedFamilyMembers(uncontactedFamilyMembersArray);
        } else {
            completeTabChange();
        }
    }

    const closeFamilyDialog = () => setUncontactedFamilyMembers([]);

    const filteredInteractionUnInvolved = (interaction: Interaction) => ({
        ...interaction,
        contacts: interaction.contacts.filter(contact => !isInvolved(contact.involvedContact?.involvementReason))
    });

    const generateContactCard = (interactionDate: Date) => {
        return (
            <ContactDateCard
                allInteractions={interactions}
                loadInteractions={loadInteractions}
                contactDate={interactionDate}
                onEditClick={(interaction: InteractionEventDialogData) => setInteractionToEdit(filteredInteractionUnInvolved(interaction))}
                onDeleteClick={handleDeleteContactEvent}
                onDeleteContactClick={handleDeleteContactedPerson}
                createNewInteractionEvent={() => setNewInteractionEventDate(interactionDate)}
                interactions={interactionsMap.get(interactionDate.getTime())}
                key={interactionDate.getTime()}
            />
        )
    }

    const closeDialog = () => setShowEducationMembers(false);
    
    return (
        <>
            {
                educationMembers.length > 0 &&    
                <div className={classes.eudcationContactsTrigger}>
                    <SchoolIcon/>
                    <Typography 
                        variant='body1' 
                        onClick={() => setShowEducationMembers(true)}>
                            לחקירה זו יש מגעי חינוך, לצפיה לחצו כאן
                    </Typography>
                </div>
            }
            <form id={`form-${id}`} onSubmit={(e) => submitTab(e)}/>
            {
                datesToInvestigate[0] < datesToInvestigate[datesToInvestigate.length -1] ?
                    datesToInvestigate.reverse().map(date => generateContactCard(date)) :
                    datesToInvestigate.map(date => generateContactCard(date))
            }
            {
                newInteractionEventDate && <NewInteractionEventDialog
                    isOpen={Boolean(newInteractionEventDate)}
                    interactionDate={newInteractionEventDate}
                    closeNewDialog={() => setNewInteractionEventDate(undefined)}
                    loadInteractions={loadInteractions}
                    interactions={interactions}
                />
            }
            {
                interactionToEdit && <EditInteractionEventDialog
                    isOpen={Boolean(interactionToEdit)}
                    eventToEdit={interactionToEdit}
                    closeEditDialog={() => setInteractionToEdit(undefined)}
                    loadInteractions={loadInteractions}
                    interactions={interactions}
                />
            }
            <FamilyContactsDialog 
                uncontactedFamilyMembers={uncontactedFamilyMembers}
                isOpen={uncontactedFamilyMembers.length > 0} 
                closeDialog={closeFamilyDialog}
                confirmDialog={saveInvestigaionSettingsFamily}/>
            <EducationContactsDialog 
                isOpen={showEducationMembers} 
                educationContacts={educationMembers}
                closeDialog={() => closeDialog()}/>
        </>
    )
};

interface Props {
    id: number;
    setAreThereContacts: React.Dispatch<React.SetStateAction<boolean>>;
}

export default InteractionsTab;
