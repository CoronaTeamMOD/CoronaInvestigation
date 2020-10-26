import { Language } from './GetAllLanguagesResponse';

export default interface User {
    id: string;
    token?: string;
    isActive: boolean;
    investigationGroup: number;
    phoneNumber: string;
    userType: number;
    deskName: string;
    serialNumber?: number;
    userName: string;
    fullName: string;
    city: string;
    mail: string;
    sourceOrganization: string;
    languages: Language[];
    newInvestigationsCount: number;
    activeInvestigationsCount: number;
}