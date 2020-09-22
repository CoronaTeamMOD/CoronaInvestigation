import Interaction from 'models/Contexts/InteractionEventDialogData';

import {store} from '../store';
import * as actionTypes from './interactionActionTypes';

export const setInteractions = (interactions: Interaction[]): void => {
    store.dispatch({
        type: actionTypes.SET_INTERACTIONS,
        payload: {interactions}
    })
}
