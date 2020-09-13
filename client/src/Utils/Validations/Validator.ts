const IsraelPhoneNumberRegEx = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/

const phoneValidation = (phoneNumber: string) => {
    return IsraelPhoneNumberRegEx.test(phoneNumber);
}

const Validator = {
    phoneValidation
}

export default Validator;
