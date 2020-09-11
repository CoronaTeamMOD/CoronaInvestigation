import React, {useEffect} from 'react';
import { startOfDay } from 'date-fns';

import Interaction from 'models/Contexts/InteractionEventDialogData';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';

const InteractionsTab: React.FC = (): JSX.Element => {

    const onDateClick = (date: Date) => setNewInteractionEventDate(date);
    const onNewEventDialogClose = () => setNewInteractionEventDate(undefined);
    const onEditEventDialogClose = () => setInteractionToEdit(undefined);
    const startEditInteraction = (interaction: Interaction) => setInteractionToEdit(interaction);

    const [newInteractionEventDate, setNewInteractionEventDate] = React.useState<Date>();
    const [interactionToEdit, setInteractionToEdit] = React.useState<Interaction>();
    const [interactionsMap, setInteractionsMap] = React.useState<Map<number, Interaction[]>>(new Map<number, Interaction[]>())
    const [interactions, setInteractions] = React.useState<Interaction[]>([]);
    const { getDatesToInvestigate, loadInteractions } =
        useInteractionsTab({
            setInteractions: setInteractions,
            interactions: interactions
        });
    useEffect(() => {
        loadInteractions();
    }, []);
    const interactionsPerDate = React.useMemo<Map<number, Interaction[]>>(() => {
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
        })
        return mappedInteractionsArray;
    }, [interactions]);

    return (
        <StartInvestigationDateVariablesConsumer>
            {
                ctxt =>
                    <>
                        {
                            getDatesToInvestigate(ctxt)
                            .map(date => 
                                <ContactDateCard contactDate={date}
                                    onEditClick={startEditInteraction}
                                    createNewInteractionEvent={() => onDateClick(date)} 
                                    interactions={interactionsPerDate.get(date.getTime())}
                                    key={date.getTime()}
                                />
                                )
                        }
                        {
                            newInteractionEventDate && <NewInteractionEventDialog
                                isOpen={newInteractionEventDate !== undefined}
                                eventDate={newInteractionEventDate}
                                closeDialog={onNewEventDialogClose}/>
                        }
                                                {
                            interactionToEdit && <EditInteractionEventDialog
                                isOpen={interactionToEdit !== undefined}
                                eventToEdit={interactionToEdit}
                                closeDialog={onEditEventDialogClose}/>
                        }
                    </>
            }
        </StartInvestigationDateVariablesConsumer>
    )
};

export default InteractionsTab;