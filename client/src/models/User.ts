import Desk from './Desk';
import Language from './Language';
import UserTypeCodes from './enums/UserTypeCodes';

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
    userType: UserTypeCodes;
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