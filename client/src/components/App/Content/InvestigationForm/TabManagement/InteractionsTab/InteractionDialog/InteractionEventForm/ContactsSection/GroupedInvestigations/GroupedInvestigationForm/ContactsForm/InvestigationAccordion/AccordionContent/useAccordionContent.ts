import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

const useAccordionContent = (props: Props) => {
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
    return {
        getCurrentSelectedRowsLength
    }
}

interface Props {
    selectedRows : number[];
    events : ContactEvent[];
}

export default useAccordionContent;