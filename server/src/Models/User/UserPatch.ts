import { Language } from './GetAllLanguagesResponse';

export default interface UserPatch {
    idInput: string
    investigationGroupInput: number;
    phoneNumberInput: string;
    deskInput: string;
    cityInput: string;
    mailInput: string;
    sourceOrganizationInput: string;
    languagesInput: Language[];
};