interface User {
    id: string;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    serialNumber: number;
    userName: string;
    newInvestigationsCount: number;
    activeInvestigationsCount: number;
    userType: number;
    sourceOrganization: string;
    countyByInvestigationGroup: CountyByInvestigationGroup;
};

interface CountyByInvestigationGroup {
    districtId: number
};

export default User;
