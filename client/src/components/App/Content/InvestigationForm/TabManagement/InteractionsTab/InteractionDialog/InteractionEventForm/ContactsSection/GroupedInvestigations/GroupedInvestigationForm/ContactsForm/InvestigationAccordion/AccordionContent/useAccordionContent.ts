import { useContext } from 'react';
import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';

const useAccordionContent = (props: Props) => {
    const { allContactIds } = useContext(groupedInvestigationsContext);
    const { selectedRows , events } = props;
    const getCurrentSelectedRowsLength = () => {
        let count = 0;
        events.forEach(
            event => event.contactedPeopleByContactEvent.nodes.forEach(
                person => {
                    const { id } = person;
                    selectedRows.includes(id) && count++;
                }
            )
        );

        return count;
    }

    const existingIds = allContactIds.map(contact => {
        if(contact.id) { 
            return contact.id;
        }
        return "";
    })!;

    return {
        getCurrentSelectedRowsLength,
        existingIds
    }
}

interface Props {
    selectedRows : number[];
    events : ContactEvent[];
}

export default useAccordionContent;