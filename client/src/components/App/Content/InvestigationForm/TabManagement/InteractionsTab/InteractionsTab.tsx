import React from 'react';
import { startOfDay } from 'date-fns';

import Interaction from 'models/Interaction';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const InteractionsTab: React.FC = (): JSX.Element => {

    const onDateClick = (date: Date) => setNewInteractionEventDate(date);
    const onDialogClose = () => setNewInteractionEventDate(undefined);
    const startEditInteraction = (interaction: Interaction) => {
        setInteractionToEdit(interaction);
        setNewInteractionEventDate(interactionToEdit?.startTime)
    }
    
    const [newInteractionEventDate, setNewInteractionEventDate] = React.useState<Date>();
    const [interactionToEdit, setInteractionToEdit] = React.useState<Interaction>();
    const [interactionsMap, setInteractionsMap] = React.useState<Map<number, Interaction[]>>(new Map<number, Interaction[]>())
    const [interactions, setInteractions] = React.useState<Interaction[]>([
        {
            id: 1,
            startTime: new Date(2020, 7, 30, 17, 50),
            endTime: new Date(2020, 7, 30, 19, 50),
            locationAddress: {
                city: 'יהוד מונסון',
                street: 'החורש',
                houseNumber: '1',
                floor: '2'
            },
            locationName: 'בית פרטי של המתוחקר',
            locationType: 'בית פרטי', 
            buisnessContactNumber: '054-9444188',
            externalizationApproval: false,
            interactionPersons: [
                {
                    id: '123456789',
                    name: 'עומר שמיר', 
                    phoneNumber: '058-5161606'
                },
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028'
                }
            ]
        }, 
        {
            id: 2,
            startTime: new Date(2020, 7, 30, 13, 50),
            endTime: new Date(2020, 7, 30, 15, 50),
            locationAddress: {
                city: 'יהוד מונסון',
                street: 'החורש',
                houseNumber: '1',
                floor: '2'
            },
            locationName: 'בית פרטי אחר',
            locationType: 'בית פרטי', 
            buisnessContactNumber: '054-9444188',
            externalizationApproval: true,
            interactionPersons: [
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028'
                }
            ]
        }, 
        {
            id: 3,
            startTime: new Date(2020, 7, 30, 13, 50),
            endTime: new Date(2020, 7, 30, 15, 50),
            locationAddress: {
                city: 'יהוד מונסון',
                street: 'החורש',
                houseNumber: '1',
                floor: '2'
            },
            locationName: 'בית פרטי אחר',
            locationType: 'בית פרטי', 
            buisnessContactNumber: '054-9444188',
            externalizationApproval: true,
            interactionPersons: [
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028'
                }
            ]
        }, 
    ]);

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
    }, [interactions])

    const { getDatesToInvestigate, loadInteractions } = 
        useInteractionsTab({
            setInteractions: setInteractionsMap,
            interactions: interactionsMap
        });

    React.useEffect(() => {
        loadInteractions();
    }, []);

    React.useEffect(() => {
        if (interactionToEdit) setNewInteractionEventDate(interactionToEdit.startTime);
    }, [interactionToEdit])

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
                                closeDialog={onDialogClose}
                                interactionToEdit={interactionToEdit}/>
                        }
                    </>
            }
        </StartInvestigationDateVariablesConsumer>
    )
};

export default InteractionsTab;