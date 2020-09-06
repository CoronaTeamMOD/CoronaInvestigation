export const SET_EPIDEMIOLOG_NUM = 'SET_EPIDEMIOLOGY_NUM';
export const SET_CANT_REACH_INVESTIGATED = 'SET_CANT_REACH_INVESTIGATED';

interface SetEpidemiologyNum {
    type: typeof SET_EPIDEMIOLOG_NUM,
    payload: {epidemiologyNum : string}
}

interface SetCantReachInvestigated {
    type: typeof SET_CANT_REACH_INVESTIGATED,
    payload: {cantReachInvestigated : boolean}
}

export type InvestigationAction = SetEpidemiologyNum | SetCantReachInvestigated;