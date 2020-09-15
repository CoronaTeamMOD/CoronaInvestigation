import {DBAddress} from '../Address';
import PhoneNumberControl from '../PhoneNumberControl';

export interface personalInfoContextData {
    phoneNumber: PhoneNumberControl;
    additionalPhoneNumber: PhoneNumberControl;
    contactPhoneNumber: PhoneNumberControl;
    insuranceCompany: string,
    address: DBAddress;
    relevantOccupation: string;
    educationOccupationCity: string;
    institutionName: string;
    otherOccupationExtraInfo: string;
}