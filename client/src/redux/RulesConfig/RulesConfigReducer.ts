import  { RuleConfigRedux } from 'models/RulesConfig';
import * as Actions from './RulesConfigActionTypes';

const initialState: RuleConfigRedux = {};

const rulesConfigReducer = (state = initialState, action: Actions.rulesConfigAction) => {
    switch (action.type) {
        case Actions.SET_IF_CONTACTS_NEED_ISOLATION:
            return {...state, ifContactsNeedIsolation: action.payload.ifContactsNeedIsolation }
        case Actions.SETTINGS_FOR_STATUS_VALIDITY:
            return {...state, settingsForStatusValidity: action.payload.settingsForStatusValidity }
        default:
            return state;
    };
};

export default rulesConfigReducer;