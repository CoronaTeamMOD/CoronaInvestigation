import Desk from './Desk';
import Language from './Language';

interface User {
    id: string;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    serialNumber: number;
    userName: string;
    newInvestigationsCount: number;
    activeInvestigationsCount: number;
    pauseInvestigationsCount: number;
    languages: Language[];
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
