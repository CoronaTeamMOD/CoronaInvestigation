import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

const statusConvertorToHistoryFilter = {
    'חדשות': {
        statusFilter: [InvestigationMainStatusCodes.NEW]
    },
    'בטיפול': {
        statusFilter: [InvestigationMainStatusCodes.IN_PROCESS]
    },
    'לא משויכות': {
        unassignedUserFilter: true
    },
    'מוקצות לחוקרים לא פעילים': {
        inactiveUserFilter: true
    }
}

export default statusConvertorToHistoryFilter;