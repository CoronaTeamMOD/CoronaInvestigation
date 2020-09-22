import Interaction from 'models/Contexts/InteractionEventDialogData';

import * as Actions from './interactionActionTypes';

const initialState: Interaction[] = [];

const interactionReducer = (state = initialState, action: Actions.interactionAction): Interaction[] => {
    switch (action.type) {
        case Actions.SET_INTERACTIONS : {
            return action.payload.interactions
        }
          
        default: return state;
    }
}

export default interactionReducer;
