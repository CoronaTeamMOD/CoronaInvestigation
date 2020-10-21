interface User {
    id: string;
    token: string;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    serialNumber: number;
    userName: string;
    newInvestigationsCount: number;
    activeInvestigationsCount: number;
    userType: number;
};

export default User;
