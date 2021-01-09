import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';

export interface PersonalInfoTabState {
    [PersonalInfoDataContextFields.PHONE_NUMBER]: string;
    [PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]: string;
    [PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]: string;
    [PersonalInfoDataContextFields.CONTACT_INFO]: string;
    [PersonalInfoDataContextFields.INSURANCE_COMPANY]: string;
}