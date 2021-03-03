import { useContext } from 'react';
import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';

const useAccordionContent = (props: Props) => {
    const { groupedInvestigationContacts, eventContactIds } = useContext(groupedInvestigationsContext);
    const { events , query } = props;
    const getCurrentSelectedRowsLength = () => {
        let count = 0;
        events.forEach(
            event => event.contactedPeopleByContactEvent.nodes.forEach(
                person => {
                    const { id } = person;
                    groupedInvestigationContacts.includes(id) && count++;
                }
            )
        );

        return count;
    }

    const existingIds = eventContactIds 
    ? eventContactIds.map(contact => {
        if(contact) { 
            return contact;
        }
        return "";
    })
    : [];

    const filteredEvents =
        events.flatMap( event => {
            return event.contactedPeopleByContactEvent.nodes.filter( person => {
                const {identificationNumber , firstName , lastName, phoneNumber } = person.personByPersonInfo;

                return identificationNumber?.includes(query) || firstName?.includes(query) || lastName?.includes(query) || phoneNumber?.includes(query);
            })
        })

    return {
        getCurrentSelectedRowsLength,
        filteredEvents,
        existingIds
    }
}

interface Props {
    events : ContactEvent[];
    query : string;
}

export default useAccordionContent;