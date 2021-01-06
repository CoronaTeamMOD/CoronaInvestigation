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

export interface FetchedUser {
    id: string;
    isactive: boolean;
    investigationgroup: number;
    phonenumber: string;
    serialnumber: number;
    username: string;
    newinvestigationscount: number;
    activeinvestigationscount: number;
    usertype: number;
    sourceorganization: string;
    deskname?: string;
    deskid?: number;   
};

interface CountyByInvestigationGroup {
    districtId: number
};

export default User;
