import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

const GetGroupedInvestigationsIds = () => {
    const investigations = useSelector<StoreStateType , ConnectedInvestigation[]>(state => state.groupedInvestigations.investigations.investigationsByGroupId.nodes);
    
    let groupedInvestigationsIds : string[] = [];
    investigations.forEach( investigation => {
        const events = investigation.contactEventsByInvestigationId.nodes;
        events.forEach( event => {
            const persons = event.contactedPeopleByContactEvent.nodes;
            persons.forEach( person => {
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

    const connectedContactsMap = () => {
        let ids = new Map();
        investigations.forEach(investigation => 
            investigation.contactEventsByInvestigationId.nodes.forEach(event => 
                event.contactedPeopleByContactEvent.nodes.forEach(person => {
                    const {identificationType, identificationNumber} = person.personByPersonInfo;
                    if(identificationType && identificationNumber) {
                        ids.set(person.id ,identificationType + identificationNumber);
                    }
                }
            )
        ));

        return ids;
    }

    const connectedInvestigationsIds = (contactsIds : number[]) => {
        const connectedMap = connectedContactsMap();
        let ids: string[] = [];
        contactsIds.forEach(contactId => 
            ids.push(connectedMap.get(contactId))    
        )
        return ids;
    }

    return {
        isGroupedContact,
        connectedInvestigationsIds
    }

}

export default GetGroupedInvestigationsIds;