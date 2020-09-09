import React from 'react';
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
    const [interactions, setInteractions] = React.useState<Interaction[]>([
        {
            id: 1,
            investigationId: -1,
            startTime: new Date(2020, 8, 5, 17, 50),
            endTime: new Date(2020, 8, 5, 19, 50),
            locationAddress: {
                city: 'יהוד מונסון',
                street: 'החורש',
                houseNumber: '1',
                floor: '2'
            },
            locationName: 'בית המתוחקר',
            locationType: 'תחבורה',
            locationSubType: 'אוטובוס',
            boardingCity: 'אילת',
            buisnessContactNumber: '054-9444188',
            externalizationApproval: false,
            contacts: [
                {
                    id: '123456789',
                    name: 'עומר שמיר', 
                    phoneNumber: '058-5161606',
                    needsToBeQuarantined: false,
                    moreDetails: ''
                },
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028',
                    needsToBeQuarantined: false,
                    moreDetails: ''
                }
            ]
        }, 
        {
            id: 2,
            investigationId: -1,
            startTime: new Date(2020, 7, 30, 13, 50),
            endTime: new Date(2020, 7, 30, 15, 50),
            locationAddress: {
                city: 'יהוד מונסון',
                street: 'החורש',
                houseNumber: '1',
                floor: '2'
            },
            locationSubType: '',
            locationName: 'בית פרטי אחר',
            locationType: 'בית פרטי', 
            buisnessContactNumber: '054-9444188',
            externalizationApproval: true,
            contacts: [
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028',
                    needsToBeQuarantined: false,
                    moreDetails: ''
                }
            ]
        }, 
        {
            id: 3,
            investigationId: -1,
            locationSubType: '',
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
            contacts: [
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028',
                    needsToBeQuarantined: false,
                    moreDetails: ''
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