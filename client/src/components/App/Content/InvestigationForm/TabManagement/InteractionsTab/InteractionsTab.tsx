import React, { useState, useContext, useEffect } from 'react';
import { startOfDay } from 'date-fns';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';
import {ClinicalDetailsDataAndSet, clinicalDetailsDataContext} from 'commons/Contexts/ClinicalDetailsContext';

const InteractionsTab: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {

    const clinicalDetailsCtxt: ClinicalDetailsDataAndSet = useContext(clinicalDetailsDataContext);

    const [interactionToEdit, setInteractionToEdit] = useState<InteractionEventDialogData>();
    const [newInteractionEventDate, setNewInteractionEventDate] = useState<Date>();
    const [interactionsMap, setInteractionsMap] = useState<Map<number, InteractionEventDialogData[]>>(new Map<number, InteractionEventDialogData[]>())
    const [interactions, setInteractions] = useState<InteractionEventDialogData[]>([]);
    const [coronaTestDate, setCoronaTestDate] = useState<Date | null>(null);
    const [investigationStartTime, setInvestigationStartTime] = useState<Date | null>(null);

    const { getDatesToInvestigate, loadInteractions, getCoronaTestDate, handleDeleteContactEvent } =
        useInteractionsTab({
            setInteractions: setInteractions,
            interactions: interactions
        });

    useEffect(() => {
        loadInteractions();
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

    const SaveInteraction = (e : any) => {
        e.preventDefault();
        console.log("Interaction");
        onSubmit();
    }
    
    return (
        <>
            <form id={`form-${id}`} onSubmit={(e) => SaveInteraction(e)}>
                {
                    getDatesToInvestigate(clinicalDetailsCtxt.clinicalDetailsData.doesHaveSymptoms, clinicalDetailsCtxt.clinicalDetailsData.symptomsStartDate,
                                          coronaTestDate).map(date =>
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
    id: number,
    onSubmit: any
}

export default InteractionsTab;