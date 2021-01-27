import * as Actions from './GroupedInvestigationsActionTypes';
import GroupedInvestigationReducerType , {initialState} from './GroupedInvestigationsType'; 

const groupedInvestigationReducer = (state = initialState, action: Actions.GroupedInvestigationsAction) : GroupedInvestigationReducerType => {
    switch (action.type) {
        case Actions.SET_GROUP_ID: 
            return {...state , groupId : action.payload}
        case Actions.SET_GROUPED_INVESTIGATIONS: 
            return {...state , investigations : action.payload}

        default: return state;
    }
}

export default groupedInvestigationReducer;