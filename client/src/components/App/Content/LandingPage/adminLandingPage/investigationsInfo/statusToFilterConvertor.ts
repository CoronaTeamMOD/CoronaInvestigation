const statusConvertorToHistoryFilter = {
    'חדשות': {
        statusFilter: [1]
    },
    'בטיפול': {
        statusFilter: [100000002]
    },
    'לא משויכות': {
        unassignedUserFilter: true
    },
    'מוקצות לחוקרים לא פעילים': {
        inactiveUserFilter: true
    }
}

export default statusConvertorToHistoryFilter;