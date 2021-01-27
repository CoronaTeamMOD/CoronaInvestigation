import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

const GetGroupedInvestigationsIds = () => {
    const investigations = useSelector<StoreStateType , ConnectedInvestigation[]>(state => state.groupedInvestigations.investigations.investigationsByGroupId.nodes);
    
    let groupedInvestigationsIds : string[] = [];
    investigations.forEach( investigation => {
        const events = investigation.contactEventsByInvestigationId.nodes;
        return events.forEach( event => {
            const persons = event.contactedPeopleByContactEvent.nodes;
            return persons.forEach( person => {
                const {identificationNumber} = person.personByPersonInfo
                if(identificationNumber){
                    groupedInvestigationsIds.push(identificationNumber);
                }
            })
        })
    })

    const isGroupedContact = (id? : string) => {
        return id && groupedInvestigationsIds.indexOf(id) !== -1;
    }

    return {
        isGroupedContact
    }

}

export default GetGroupedInvestigationsIds;