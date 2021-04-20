const user = (userType : number) => {
    return {
        data: {
            id: '1',
            userName: 'test user',
            investigationGroup: -1,
            isActive: false,
            isDeveloper: false,
            phoneNumber: '',
            serialNumber: -1,
            activeInvestigationsCount: 0,
            newInvestigationsCount: 0,
            pauseInvestigationsCount: 0,
            languages: [],
            userType : userType,
            sourceOrganization: '',
            deskName: '',
            deskname: '',
            authorityName: '',
            countyByInvestigationGroup: {
                displayName: 'תל אביב'
            },
            authorityByAuthorityId: {
                authorityName: ''
            }
        },
        isLoggedIn: true,
        displayedCounty: 555,
        displayedDistrict: -1,
        userTypes: []
    }
};

export default user;