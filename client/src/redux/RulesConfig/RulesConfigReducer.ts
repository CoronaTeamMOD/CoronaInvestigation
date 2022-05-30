import  { RuleConfigRedux } from 'models/RulesConfig';
import * as Actions from './RulesConfigActionTypes';

const initialState: RuleConfigRedux = {};

const rulesConfigReducer = (state = initialState, action: Actions.rulesConfigAction) => {
    switch (action.type) {
       case Actions.SET_IF_CONTACTS_NEED_ISOLATION:
            return {...state, ifContactsNeedIsolation: action.payload.ifContactsNeedIsolation }
        default:
            return state;
    };
};

export default rulesConfigReducer;