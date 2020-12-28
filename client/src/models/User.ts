import Desk from './Desk';
import Language from './Language';
import UserType from './enums/UserType';

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
    userType: UserType;
    sourceOrganization: string;
    deskName: string;
    countyByInvestigationGroup: CountyByInvestigationGroup;
    deskByDeskId?: Desk;
};

interface CountyByInvestigationGroup {
    districtId: number
};

export default User;
