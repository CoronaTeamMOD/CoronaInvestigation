import Desk from './Desk';

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
    deskName: string;
    countyByInvestigationGroup: CountyByInvestigationGroup;
    deskByDeskId?: Desk;
};

interface CountyByInvestigationGroup {
    districtId: number
};

export default User;
