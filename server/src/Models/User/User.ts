export default interface User {
    id: string;
    token: string;
    isAdmin: boolean;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    serialNumber: number
    userName: string
}