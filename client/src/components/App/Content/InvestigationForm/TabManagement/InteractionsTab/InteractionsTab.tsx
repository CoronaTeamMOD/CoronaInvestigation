import { startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import StoreStateType from 'redux/storeStateType';
import SchoolIcon from '@material-ui/icons/SchoolOutlined';
import React, { useState, useContext, useMemo } from 'react';

import InvolvedContact from 'models/InvolvedContact';
import { setFormState } from 'redux/Form/formActionCreators';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import InteractionsTabSettings from 'models/InteractionsTabSettings';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import { familyMembersContext } from 'commons/Contexts/FamilyMembersContext';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useStyles from './InteractionsTabStyles';
import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import FamilyContactsDialog from './FamilyContactsDialog/FamilyContactsDialog';
import EducationContactsDialog from './EducationContactsDialog/EducationContactsDialog';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';

const defaultInteractionsTabSettings: InteractionsTabSettings = {
    allowUncontactedFamily: false
}

const InteractionsTab: React.FC<Props> = (props: Props): JSX.Element => {

    const { id, setAreThereContacts } = props;

    const familyMembersStateContext = useContext(familyMembersContext);

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const datesToInvestigate = useSelector<StoreStateType, Date[]>((state) => state.investigation.datesToInvestigate);

    const [interactionToEdit, setInteractionToEdit] = useState<InteractionEventDialogData>();
    const [newInteractionEventDate, setNewInteractionEventDate] = useState<Date>();
    const [interactions, setInteractions] = useState<InteractionEventDialogData[]>([]);
    const [interactionsTabSettings, setInteractionsTabSettings] = useState<InteractionsTabSettings>(defaultInteractionsTabSettings);
    const [educationMembers, setEducationMembers] = useState<InvolvedContact[]>([]);
    const [uncontactedFamilyMembers, setUncontactedFamilyMembers] = useState<InvolvedContact[]>([]);
    const [showEducationMembers, setShowEducationMembers] = useState<boolean>(false);

    const { isInvolved } = useInvolvedContact();
    const classes = useStyles();

    const completeTabChange = () => {
        setFormState(investigationId, id, true);
    }

    const { loadInteractions, loadInvolvedContacts, handleDeleteContactEvent, handleDeleteContactedPerson, saveInvestigaionSettingsFamily } =
        useInteractionsTab({
            setInteractions,
            interactions,
            setAreThereContacts,
            setEducationMembers,
            familyMembersStateContext,
            setInteractionsTabSettings,
            completeTabChange
        });

    const interactionsMap : Map<number, InteractionEventDialogData[]> = useMemo(() => {
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
        return mappedInteractionsArray;
    }, [interactions]);

    const submitTab = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const uncontactedFamilyMembersArray : InvolvedContact[] = familyMembersStateContext.familyMembers.filter(member => !member.isContactedPerson);
        const areThereUncontactedMembers = uncontactedFamilyMembersArray.length > 0;
        if (!interactionsTabSettings.allowUncontactedFamily && areThereUncontactedMembers) {
            setUncontactedFamilyMembers(uncontactedFamilyMembersArray);
        } else {
            completeTabChange();
        }
    };

    const closeFamilyDialog = () => setUncontactedFamilyMembers([]);

    const generateContactCard = (interactionDate: Date) => {
        return (
            <ContactDateCard
                allInteractions={interactions}
                loadInteractions={loadInteractions}
                loadInvolvedContacts={loadInvolvedContacts}
                contactDate={interactionDate}
                onEditClick={(interaction: InteractionEventDialogData) => setInteractionToEdit(interaction)}
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
                datesToInvestigate.map(date => generateContactCard(date))
            }
            {
                newInteractionEventDate && <NewInteractionEventDialog
                    isOpen={Boolean(newInteractionEventDate)}
                    interactionDate={newInteractionEventDate}
                    closeNewDialog={() => setNewInteractionEventDate(undefined)}
                    loadInteractions={loadInteractions}
                    loadInvolvedContacts={loadInvolvedContacts}
                    interactions={interactions}
                />
            }
            {
                interactionToEdit && <EditInteractionEventDialog
                    isOpen={Boolean(interactionToEdit)}
                    eventToEdit={interactionToEdit}
                    closeEditDialog={() => setInteractionToEdit(undefined)}
                    loadInteractions={loadInteractions}
                    loadInvolvedContacts={loadInvolvedContacts}
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
};

export default InteractionsTab;