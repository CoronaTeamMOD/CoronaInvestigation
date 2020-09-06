import React from 'react';

import Interaction from 'models/Interaction';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import { StartInvestigationDateVariablesConsumer } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const InteractionsTab: React.FC = (): JSX.Element => {

    const [newInteractionEventDate, setNewInteractionEventDate] = React.useState<Date>();

    const onDateClick = (date: Date) => setNewInteractionEventDate(date);
    const onDialogClose = () => setNewInteractionEventDate(undefined);

    const [interactionsMap, setInteractionsMap] = React.useState<Map<number, Interaction[]>>(new Map<number, Interaction[]>())
    const [interactions, setInteractions] = React.useState<Interaction[]>([
        {
            interactionStartTime: new Date(2020, 7, 30, 17, 50),
            interactionEndTime: new Date(2020, 7, 30, 19, 50),
            placeAddress: 'החורש 1, יהוד מונוסון',
            placeName: 'בית משפחת רום',
            placeType: 'בית', 
            placeNumber: '054-9444188',
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
            interactionStartTime: new Date(2020, 7, 30, 13, 50),
            interactionEndTime: new Date(2020, 7, 30, 15, 50),
            placeAddress: 'החורש 1, יהוד מונוסון',
            placeName: 'בית משפחת רום',
            placeType: 'בית', 
            placeNumber: '054-9444188',
            interactionPersons: [
                {
                    id: '987654321',
                    name: 'עידו פינסקר', 
                    phoneNumber: '050-5737028'
                }
            ]
        }, 
        {
            interactionStartTime: new Date(2020, 8, 1, 17, 50),
            interactionEndTime: new Date(2020, 8, 1, 19, 50),
            placeAddress: 'החורש 1, יהוד מונוסון',
            placeName: 'בית משפחת רום',
            placeType: 'בית', 
            placeNumber: '054-9444188',
            interactionPersons: [
                {
                    id: '123456789',
                    name: 'עומר שמיר', 
                    phoneNumber: '058-5161606'
                }
            ]
        }
    ]);

    const interactionsPerDate = React.useMemo<Map<number, Interaction[]>>(() => {
        const mappedInteractionsArray = new Map<number, Interaction[]>();
        interactions.forEach(interaction => {
            const interactionDate = new Date(interaction.interactionStartTime.getFullYear(), 
                                     interaction.interactionStartTime.getMonth(), 
                                     interaction.interactionStartTime.getDate()).getTime();
            if (mappedInteractionsArray.get(interactionDate) === undefined) {
                mappedInteractionsArray.set(interactionDate, [interaction]);
            } else {
                (mappedInteractionsArray.get(interactionDate) as Interaction[]).push(interaction);
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
                                                createNewInteractionEvent={() => onDateClick(date)} 
                                                interactions={interactionsPerDate.get(date.getTime())}
                                                key={date.getTime()}
                                />
                                )
                        }
                        {
                            newInteractionEventDate && <NewInteractionEventDialog
                                eventDate={newInteractionEventDate}
                                closeDialog={onDialogClose}/>
                        }
                    </>
            }
        </StartInvestigationDateVariablesConsumer>
    )
};

export default InteractionsTab;