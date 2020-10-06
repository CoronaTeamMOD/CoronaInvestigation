interface InvestigationRedux {
    epidemiologyNumber: number;
    cantReachInvestigated: boolean;
    investigatedPatientId: number;
    creator: string;
    lastUpdator: string;
    lastOpenedEpidemiologyNumber: number;
    isCurrentlyLoading: boolean;
}

export default InvestigationRedux;
