import InvestigationStatus from './InvestigationMainStatus';

interface GetAllInvestigationStatuses {
    data: {
        allInvestigationStatuses: {
            nodes: InvestigationStatus[]
        }
    }
}

export default GetAllInvestigationStatuses;