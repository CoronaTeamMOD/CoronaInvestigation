import Desk from './Desk';
import Language from './Language';
import UserType from './enums/UserType';

interface User {
    id: string;
    isActive: boolean;
    isDeveloper: boolean;
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
    deskname: string;
    authorityName: string;
    countyByInvestigationGroup: CountyByInvestigationGroup;
    deskByDeskId?: Desk;
    authorityByAuthorityId?: authorityByAuthorityId;
};

interface CountyByInvestigationGroup {
    districtId: number,
    displayName: string
};

interface authorityByAuthorityId {
    authorityName: string
};

export default User;