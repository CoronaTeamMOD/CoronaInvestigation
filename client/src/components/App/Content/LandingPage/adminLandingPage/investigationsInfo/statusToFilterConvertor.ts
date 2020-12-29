const statusConvertor = {
    'חדשות': {
        investigationStatusByInvestigationStatus: {
            id: {equalTo: 1}
        }
    },
    'בטיפול': {
        investigationStatusByInvestigationStatus: {
            id: {equalTo: 100000002}
        }
    },
    'לא משויכות': {
        userByCreator: {
            userName: {equalTo: "לא משויך"}
        }
    },
    'מוקצות לחוקרים לא פעילים': {
        userByCreator: {
            isActive: {equalTo: false},
            userName: {notEqualTo: "לא משויך"}
        }
    }
}

export default statusConvertor;