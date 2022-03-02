import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';

export interface PersonalInfoTabState {
    [PersonalInfoDataContextFields.PHONE_NUMBER]: string;
    [PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]: string;
    [PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]: string;
    [PersonalInfoDataContextFields.CONTACT_INFO]: string;
    [PersonalInfoDataContextFields.INSURANCE_COMPANY]: string;
    [PersonalInfoDataContextFields.RELEVANT_OCCUPATION]: string;
    [PersonalInfoDataContextFields.INSTITUTION_NAME]: string;
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]?: string;
    [PersonalInfoDataContextFields.ROLE]?: number;
    [PersonalInfoDataContextFields.EDUCATION_GRADE]?: number;
    [PersonalInfoDataContextFields.EDUCATION_CLASS_NUMBER]?: number;
    [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]?: string;
    [PersonalInfoDataContextFields.ADDRESS]: {
        [PersonalInfoDataContextFields.CITY]: string;
        [PersonalInfoDataContextFields.STREET]: string;
        [PersonalInfoDataContextFields.HOUSE_NUMBER]: string;
        [PersonalInfoDataContextFields.APARTMENT]?: string;
    }
    personalInfoWasChanged: boolean;
}