import { Language } from './GetAllLanguagesResponse';

export default interface User {
    id: string;
    token?: string;
    isAdmin: boolean;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    serialNumber?: number
    userName: string,
    fullName: string,
    city: string,
    mail: string,
    sourceOrganization: string
    languages: Language[]
}