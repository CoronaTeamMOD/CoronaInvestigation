interface GetAllInvestigationStatuses {
    data: {
        allInvestigationStatuses: {
            nodes: InvestigationStatusName[]
        }
    }
}

interface InvestigationStatusName {
    displayName: string;
}

export default GetAllInvestigationStatuses;