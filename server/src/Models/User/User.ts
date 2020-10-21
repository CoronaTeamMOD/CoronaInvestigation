import { Language } from './GetAllLanguagesResponse';

export default interface User {
    id: string;
    token?: string;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    userType: number;
    serialNumber?: number
    userName: string,
    fullName: string,
    city: string,
    mail: string,
    sourceOrganization: string
    languages: Language[]
}