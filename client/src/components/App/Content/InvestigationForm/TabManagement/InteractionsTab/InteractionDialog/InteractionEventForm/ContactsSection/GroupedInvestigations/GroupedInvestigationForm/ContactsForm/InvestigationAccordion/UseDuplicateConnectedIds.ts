import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

const UseDuplicateConnectedIds = (epiNumber : number) => {
    const investigations = useSelector<StoreStateType , ConnectedInvestigation[]>(state => state.groupedInvestigations.investigations.investigationsByGroupId.nodes);
    const indexOfCurrentInvestigation = investigations.map(investigation => investigation.epidemiologyNumber).indexOf(epiNumber);
    const investigationsToSearch = investigations.slice(0 , indexOfCurrentInvestigation);

    let connectedInvestigationsIds : string[] = []
    
    investigationsToSearch.forEach(investigation => {
        investigation.contactEventsByInvestigationId.nodes.forEach(event => {
            event.contactedPeopleByContactEvent.nodes.forEach(person => {
                const {identificationNumber , identificationType} = person.personByPersonInfo;
            
                if(Boolean(identificationNumber) && Boolean(identificationType)) {
                    connectedInvestigationsIds.push(identificationNumber);
                }
            });
        });
    });

    return connectedInvestigationsIds;
}

export default UseDuplicateConnectedIds
