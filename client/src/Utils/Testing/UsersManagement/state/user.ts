const user = (userType : number) => {
    return {
        data : {
            userType : userType,
            countyByInvestigationGroup: {
                displayName: 'תל אביב'
            }
        },
        displayedCounty: 555,
        userTypes: [
            {id: 1, displayName: 'חוקר'}
        ]
    }
}

export default user;