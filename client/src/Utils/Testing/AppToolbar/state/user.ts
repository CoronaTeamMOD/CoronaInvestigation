const user = (userType : number) => {
    return {
        data : {
            userType : userType,
            countyByInvestigationGroup: {
                displayName: 'תל אביב'
            }
        },
        displayedCounty: 555,
    }
}

export default user;