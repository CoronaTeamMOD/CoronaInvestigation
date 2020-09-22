import { startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import React, {useContext, useEffect} from 'react';

import StoreStateType from 'redux/storeStateType';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import { setInteractions } from 'redux/Interaction/interactionActionCreators';
import {ClinicalDetailsDataAndSet, clinicalDetailsDataContext} from 'commons/Contexts/ClinicalDetailsContext';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';

const InteractionsTab: React.FC = (): JSX.Element => {
    const interactions = useSelector<StoreStateType, Interaction[]>(state => state.interactions);

    const onDateClick = (date: Date) => setNewInteractionEventDate(date);
    const onNewEventDialogClose = () => setNewInteractionEventDate(undefined);
    const onEditEventDialogClose = () => setInteractionToEdit(undefined);
    const startEditInteraction = (interaction: Interaction) => setInteractionToEdit(interaction);

    const clinicalDetailsCtxt: ClinicalDetailsDataAndSet = useContext(clinicalDetailsDataContext);
    const [newInteractionEventDate, setNewInteractionEventDate] = React.useState<Date>();
    const [interactionToEdit, setInteractionToEdit] = React.useState<Interaction>();
    const [interactionsMap, setInteractionsMap] = React.useState<Map<number, Interaction[]>>(new Map<number, Interaction[]>())
    const [coronaTestDate, setCoronaTestDate] = React.useState<Date | null>(null);
    const [investigationStartTime, setInvestigationStartTime] = React.useState<Date | null>(null);
    const { getDatesToInvestigate, addNewInteraction, updateInteraction, 
        getCoronaTestDate, handleDeleteContactEvent } =
        useInteractionsTab({
            setInteractions: setInteractions,
            interactions: interactions,
        });

    useEffect(() => {
        getCoronaTestDate(setCoronaTestDate, setInvestigationStartTime);
    }, []);

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
    }, [interactions]);

    return (
        <>
            {
                getDatesToInvestigate(clinicalDetailsCtxt.clinicalDetailsData.doesHaveSymptoms, clinicalDetailsCtxt.clinicalDetailsData.symptomsStartDate,
                    coronaTestDate, investigationStartTime).map(date =>
                    <ContactDateCard contactDate={date}
                        onEditClick={startEditInteraction}
                        onDeleteClick={handleDeleteContactEvent}
                        createNewInteractionEvent={() => onDateClick(date)}
                        interactions={interactionsMap.get(date.getTime())}
                        key={date.getTime()}
                    />
                    )
            }
            {
                newInteractionEventDate && <NewInteractionEventDialog
                    isOpen={newInteractionEventDate !== undefined}
                    eventDate={newInteractionEventDate}
                    closeDialog={onNewEventDialogClose}
                    handleInteractionCreation={addNewInteraction}
                />
            }
            {
                interactionToEdit && <EditInteractionEventDialog
                    isOpen={interactionToEdit !== undefined}
                    eventToEdit={interactionToEdit}
                    closeDialog={onEditEventDialogClose}
                    updateInteraction={updateInteraction}
                />
            }
        </>
    )
};

export default InteractionsTab;
