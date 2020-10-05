import { startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import React, { useState, useEffect } from 'react';

import { setFormState } from 'redux/Form/formActionCreators';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';

const InteractionsTab: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const [interactionToEdit, setInteractionToEdit] = useState<InteractionEventDialogData>();
    const [newInteractionEventDate, setNewInteractionEventDate] = useState<Date>();
    const [interactionsMap, setInteractionsMap] = useState<Map<number, InteractionEventDialogData[]>>(new Map<number, InteractionEventDialogData[]>())
    const [interactions, setInteractions] = useState<InteractionEventDialogData[]>([]);
    const [coronaTestDate, setCoronaTestDate] = useState<Date | null>(null);
    const [investigationStartTime, setInvestigationStartTime] = useState<Date | null>(null);
    const [doesHaveSymptoms, setDoesHaveSymptoms] = useState<boolean>(false);
    const [symptomsStartDate, setSymptomsStartDate] = useState<Date | null>(null);

    const { getDatesToInvestigate, loadInteractions, getCoronaTestDate, getClinicalDetailsSymptoms, handleDeleteContactEvent } =
        useInteractionsTab({
            setInteractions: setInteractions,
            interactions: interactions
        });

    useEffect(() => {
        loadInteractions();
        getCoronaTestDate(setCoronaTestDate, setInvestigationStartTime);
        getClinicalDetailsSymptoms(setSymptomsStartDate, setDoesHaveSymptoms);
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

    const saveInteraction = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState(investigationId, id, true);
        onSubmit();
    }
    
    return (
        <>
            <form id={`form-${id}`} onSubmit={(e) => saveInteraction(e)}>
                {
                    getDatesToInvestigate(doesHaveSymptoms, symptomsStartDate, coronaTestDate).map(date =>
                        <ContactDateCard 
                            contactDate={date}
                            onEditClick={(interaction: InteractionEventDialogData) => setInteractionToEdit(interaction)}
                            onDeleteClick={handleDeleteContactEvent}
                            createNewInteractionEvent={() => setNewInteractionEventDate(date)}
                            interactions={interactionsMap.get(date.getTime())}
                            key={date.getTime()}
                        />
                        )
                }
                {
                    newInteractionEventDate && <NewInteractionEventDialog
                        isOpen={Boolean(newInteractionEventDate)}
                        interactionDate={newInteractionEventDate}
                        closeNewDialog={() => setNewInteractionEventDate(undefined)}
                        loadInteractions={loadInteractions}
                    />
                }
                {
                    interactionToEdit && <EditInteractionEventDialog
                        isOpen={Boolean(interactionToEdit)}
                        eventToEdit={interactionToEdit}
                        closeEditDialog={() => setInteractionToEdit(undefined)}
                        loadInteractions={loadInteractions}
                    />
                }
            </form>
        </>
    )
};

interface Props {
    id: number;
    onSubmit: () => void;
};

export default InteractionsTab;
