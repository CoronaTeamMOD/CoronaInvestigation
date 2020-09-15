interface PhoneNumberControl {
    number: string;
    isValid: boolean;
}

export const initialPhoneNumberControl : PhoneNumberControl = {
    number: '',
    isValid: true
}

export default PhoneNumberControl;