import * as Actions from './investigationActionTypes';
import InvestigationRedux from 'models/InvestigationRedux';

const initialState: InvestigationRedux = {
    epidemiologyNumber: '111',
    cantReachInvestigated: false,
}

const investigationReducer = (state = initialState, action: Actions.InvestigationAction) : InvestigationRedux => {
    switch (action.type) {
        case Actions.SET_EPIDEMIOLOGY_NUM : return {...state, epidemiologyNumber: action.payload.epidemiologyNumber}
        case Actions.SET_CANT_REACH_INVESTIGATED : return {...state, cantReachInvestigated: action.payload.cantReachInvestigated}

        default:  return state;
    }
}

export default investigationReducer;